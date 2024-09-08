import { Text, View, TouchableOpacity, FlatList} from 'react-native';
import { useAuth } from '@/context/auth';
import { useEffect, useRef, useState } from 'react';

import { useApp } from '@/context/app';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import axios from 'axios';

import NotificationBanner, { NotificationBannerRef } from '@/components/NotificationBanner';
import LoadingSpinner from '@/components/LoadingSpinner';
import AppButton from '@/components/Button';
import AddStudentModal from '@/components/AddStudentModal';
import { Student } from '@/constants/types';
import AddTeacherModal from '@/components/AddTeacherModal';


interface PageData {
  student_count: number;
  teacher_count: number;
  classes: number;
  students: Student[];
}

interface ListItemProps {
  student: Student;
  isExpanded?: boolean;
  onPress?: () => void;
}

export default function Dashboard() {

  const {user} = useAuth();
  const {students, fetchData} = useApp();

  const [expandedId, setExpandedId] = useState<string | null>(null); // for student list expanded track

  const [pageData, setPageData] = useState<PageData | null>(null)

  const [addStudentModal, setAddStudentModal] = useState(false);
  const [addTeacherModal, setAddTeacherModal] = useState(false);

  // notification

  const notificationBannerRef = useRef<NotificationBannerRef>(null);

  const showBanner = (message: string, type: 'success' | 'error') => {
    notificationBannerRef.current?.handleShowBanner(message, type);
  };


  const GetInfo = async () => {
    try {
        const response = await axios.get('http://lms.knowledgequran.info/companyadmin/dashboard_app');

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

  if (user === null || pageData === null)
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

  const ListItem: React.FC<ListItemProps> = ({ student, isExpanded = false, onPress = () => {} }) => (
    <View className='my-2 border-primary border rounded-lg'>
    <TouchableOpacity onPress={onPress} className='p-4 bg-primary-10 rounded-lg focus:bg-primary-20'>
      <Text className="text-medium font-semibold">Student Code: {student.student_code}</Text>
      <Text className='text-medium font-semibold'>Name: {student.student_name}</Text>

      {isExpanded && (
        <View className='bg-transparent mt-2 flex items-center'>
          <View className='flex w-full flex-row bg-transparent justify-between mb-2'>
            <Text className='text-[15px]'><Text className='font-bold'>Class Start: </Text>{student.class_start}</Text>
            <Text className='text-[15px]'><Text className='font-bold'>Class End: </Text>{student.class_end}</Text>
          </View>
          <Text className='text-[15px]'><Text className='font-bold'>Enrollment Date: </Text>{student.enroll_date}</Text>
        </View>
      )}
    </TouchableOpacity>
    
  </View>
  );
  
  const handleListItemPress = (student_code: string) => {
    setExpandedId(expandedId === student_code ? null : student_code);
  };

  const handleAddStudentPress =  async (studentData: FormData) => {
    try {
      const response = await axios.post('http://lms.knowledgequran.info/companyadmin/addstudent/add_app', studentData, {
        headers: {
            'Content-Type': 'multipart/form-data', 
        },
    });

      console.log(response.data)

      if (response.data.status === "success") {
        showBanner('Student Added Successfully!', 'success');
        fetchData();
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


  const handleAddTeacherPress =  async (teacherData: FormData) => {
    try {
      const response = await axios.post('http://lms.knowledgequran.info/companyadmin/addteacher/add_app', teacherData, {
        headers: {
            'Content-Type': 'multipart/form-data', 
        },
    });

      console.log(response.data)

      if (response.data.status === "success") {
        showBanner('Student Added Successfully!', 'success');
        fetchData();
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

  return (
    <View className='flex flex-1 items-center bg-white'>
      <View className='h-[25%] w-[85%] flex flex-col justify-between '>
        <NotificationBanner ref={notificationBannerRef} message="" type="success" />

        <View className='h-[30%] flex-row rounded-lg border-2 border-primary-75 bg-primary-20'>

          <View className='h-full flex flex-row mx-2 justify-center items-center bg-transparent'>
            <MaterialIcons name="supervisor-account" size={34} color="green" style={{backgroundColor:'transparent'}} />
            <Text className='text-medium font-semibold text-green-950 px-2'>Student Count :</Text>
          </View>        

          <View className='h-full flex mx-2 justify-center bg-transparent'>
            <Text className='text-xl font-bold text-green-900'>{pageData?.student_count}</Text>
          </View>

        </View>

        <View className='h-[30%] flex-row rounded-lg border-2 border-primary-75 bg-primary-20'>
        
          <View className='h-full flex flex-row items-center mx-2 justify-center bg-transparent'>
            <FontAwesome5 name="chalkboard-teacher" size={24} color="green" style={{backgroundColor:'transparent'}} />
            <Text className='text-medium font-semibold text-green-950 px-2'>Teacher Count :</Text>

          </View>        

          <View className='h-full flex mx-2 justify-center bg-transparent'>
            
            <Text className='text-xl font-bold text-green-900'>{pageData?.teacher_count}</Text>
          </View>

        </View>

        <View className='h-[30%] flex-row rounded-lg border-2 border-primary-75 bg-primary-20'>
        
          <View className='h-full flex flex-row items-center mx-2 justify-center bg-transparent'>
            <MaterialCommunityIcons name="google-classroom" size={30} color="green" style={{backgroundColor:'transparent'}} />
            <Text className='text-medium font-semibold text-green-950 px-2'>Total Classes :</Text>
          </View>        

          <View className='h-full flex mx-2 justify-center bg-transparent'>
            <Text className='text-xl font-bold text-green-900'>{pageData?.classes}</Text>
          </View>

        </View>

      </View>

      <View className='h-5'></View>

      <AddStudentModal
        visible = {addStudentModal}
        onClose = {() => setAddStudentModal(false)}
        onSubmit= {handleAddStudentPress}
        title='Add Student'
      />

      <AddTeacherModal 
        visible = {addTeacherModal}
        onClose = {() => setAddTeacherModal(false)}
        onSubmit= {handleAddTeacherPress}
        title='Add Teacher'
      />

      <View className='w-[85%] flex flex-row items-center justify-between'>
        <AppButton
          title='Add Student'
          class_Name='h-12 bg-primary px-5'
          textClassName='font-bold'
          onPress={() => {setAddStudentModal(true)}}
        />

        <AppButton
          title='Add Teacher'
          class_Name='h-12 bg-primary px-5'
          textClassName='font-bold'
          onPress={() => {setAddTeacherModal(true)}}
        />
      </View>

      <View className='h-5'></View>

      <View className='flex flex-1 w-[85%]'>
        
        <Text className='text-heading font-bold bg-transparent'>New Joined Students</Text>

        <FlatList
          data={students}
          renderItem={({item}) => <ListItem student={item} onPress={() => handleListItemPress(item.student_code)} isExpanded={expandedId === item.student_code} />}
          initialNumToRender = {10}
        />

      </View>

    </View>
  );
}

