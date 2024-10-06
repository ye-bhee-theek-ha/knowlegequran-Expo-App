import AddStudentMarks from "@/components/AddstudentMarks";
import AttendenceForm from "@/components/AttendenceForm";
import AppButton from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";
import NotificationBanner, {
  NotificationBannerRef,
} from "@/components/NotificationBanner";
import { Student } from "@/constants/types";
import { useApp } from "@/context/app";
import { useAuth } from "@/context/auth";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";


interface Mark {
  id: string;
  date: string; // Assuming date format as string (e.g., "2024-02-03")
  teacher_code: string;
  student_code: string;
  test_name: string;
  total_marks: string; // Keep as string if you expect it in string format
  obtained_marks: string; // Keep as string if you expect it in string format
}

interface PageData {
  students: Student[];
  marks: Mark[];
}


export default function Marks() {

  const {user} = useAuth();

  const { students, fetchData } = useApp();
  const [pageData, setPageData] = useState<PageData | null>(null)

  const [MarksModal, setMarksModal] = useState(false);
  const [MarksLoading, SetMarksLoading] = useState(false);

  const notificationBannerRef = useRef<NotificationBannerRef>(null);

  const showBanner = (message: string, type: "success" | "error") => {
    notificationBannerRef.current?.handleShowBanner(message, type);
  };

  const handleAddMarksSubmit = async (TestMarksData: FormData) => {
    SetMarksLoading(true);
    try {
      const response = await axios.post(
        "http://lms.knowledgequran.info/teacher/manage_marks_app/add", 
        TestMarksData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        showBanner("Student Marks Added Successfully!", "success");
        fetchData();
        console.log("here");
      } else if (response.data.status === "error") {
        showBanner(`${response.data.message} `, "error");
      }
    } catch (error) {
      showBanner(`Error Occured: ${error}`, "error");
      console.log("err : ", error);
    }
    finally {
      SetMarksLoading(false);
    }
  };

  
  const GetInfo = async () => {
    try {
        const response = await axios.get(`http://lms.knowledgequran.info/teacher/manage_marks_app/${user.user_code}`);

      if (response.data.status === "success") {
        setPageData(response.data.data)
        return;
      } 
      else
      {
        throw new Error('Network Error.');
      }

    } catch (error) {

        if (error instanceof Error) {
          throw new Error(error.message || 'An error occurred while fetching.');
        } 
        else {
          throw new Error('An unknown error occurred.');
        }
      }
  };

  useEffect(() => {
    GetInfo();
    console.log(pageData)
  }, [])


  const ListItem: React.FC<{ marks:Mark ; isExpanded?: boolean; onPress?: () => void;}> = ({ marks }) => {
    
    // const statusColor = classes.status === "2" ? 'bg-green-200' : classes.status === "1" ? 'bg-yellow-200' : 'bg-red-200';
    const student = students.find((t: Student) => t.student_code === marks.student_code)

    return (
    <View className='my-2 border-primary bg-primary-20 py-3 px-4 border rounded-lg'>
      <View className="flex flex-row">
        <Text className='text-h1 font-medium pb-1 flex flex-wrap'>Test name: </Text>
        <Text className='text-h1 font-semibold pb-1 flex flex-wrap'>{marks.test_name}</Text>
      </View>
      <View className='px-2 mt-2 flex flex-col '>
          <Text className="text-heading font-medium text-green-950">{student?.student_name} ({student?.student_code})</Text>
          <Text className="text-text font-medium text-green-950">Date: {marks.date}</Text>
      </View>
      <Text className='text-h1 font-semibold pb-1 my-2 text-center'>{marks.obtained_marks} / {marks.total_marks}</Text>

    </View>
  )};

  if (pageData === null)
    {
      return(
        <View className='flex flex-1 items-center justify-center'>
  
          <Text className='font-semibold text-xl'> Loading... </Text>
  
          <View>
            <LoadingSpinner
              isLoading = {true}
              size={40}
              style={{ marginTop: 8 }}
              color='black'
            />
          </View>
        </View>
      )
    }

  return (
    <View className="flex flex-1 items-center bg-white py-4 px-5">

      <NotificationBanner ref={notificationBannerRef} type="success" message=""/>

      <AddStudentMarks
        visible = {MarksModal}
        onClose={() => setMarksModal(false)}
        onSubmit={handleAddMarksSubmit}
        title="Add Student Marks"
        teacherID={user.user_code}
        students= {pageData.students}
      />

      <View className="w-[85%] flex flex-row items-center justify-between">
        <AppButton
          title="Add Student Marks"
          class_Name="h-12 bg-primary px-5 w-full"
          textClassName="font-bold"
          onPress={() => {
            setMarksModal(true);
          }}
          Loading= {MarksLoading}
        />
      </View>
      
      <View className="w-full items-start ">
        <Text className="mt-6 justify-start text-heading font-bold bg-transparent">
          Marks
        </Text>
      </View>

      {pageData?.marks.length > 0 ? (
        <View className="w-[90%]">
          <FlatList
            data={pageData?.marks}
            renderItem={({item}) => <ListItem marks={item} />}
            initialNumToRender = {10}
          />
        </View> 
        ) : (
        <View className="w-full h-1/2 items-center justify-center">
          <Text className="mt-4 justify-start text-text font-semibold bg-transparent">
            No Tests marked Yet
          </Text>
        </View>          

        )
      }
    </View>
  );
}
