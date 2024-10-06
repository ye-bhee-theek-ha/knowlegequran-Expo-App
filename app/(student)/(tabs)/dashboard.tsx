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

interface classes {
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

interface CompensatoryClass {
  id: string;
  student_code: string;
  teacher_code: string;
  class_status: string;
  status: string;
  start_date: string;
  end_date: string;
}

interface AttendanceRecord {
  id: string;
  code: string;
  teacher_code: string;
  role_id: string;
  date: string;
  attendance: string;
  education_type: string;
  course_name: string;
  lesson_progress: string;
  class_start_time: string | null;
  namaz: string;
  problem: string;
  class_type: string | null;
  namaz_reasons: string;
  problem_solved: string | null;
  monthly_project: string | null;
  leave_reason: string | null;
  test_details: string | null;
  class_progress: string;
}

interface ExamMark {
  id: string;
  student_code: string;
  subject: string;
  mark: number;
  grade: string;
}


interface PageData {
  timezone: string;
  classes: classes[];
  compensatory_classes: CompensatoryClass[] | null;
  attendance_records: AttendanceRecord[];
  exam_marks: ExamMark[];
}

interface ListItemProps {
  classes: classes;
  isExpanded?: boolean;
  onPress?: () => void;
}

export default function Dashboard() {

  const router = useRouter();

  const {user} = useAuth();
  const {students, teachers, classes, fetchData} = useApp();


  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pageData, setPageData] = useState<PageData | null>(null)


  // notification

  const notificationBannerRef = useRef<NotificationBannerRef>(null);

  const showBanner = (message: string, type: 'success' | 'error') => {
    notificationBannerRef.current?.handleShowBanner(message, type);
  };


  const GetInfo = async () => {
    try {
        const response = await axios.get(`http://lms.knowledgequran.info/student/dashboard_app/${user.user_code}`);

      if (response.data.status === "success") {
        setPageData(response.data.data);
        console.log(pageData)
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

  const ListItem: React.FC<ListItemProps> = ({ classes }) => {
    const statusColor = classes.status === "2" ? 'bg-green-200' : classes.status === "1" ? 'bg-yellow-200' : 'bg-red-200';
    const teacher = teachers.find((t: any) => t.teacher_code === classes.teacher_code);

    return(
    <View className='my-2 border-primary bg-primary-20 py-3 px-4 border rounded-lg'>

      <View className='w-full flex flex-row items-center justify-between text-center'>
        <Text className='text-h1 font-semibold pb-1'>{classes.title}</Text>
        <Text className='text-heading font-normal pb-1'>{teacher?.name}</Text>
      </View>

      <View className='px-2 flex flex-row items-center justify-between flex-wrap'>
        <Text className="text-text font-semibold">{getClassDuration(classes.start, classes.end)}</Text>
        <Text className='text-medium'>({classes.start} - {classes.end})</Text>
      </View>

      <View className='flex flex-row my-2'>
        <Text className="text-text font-medium text-green-950">Status:</Text>
        <Text className={`text-text text-green-900 ml-3 px-2 rounded-md ${statusColor}`}>
          {classes.status === "2" ? 'Active' : classes.status === "1" ? 'Pending' : 'Expired'}
        </Text>
      </View>

      <View className='w-full'>
        <AppButton
          title='Join meeting'
          class_Name='mt-3 bg-primary mx-4'
          textClassName='font-bold text-text'
          onPress={() => {

          }}
        />

        <AppButton
          title='Download syllabus'
          class_Name='mt-3 bg-primary mx-4'
          textClassName='font-bold text-text'
          onPress={() => {

          }}
        />      
      </View>
    </View>
  )};
  
  const handleListItemPress = (student_code: string) => {
    setExpandedId(expandedId === student_code ? null : student_code);
  };


  return (
    <View className='flex flex-1 items-center bg-white'>
      <NotificationBanner ref={notificationBannerRef} message="" type="success" />
      <View className='w-full flex flex-row items-center justify-evenly mb-4'>
          <AppButton
            title='View Marks'
            class_Name='h-12 bg-primary px-6 w-[45%]'
            textClassName='font-bold text-medium'
            onPress={() => {  }}
          />

          <AppButton
            title='View Progress'
            class_Name='h-12 bg-primary px-6 w-[45%]'
            textClassName='font-bold text-medium'
            onPress={() => {  }}
          />
        </View>
      <View className='flex flex-1 w-[85%]'>
        
        <Text className='text-heading font-bold bg-transparent'>My Classes</Text>
        <Text>{}</Text>

        <FlatList
          data={pageData.classes}
          renderItem={({item}) => <ListItem classes={item} />}
          initialNumToRender = {10}
        />

      </View>

    </View>
  );
}

