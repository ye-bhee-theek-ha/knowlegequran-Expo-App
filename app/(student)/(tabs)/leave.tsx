import AddLeaveModal from "@/components/AddLeaveRequest";
import AppButton from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";
import NotificationBanner, {
  NotificationBannerRef,
} from "@/components/NotificationBanner";
import { useAuth } from "@/context/auth";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

interface Leaves {
  id: string;
  student_code: string;
  type: string;
  start_date: string;
  end_date: string;
  status: string;
  comment: string | null;
  teacher_code: string | null;
  start: string | null;
  end: string | null;
  room: string | null;
  class_status: string;
}

interface PageData {
  leaves: Leaves[];
}


export default function Marks() {

  const {user} = useAuth();

  const [pageData, setPageData] = useState<PageData | null>(null)

  const [LeavesModal, setLeavesModal] = useState(false);
  const [LeavesLoading, SetLeavesLoading] = useState(false);

  const notificationBannerRef = useRef<NotificationBannerRef>(null);

  const showBanner = (message: string, type: "success" | "error") => {
    notificationBannerRef.current?.handleShowBanner(message, type);
  };

  const handleAddLeavesSubmit = async (leaveData: FormData) => {
    SetLeavesLoading(true);
    console.log(leaveData)
    try {
      const response = await axios.post(
        "http://lms.knowledgequran.info/student/leave_app/submit", 
        leaveData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        showBanner("Leave Request Added Successfully!", "success");
        console.log("here");
      } else if (response.data.status === "error") {
        showBanner(`${response.data.message} `, "error");
      }
    } catch (error) {
      showBanner(`Error Occured: ${error}`, "error");
      console.log("err : ", error);
    }
    finally {
      SetLeavesLoading(false);
      GetInfo();
    }
  };


  const handleDeleteLeave = async (leaveId: string) => {
      try {
        const response = await axios.get(`http://lms.knowledgequran.info/student/leave_app/delete/${leaveId}`);

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
      finally {
        GetInfo();
      };
    };
   
  
  const GetInfo = async () => {
    try {
        const response = await axios.get(`http://lms.knowledgequran.info/student/leave_app/${user.user_code}`);

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


  const ListItem: React.FC<{leave:Leaves; onDelete:(id:string)=>void }> = ({ leave, onDelete }) => {
    const statusLabel = leave.status === "0" ? "Pending" : "Approved";
    const statusBgColor = leave.status === "0" ? "bg-yellow-300" : "bg-green-500";
    const statusTextColor = leave.status === "0" ? "text-black" : "text-white";
  
    return (
      <View className="w-full flex-row justify-between items-center border-primary border rounded-lg bg-primary-10 shadow-sm mb-4 p-2">
        <View className="flex-1">
          <Text className="text-h1 text-black font-semibold">
            {leave.type}
          </Text>

          <View className="mb-2 text-medium">
            <Text className="text-medium text-black">Start Date:</Text>
            <Text className="text-medium text-black font-semibold">{leave.start_date}</Text>
          </View>
          
          <View className="mb-2 text-medium">
            <Text className="text-medium text-black">End Date:</Text>
            <Text className="text-medium text-black font-semibold">{leave.end_date}</Text>
          </View>
        </View>
  
        <View className="flex flex-col items-center justify-evenly">
          <View className={`px-2 py-1 rounded-md mb-4 ${statusBgColor}`}>
            <Text className={`text-medium font-semibold ${statusTextColor}`}>
              {statusLabel}
            </Text>
          </View>
    
          <TouchableOpacity
            onPress={() => onDelete(leave.id)}
            className="bg-red-500 px-3 py-2 rounded-lg"
          >
            <Text className="text-white font-semibold text-medium">
              <AntDesign name="close" size={14} color="white" /> Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
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

      <AddLeaveModal
        visible = {LeavesModal}
        onClose={() => setLeavesModal(false)}
        onSubmit={handleAddLeavesSubmit}
        title="Add Leave Request"
        studentID={user.user_code}
      />

      <View className="w-[85%] flex flex-row items-center justify-between">
        <AppButton
          title="Add Leave Request"
          class_Name="h-12 bg-primary px-5 w-full"
          textClassName="font-bold"
          onPress={() => {
            setLeavesModal(true);
          }}
          Loading= {LeavesLoading}
        />
      </View>
      
      <View className="w-full items-start ">
        <Text className="mt-6 justify-start text-heading font-bold bg-transparent mb-4">
          My Leaves
        </Text>
      </View>

      {pageData?.leaves.length > 0 ? (
        <View className="w-[90%]">
          <FlatList
            data={pageData?.leaves}
            renderItem={({item}) => <ListItem leave={item} onDelete={(id) => handleDeleteLeave(id)} />}
            initialNumToRender = {10}
          />
        </View> 
        ) : (
        <View className="w-full h-1/2 items-center justify-center">
          <Text className="mt-4 justify-start text-text font-semibold bg-transparent">
            No Leaves Yet
          </Text>
        </View>          

        )
      }
    </View>
  );
}
