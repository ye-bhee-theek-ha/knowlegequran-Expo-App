import { Text, View, Button, Alert, TouchableOpacity, FlatList, ScrollView, Linking, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import axios from 'axios';

import LoadingSpinner from '@/components/LoadingSpinner';
import AppButton from '@/components/Button';

import { useAuth } from '@/context/auth';
import { Class, Student, Teacher } from '@/constants/types';
import { useApp } from '@/context/app';
import NotificationBanner, { NotificationBannerRef } from '@/components/NotificationBanner';
import AddClassGroupModal from '@/components/AddClassGroupModal';
import AddNotificationModal from '@/components/AddNotificationModal';

import AntDesign from '@expo/vector-icons/AntDesign';

interface PageData {
  students: Student[];
  teachers: Teacher[];
  classes: Class[];
}

type NoticeData = {
  title: string;
  description: string;
};


export default function Classes() {
  const {user} = useAuth();
  const {students, teachers, classes, fetchData} = useApp();
  
  const API_BASE_URL = 'http://lms.knowledgequran.info/companyadmin/classes_app';

  const [currentSection, setCurrentSection] = useState(0); // 0: In Progress, 1: Active, 2: All

  const [searchQuery, setSearchQuery] = useState('');
  const [addNoticeModal, setAddNoticeModal] = useState(false);
  const [addClassrModal, setAddClassModal] = useState(false);

  const handleAddClassPress =  async (ClassData: FormData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/create_app`, ClassData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data)

      if (response.data.status === "success") {
        showBanner('Class Added Successfully!', 'success');
        fetchData();
      }
      else if (response.data.status === "error")
      {
        showBanner(`${response.data.message} `, 'error');
      }
    } catch (error) {
      showBanner(`Error Occured: ${error}`, 'error');
      console.log("err : ", error)
    }
  };

  const handleAddNoticePress =  async (NoticeData: NoticeData) => {
    try {
      const response = await axios.post('http://lms.knowledgequran.info/companyadmin/notices_app/', {
        "title" : NoticeData.title,
        "description" : NoticeData.description
      });

      console.log(response.data)
      if (response.data.status === "success") {
        showBanner('Student Added Successfully!', 'success');
        console.log("here")
      }
      else if (response.data.status === "error")
      {
        showBanner(`${response.data.message} `, 'error');
      }
    } catch (error) {
      showBanner(`Error Occured: ${error}`, 'error');
      console.log("err : ", error)
    }
  };


  const currentTime = new Date();
  
  const notificationBannerRef = useRef<NotificationBannerRef>(null);
  const showBanner = (message: string, type: 'success' | 'error') => {
    notificationBannerRef.current?.handleShowBanner(message, type);
  }

  useEffect(() => {
    fetchData();
  
    const interval = setInterval(() => {
      fetchData();
    }, 60000);
  
    return () => clearInterval(interval);
  }, []);
    
  if (user === null)
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

  const CopyUrl = async (url: string) => {
    if (url) {
      await Clipboard.setStringAsync(url);
      Alert.alert('Copied', 'The URL has been copied to the clipboard.');
    } else {
      Alert.alert('Error', 'No URL to copy.');
    }
  };


  const handleEndInProgress = async (classId: string, studentCode: string) => {
    Alert.alert(
      "Confirm Action",
      "Are you sure you want to end this class?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "End Class",
          onPress: async () => {
            try {
              await axios.post(`${API_BASE_URL}/end_in_progress_app`, {
                "call_id": classId,
                "student_id": studentCode
              });
              console.log(`Class with ID: ${classId} ended for student: ${studentCode}`);
              showBanner("Class Ended", "success")
              fetchData()
            } catch (error) {
              console.error('Failed to end class', error);
              showBanner("Unexpected Error", "error")
            }
          }
        }
      ]
    );
  };
  
  const handleSetInProgress = async (classId: string, studentCode: string) => {
    Alert.alert(
      "Confirm Action",
      "Are you sure you want to set this class in progress?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Set In Progress",
          onPress: async () => {
            try {
              await axios.post(`${API_BASE_URL}/in_progress_app`, {
                "call_id": classId,
                "student_id": studentCode
              });
              console.log(`Class with ID: ${classId} set to in progress`);
              showBanner("Class Started", "success")
              fetchData()
            } catch (error) {
              console.error('Failed to set class in progress', error);
              showBanner("Unexpected Error", "error")
            }
          }
        }
      ]
    );
  };
  
  const handleMarkActive = async (classId: string) => {
    Alert.alert(
      "Confirm Action",
      "Are you sure you want to mark this class as active?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Mark Active",
          onPress: async () => {
            try {
              await axios.post(`${API_BASE_URL}/active_app`, {
                "call_id": classId
              });
              console.log(`Class with ID: ${classId} marked as active`);
              showBanner("Class Active", "success")
              fetchData()
            } catch (error) {
              console.error('Failed to mark class as active', error);
              showBanner("Unexpected Error", "error")
            }
          }
        }
      ]
    );
  };
  
  const handleMarkExpire = async (classId: string) => {
    Alert.alert(
      "Confirm Action",
      "Are you sure you want to mark this class as expired?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Mark Expired",
          onPress: async () => {
            try {
              await axios.post(`${API_BASE_URL}/expire_app`, {
                "call_id": classId
              });
              console.log(`Class with ID: ${classId} marked as expired`);
              showBanner("Class Expired", "success")
              fetchData()
            } catch (error) {
              console.error('Failed to mark class as expired', error);
              showBanner("Unexpected Error", "error")
            }
          }
        }
      ]
    );
  };
  
  const convertTo12HourFormat = (time24 : string) : string => {
    const [hours, minutes] = time24.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
  
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  

  const filteredInProgress = classes.filter((item) => {
    if (item.active === "0") return false;  
  
    const currentTime = new Date();  
    const [startHour, startMinute] = item.start.split(':').map(Number);
    const [endHour, endMinute] = item.end.split(':').map(Number);
  
    const startTime = new Date();
    startTime.setHours(startHour, startMinute, 0, 0); 
  
    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0, 0); 
  
    return currentTime >= startTime && currentTime <= endTime;
  });
    
  const renderInProgress = ({ item }: { item: any }) => {

    const teacher = teachers.find((t: any) => t.teacher_code === item.teacher_code);
    const student = students.find((s: any) => s.student_code === item.student_code);
    const statusColor = item.status === "2" ? 'bg-green-200' : item.status === "1" ? 'bg-yellow-200' : 'bg-red-200';

    return (
      <View className="bg-primary-10 px-4 py-2 w-full rounded-lg border border-primary-75">

        <View className='w-full flex flex-row items-center justify-between mb-2 flex-wrap'>
          <Text className="text-heading font-semibold text-green-950">{item.title}</Text>
          <Text className="text-medium pr-6 font-medium text-green-900"> ({convertTo12HourFormat(item.start)} - {convertTo12HourFormat(item.end)})</Text>
        </View>

        <View className='flex flex-row'>
          <Text className="text-text font-medium text-green-950">Teacher:</Text>
          <Text className="text-text text-green-900 ml-3">{teacher?.name}</Text>
        </View>

        <View className='flex flex-row '>
          <Text className="text-text font-medium text-green-950">Student:</Text>
          <Text className="text-text text-green-900 ml-3">{student?.student_name}</Text>
        </View>

        <View className='flex flex-row '>
          <Text className="text-text font-medium text-green-950">Status:</Text>
          <Text className={`text-text text-green-900 ml-3 px-2 rounded-md ${statusColor}`}>
            {item.status === "2" ? 'Active' : item.status === "1" ? 'Pending' : 'Expired'}
          </Text>
        </View>
        
        
      </View>
    );
  };
  
  const filteredActive = classes.filter((item) => {
 
    const [startHour, startMinute] = item.start.split(':').map(Number);
    const [endHour, endMinute] = item.end.split(':').map(Number);
  
    const startTime = new Date();
    startTime.setHours(startHour, startMinute, 0, 0); 
  
    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0, 0); 
  
    return currentTime >= startTime && currentTime <= endTime;
  });
    
  const renderActive = ({ item }: { item: any }) => {

    const teacher = teachers.find((t: any) => t.teacher_code === item.teacher_code);
    const student = students.find((s: any) => s.student_code === item.student_code);
    const statusColor = item.status === "2" ? 'bg-green-200' : item.status === "1" ? 'bg-yellow-200' : 'bg-red-200';

    return (
      <View className="bg-primary-10 px-4 py-2 w-full rounded-lg border border-primary-75 mb-2">

        <View className='w-full flex flex-row items-center justify-between mb-2 flex-wrap'>
          <Text className="text-heading font-semibold text-green-950">{item.title}</Text>
          <Text className="text-medium pr-6 font-medium text-green-900"> ({convertTo12HourFormat(item.start)} - {convertTo12HourFormat(item.end)})</Text>
        </View>

        <View className='flex flex-row'>
          <Text className="text-text font-medium text-green-950">Teacher:</Text>
          <Text className="text-text text-green-900 ml-3">{teacher?.name}</Text>
        </View>

        <View className='flex flex-row '>
          <Text className="text-text font-medium text-green-950">Student:</Text>
          <Text className="text-text text-green-900 ml-3">{student?.student_name}</Text>
        </View>

        <View className='flex flex-row '>
          <Text className="text-text font-medium text-green-950">Status:</Text>
          <Text className={`text-text text-green-900 ml-3 px-2 rounded-md ${statusColor}`}>
            {item.status === "2" ? 'Active' : item.status === "1" ? 'Pending' : 'Expired'}
          </Text>
        </View>
        
        <View className='flex flex-row py-2 mt-3 justify-evenly'>
          
          <TouchableOpacity
            onPress={() => {
              if (item.room) {
                try {
                  new URL(item.room);
                  Linking.openURL(item.room).catch(err => console.error("Failed to open URL", err));
                } catch (error) {
                  console.error("Invalid URL:", item.room);
                  showBanner("Invalid URL", "error");
                }
              } else {
                showBanner("No Meet Link Found", "error");
              }
            }}
            className="bg-green-500 p-2 rounded-full flex-row justify-center items-center mr-2"
          >
            <Text className="text-white font-bold">Join Meeting</Text>
          </TouchableOpacity>

          {item.status == "2" && (
            <TouchableOpacity
              onPress={() => handleMarkExpire(item.id)}
              className="bg-yellow-500 p-2 rounded-full flex-row justify-center items-center mr-2"
            >
              <Text className="text-white font-bold">Mark Expire</Text>
            </TouchableOpacity>
          )}
          {item.status == "0" && (
            <TouchableOpacity
              onPress={() => handleMarkActive(item.id)}
              className="bg-green-500 p-2 rounded-full flex-row justify-center items-center mr-2"
            >
              <Text className="text-white font-bold">Mark Active</Text>
            </TouchableOpacity>
          )}
          {item.active == "1" && (
            <TouchableOpacity
              onPress={() => handleEndInProgress(item.id, item.student_code)}
              className="bg-yellow-500 p-2 rounded-full flex-row justify-center items-center mr-2"
            >
              <Text className="text-white font-bold">End In Progress</Text>
            </TouchableOpacity>
          )}
          {item.active == "0" && (
            <TouchableOpacity
              onPress={() => handleSetInProgress(item.id, item.student_code)}
              className="bg-green-500 p-2 rounded-full flex-row justify-center items-center"
            >
              <Text className="text-white font-bold">Set in Progress</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const filteredAll = searchQuery
    ? classes.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : classes;

  const renderAll = ({ item }: { item: any }) => {

    const teacher = teachers.find((t: any) => t.teacher_code === item.teacher_code);
    const student = students.find((s: any) => s.student_code === item.student_code);
    const statusColor = item.status === "2" ? 'bg-green-200' : item.status === "1" ? 'bg-yellow-200' : 'bg-red-200';
    return (
      <View className="bg-primary-10 px-4 py-2 w-full rounded-lg border border-primary-75 mb-3">

        <View className='w-full flex flex-row items-center justify-between mb-2 flex-wrap'>
          <Text className="text-heading font-semibold text-green-950">{item.title}</Text>
          <Text className="text-medium pr-6 font-medium text-green-900"> ({convertTo12HourFormat(item.start)} - {convertTo12HourFormat(item.end)})</Text>
        </View>
        

        <View className='flex flex-row'>
          <Text className="text-text font-medium text-green-950">Teacher:</Text>
          <Text className="text-text text-green-900 ml-3">{teacher?.name}</Text>
        </View>

        <View className='flex flex-row '>
          <Text className="text-text font-medium text-green-950">Student:</Text>
          <Text className="text-text text-green-900 ml-3">{student?.student_name}</Text>
        </View>

        <View className='flex flex-row '>
          <Text className="text-text font-medium text-green-950">Status:</Text>
          <Text className={`text-text text-green-900 ml-3 px-2 rounded-md ${statusColor}`}>
            {item.status === "2" ? 'Active' : item.status === "1" ? 'Pending' : 'Expired'}
          </Text>
        </View>
        
        <View className='flex flex-row py-2 mt-3 justify-evenly'>
          
          <TouchableOpacity
            onPress={() => {
              if (item.room) {
                try {
                  new URL(item.room);
                  Linking.openURL(item.room).catch(err => console.error("Failed to open URL", err));
                } catch (error) {
                  console.error("Invalid URL:", item.room);
                  showBanner("Invalid URL", "error");
                }
              } else {
                showBanner("No Meet Link Found", "error");
              }
            }}
            className="bg-green-500 p-2 rounded-full flex-row justify-center items-center mr-2"
          >
            <Text className="text-white font-bold">Join Meeting</Text>
          </TouchableOpacity>

          {item.status == "2" && (
            <TouchableOpacity
              onPress={() => handleMarkExpire(item.id)}
              className="bg-yellow-500 p-2 rounded-full flex-row justify-center items-center mr-2"
            >
              <Text className="text-white font-bold">Mark Expire</Text>
            </TouchableOpacity>
          )}
          {item.status == "0" && (
            <TouchableOpacity
              onPress={() => handleMarkActive(item.id)}
              className="bg-green-500 p-2 rounded-full flex-row justify-center items-center mr-2"
            >
              <Text className="text-white font-bold">Mark Active</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => CopyUrl(item.room)}
            className="bg-blue-500 p-2 rounded-full flex-row justify-center items-center"
          >
            <Text className="text-white font-bold">Copy Link</Text>
          </TouchableOpacity>
 
        </View>
      </View>
    );
  };

  const handleNextPress = () => {
    setCurrentSection((prev) => (prev + 1) % 3);
  };

  const handlePrevPress = () => {
    setCurrentSection((prev) => (prev - 1 + 3) % 3);
  };

  const NavButtons = () => {
    return(
      <View className='flex flex-row'>
        <TouchableOpacity onPress={handlePrevPress}>
          <AntDesign name="leftcircle" size={34} color="green" />
        </TouchableOpacity>

        <View className='w-4'/>

        <TouchableOpacity onPress={handleNextPress}>
          <AntDesign name="rightcircle" size={34} color="green" />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className="flex flex-1 items-center bg-white p-4">
      <NotificationBanner ref={notificationBannerRef} message="" type="success" />

      <AddClassGroupModal
        title='Add New Class Group'
        onClose={() => {setAddClassModal(false)}}
        visible={addClassrModal}
        onSubmit={handleAddClassPress}
      />

      <AddNotificationModal
        title='Add New Notice'
        onClose={() => {setAddNoticeModal(false)}}
        visible={addNoticeModal}
        onSubmit={handleAddNoticePress}
      />

        <View className='w-full flex flex-row items-center justify-evenly mb-4'>
          <AppButton
            title='Create Group'
            class_Name='h-12 bg-primary px-6'
            textClassName='font-bold'
            onPress={() => { setAddClassModal(true) }}
          />

          <AppButton
            title='Create Notice'
            class_Name='h-12 bg-primary px-6'
            textClassName='font-bold'
            onPress={() => { setAddNoticeModal(true) }}
          />
        </View>

        { currentSection === 0 &&
          <View>
            <View className='w-full justify-between flex flex-row px-4'>
              <Text className="text-2xl font-bold mb-4">In Progress</Text>
              <NavButtons/>
            </View>

            {
              filteredInProgress.length > 0 ? (
                <FlatList
                  data={filteredInProgress}
                  renderItem={renderInProgress}
                  keyExtractor={(item) => item.id.toString()}
                />
              ) : (
                <View className='w-full h-12 items-center justify-center'>
                  <Text className='text-btn_title bg-slate-200 p-2 px-3 rounded-md'>No Classes In Progress</Text>
                </View>
              )
            }
          </View>
        }

        {currentSection === 1 &&
          <View>
            <View className='w-full justify-between flex flex-row px-4'>
              <Text className="text-2xl font-bold mb-4">Active Classes</Text>
              <NavButtons/>
            </View>
            {
              filteredActive.length > 0 ? (
                <FlatList
                  data={filteredActive}
                  renderItem={renderActive}
                  keyExtractor={(item) => item.id.toString()}
                />
              ) : (
                <View className='w-full h-12 items-center justify-center'>
                  <Text className='text-btn_title bg-slate-200 p-2 px-3 rounded-md'>No Active Classes</Text>
                </View>
              )
            }
          </View>
        }

        {currentSection === 2 &&
          <View className=''>
            <View className='w-full justify-between flex flex-row px-4'>
              <Text className="text-2xl font-bold mb-4">All Classes</Text>
              <NavButtons/>
            </View>
            {
              classes.length > 0 ? (
                <View>
                  <View className='mb-4'>
                    <TextInput
                      placeholder="Search by title..."
                      value={searchQuery}
                      onChangeText={(text) => setSearchQuery(text)}
                      className="bg-gray-200 p-2 rounded-lg"
                    />
                  </View>
                  <View className=''>
                    <FlatList
                      data={filteredAll}
                      renderItem={renderAll}
                      keyExtractor={(item) => item.id.toString()}
                      initialNumToRender={10}
                      contentContainerStyle= {{paddingBottom: 320}}
                    />
                  </View>
                </View>
              ) : (
                <View className='w-full h-12 items-center justify-center'>
                  <Text className='text-btn_title bg-slate-200 p-2 px-3 rounded-md'>No Classes found</Text>
                </View>
              )
            }
          </View>
        }
    </View>
  );
};

