import AttendenceForm from "@/components/AttendenceForm";
import AppButton from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";
import NotificationBanner, {
  NotificationBannerRef,
} from "@/components/NotificationBanner";
import { useApp } from "@/context/app";
import axios from "axios";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";


interface AttendanceData {
  missingAttendanceDates: string[];
}

interface ClassData {
  id: string;
  title: string;
  teacher_code: string;
  student_code: string;
  start: string;
  end: string;
  status: string;
  room: string;
  salary: string | null;
  active: string;
}

interface ProgressData {
  id: string;
  code: string;
  teacher_code: string;
  role_id: string;
  date: string;
  attendance: string;
  education_type: string;
  course_name: string;
  lesson_progress: string;
  class_start_time: string;
  namaz: string;
  problem: string;
  class_type: string;
  namaz_reasons: string;
  problem_solved: string;
  monthly_project: string;
  leave_reason: string;
  test_details: string;
  class_progress: string | null;
}

interface PageData {
  missing_attendance_dates: string[];
  classes: ClassData[];
  progress: ProgressData[];
}


export default function Classes() {
  const { TeacherID, StudentID, StudentName } = useLocalSearchParams();

  const teacherID = Array.isArray(TeacherID) ? TeacherID[0] : TeacherID;
  const studentID = Array.isArray(StudentID) ? StudentID[0] : StudentID;
  const studentName = Array.isArray(StudentName) ? StudentName[0] : StudentName;

  const { students, fetchData } = useApp();
  const [pageData, setPageData] = useState<PageData | null>(null)

  const [AttendenceModal, setAttendenceModal] = useState(false);
  const [AttendenceLoading, SetAttendenceLoading] = useState(false);

  const router = useRouter();

  const notificationBannerRef = useRef<NotificationBannerRef>(null);

  const showBanner = (message: string, type: "success" | "error") => {
    notificationBannerRef.current?.handleShowBanner(message, type);
  };

  const handleMarkAttendencePress = async (AttendenceData: FormData) => {

    SetAttendenceLoading(true);

    try {
      const response = await axios.post(
        "http://lms.knowledgequran.info/teacher/mystudent_app/add", AttendenceData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      if (response.data.status === "success") {
        showBanner("Student Added Successfully!", "success");
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
      SetAttendenceLoading(false)
    }
  };

  
  const GetInfo = async () => {
    try {
        const response = await axios.get(`http://lms.knowledgequran.info/teacher/mystudent_app/${teacherID}/${studentID}`);

      if (response.data.status === "success") {
        setPageData(response.data.data);
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
  }, [])


  const ListItem: React.FC<{ classes: ClassData; isExpanded?: boolean; onPress?: () => void;}> = ({ classes }) => {
    
    const statusColor = classes.status === "2" ? 'bg-green-200' : classes.status === "1" ? 'bg-yellow-200' : 'bg-red-200';
    const meet_link = classes.title + classes.teacher_code + classes.student_code;
    const Title = classes.title
        
    return (
    <View className='my-2 border-primary bg-primary-20 py-3 px-4 border rounded-lg'>

      <Text className='text-h1 font-semibold pb-1'>{classes.title}</Text>
      <View className='px-2 flex flex-row items-center justify-between flex-wrap'>
        <View className='flex flex-row '>
          <Text className="text-text font-medium text-green-950">Status:</Text>
          <Text className={`text-text text-green-900 ml-3 px-2 rounded-md ${statusColor}`}>
            {classes.status === "2" ? 'Active' : classes.status === "1" ? 'Pending' : 'Expired'}
          </Text>
        </View>
      </View>

      <AppButton
        title='join meeting'
        class_Name='mt-3 bg-primary mx-4'
        textClassName='font-bold text-text'
        onPress={() => {
          router.push({
            pathname: "/(teacher)/meeting",
            params: { meet_link, Title, StudentName },
          });
        }}
      />
      
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

      <NotificationBanner ref={notificationBannerRef} message="" type="success"/>
      
      <AttendenceForm
        visible={AttendenceModal}
        onClose={() => setAttendenceModal(false)}
        onSubmit={handleMarkAttendencePress}
        title="Mark Attendence"
        studentName={studentName}
        studentID={studentID}
        TeacherID={teacherID}
      />

      <View className="w-[85%] flex flex-row items-center justify-between">
        <AppButton
          title="Mark Attendence"
          class_Name="h-12 bg-primary px-5 w-full"
          textClassName="font-bold"
          onPress={() => {
            setAttendenceModal(true);
          }}
          Loading= {AttendenceLoading}
        />
      </View>
      
      <View className="w-full items-start ">
        <Text className="mt-6 justify-start text-heading font-bold bg-transparent">
          Live classes for {studentName}
        </Text>
      </View>

      {pageData?.classes.length > 0 ? (
        <View className="w-[90%]">
          <FlatList
            data={pageData?.classes}
            renderItem={({item}) => <ListItem classes={item} />}
            initialNumToRender = {10}
          />
        </View> 
        ) : (
        <View className="w-full h-1/2 items-center justify-center">
          <Text className="mt-4 justify-start text-text font-semibold bg-transparent">
            No classes right now
          </Text>
        </View>          

        )
      }
    </View>
  );
}
