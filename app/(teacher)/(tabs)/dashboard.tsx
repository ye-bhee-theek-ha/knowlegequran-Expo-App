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
import { router, useNavigation, useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native';


interface PageData {
  teacher: string;
  compensatory_rows: null;
  isSaturday: boolean;
  students: Student[];
}

interface ListItemProps {
  student: Student;
  isExpanded?: boolean;
  onPress?: () => void;
}

export default function Dashboard() {

  const router = useRouter();

  const {user} = useAuth();

  const [expandedId, setExpandedId] = useState<string | null>(null); // for student list expanded track

  const [pageData, setPageData] = useState<PageData | null>(null)


  // notification

  const notificationBannerRef = useRef<NotificationBannerRef>(null);

  const showBanner = (message: string, type: 'success' | 'error') => {
    notificationBannerRef.current?.handleShowBanner(message, type);
  };


  const GetInfo = async () => {
    try {
        const response = await axios.get(`http://lms.knowledgequran.info/teacher/dashboard_app/${user.user_code}`);

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

  const getClassDuration = (start: string, end: string): string => {
    const today = new Date().toISOString().split('T')[0];

    const startDate = new Date(`${today}T${start}`);
    const endDate = new Date(`${today}T${end}`);

    const durationMs = endDate.getTime() - startDate.getTime(); 
    const durationMinutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    let durationString = '';
    if (hours > 0) {
      durationString = `${hours} hour${hours > 1 ? 's' : ''}`;
      if (minutes > 0) {
        durationString += ` ${minutes} minute${minutes > 1 ? 's' : ''}`;
      }
    } else {
      durationString = `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }

    return durationString;
  };

  const ListItem: React.FC<ListItemProps> = ({ student }) => (
    <View className='my-2 border-primary bg-primary-20 py-3 px-4 border rounded-lg'>

      <Text className='text-h1 font-semibold pb-1'>{student.student_name}</Text>
      <View className='px-2 flex flex-row items-center justify-between flex-wrap'>
        <Text className="text-text font-semibold">{getClassDuration(student.class_start, student.class_end)}</Text>
        <Text className='text-medium'>({student.class_start} - {student.class_end})</Text>
      </View>

      <AppButton
        title='Take Class'
        class_Name='mt-3 bg-primary mx-4'
        textClassName='font-bold text-text'
        onPress={() => {
          router.push({
            pathname: "/(teacher)/classes",
            params: { TeacherID: student.teacher_code, StudentID: student.student_code, StudentName: student.student_name },
          });
        }}
      />
      
    </View>
  );
  
  const handleListItemPress = (student_code: string) => {
    setExpandedId(expandedId === student_code ? null : student_code);
  };


  return (
    <View className='flex flex-1 items-center bg-white'>
      <NotificationBanner ref={notificationBannerRef} message="" type="success" />
      <View className='flex flex-1 w-[85%]'>
        
        <Text className='text-heading font-bold bg-transparent'>My students</Text>
        <Text>{}</Text>
        <FlatList
          data={pageData.students}
          renderItem={({item}) => <ListItem student={item} />}
          initialNumToRender = {10}
        />

      </View>

    </View>
  );
}
