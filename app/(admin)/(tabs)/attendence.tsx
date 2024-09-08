import { Text, View, Button, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';

import { useAuth } from '@/context/auth';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import axios from 'axios';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useApp } from '@/context/app';

interface Attendance {
  id: string;
  code: string;
  teacher_code: string;
  role_id: string;
  date: string;
  attendance: string;
  education_type: string | null;
  course_name: string | null;
  lesson_progress: string | null;
  class_start_time: string | null;
  namaz: string | null;
  problem: string | null;
  class_type: string | null;
  ['namaz-reasons']: string | null;
  problem_solved: string | null;
  monthly_project: string | null;
  leave_reason: string | null;
  test_details: string | null;
  class_progress: string | null;

  teacher_name?: string; // Added field
  student_name?: string; // Added field
}

export default function Attendence() {
  const { user } = useAuth();
  const {teachers, students} = useApp();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [filteredData, setFilteredData] = useState<Attendance[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleListItemPress = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(
        "http://lms.knowledgequran.info/companyadmin/student_attendance_app"
      );

      const attendence = response.data.data.attendance;
      
      const updatedAttendance = attendence.map((item: any) => {
        const teacher = teachers.find((t:any) => t.teacher_code === item.teacher_code);
        const student = students.find((s:any) => s.student_code === item.code);

        return {
          ...item,
          teacher_name: teacher?.name,
          student_name: student?.student_name
        };
      });

      setAttendanceData(updatedAttendance);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const filtered = attendanceData.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
      setFilteredData(filtered);
    } else if (startDate) {
      const filtered = attendanceData.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate;
      });
      setFilteredData(filtered);
    } else if (endDate) {
      const filtered = attendanceData.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= endDate;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(attendanceData);
    }
  }, [startDate, endDate, attendanceData]);

  if (loading) {
    return (
      <View className="flex flex-1 items-center justify-center">
        <Text className="font-semibold text-xl"> Loading... </Text>

        <View>
          <LoadingSpinner
            isLoading={true}
            size={40}
            style={{ marginTop: 8 }}
            color="black"
          />
        </View>
      </View>
    );
  }

  const RenderItem = ({ item, isExpanded = false, onPress = () => {} }: { item: Attendance, isExpanded: boolean, onPress: () => void }) => {

    const statusColor = item.attendance === "4" ?
    'bg-green-300' : item.attendance === "3" ?
    'bg-green-300' : item.attendance === "2" ?
    'bg-yellow-300' : item.attendance === "1" ?
    'bg-red-300' : item.attendance === "0"?
    'bg-red-300' : "";
    
    const noNeedRegex = /^No\s+need/;

    return(
      <TouchableOpacity 
        className="bg-primary-10 px-4 py-2 w-full rounded-lg border border-primary-75 mb-3"
        onPress={onPress}  
      >
        <View className='w-full flex flex-row items-center justify-between mb-2 flex-wrap'>
          <Text className="text-heading font-semibold text-green-950">{item.student_name}</Text>
          <Text className="text-medium pr-6 font-medium text-green-900">({item.date})</Text>
        </View>

        <View className='flex flex-row '>
          <Text className={`text-text ${statusColor} text-green-900 px-2 rounded-md `}>
            {item.attendance === "4" ?
            'Present' : item.attendance === "3" ?
            'Test Today' : item.attendance === "2" ?
            'Leave' : item.attendance === "1" ?
            'Absent By Student' : item.attendance === "0"?
            'Absent By Teacher' : "Unknown"
            }
          </Text>
        </View>

        <View className='flex flex-row'>
          <Text className="text-text font-medium text-green-950">Teacher:</Text>
          <Text className="text-text text-green-900 ml-3">{item.teacher_name}</Text>
        </View>

        <View className='flex flex-row'>
          <Text className="text-text font-medium text-green-950">Course Name:</Text>
          <Text className="text-text text-green-900 ml-3">{item.course_name}</Text>
        </View>
        
          {isExpanded &&
          <View>
            <View className='flex flex-row flex-wrap mt-4'>
              <Text className="text-medium font-medium text-green-950">Progress:</Text>
              <Text className="text-medium text-green-900 ml-3 flex ">{item.lesson_progress}</Text>
            </View>

            <View className='flex flex-row flex-wrap mt-2'>
              <Text className="text-medium font-medium text-green-950">Namaz Attendence:</Text>
              <Text className="text-medium text-green-900 ml-3 flex ">{item.namaz}</Text>
            </View>

            { item.namaz != "complete"  && item.namaz != "Yes"  && item.namaz && !noNeedRegex.test(item.namaz) &&
              <View className='flex flex-row flex-wrap mt-2'>
                <Text className="text-medium font-medium text-green-950">Reason:</Text>
                <Text className="text-medium text-green-900 ml-3 flex ">{item['namaz-reasons']}</Text>
              </View>
            }

            <View className='flex flex-row flex-wrap mt-2'>
              <Text className="text-medium font-medium text-green-950">Any Problem:</Text>
              <Text className="text-medium text-green-900 ml-3 flex ">{item.problem}</Text>
            </View>

            { item.problem != "No" &&
              <View className='flex flex-row flex-wrap mt-2'>
                <Text className="text-medium font-medium text-green-950">Problem Solved:</Text>
                <Text className="text-medium text-green-900 ml-3 flex ">{item.problem_solved ? item.problem_solved : "N/A"}</Text>
              </View>
            }

            <View className='flex flex-row flex-wrap mt-2'>
              <Text className="text-medium font-medium text-green-950">Class Progress:</Text>
              <Text className="text-medium text-green-900 ml-3 flex ">{item.class_progress || "N/A"}</Text>
            </View>


            <View className='flex flex-row flex-wrap mt-2'>
              <Text className="text-medium font-medium text-green-950">Monthly Project:</Text>
              <Text className="text-medium text-green-900 ml-3 flex ">{item.monthly_project || "N/A"}</Text>
            </View>
          </View>
        }
      </TouchableOpacity>
    )
  };

  return (
    <View className="flex-1 p-4 bg-white">
      
      <View className="w-full flex flex-row justify-between">
        <View className="w-[49%]">
          <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
            Start Date
          </Text>

          <TouchableOpacity onPress={() => {setShowStartDatePicker(true)}}>
            <TextInput
              className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
              value= {startDate ? startDate.toISOString().split('T')[0] : "Select"}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={showStartDatePicker}
            mode="date"
            onConfirm={(selectedDate) => {
              setShowStartDatePicker(false);
              if (selectedDate) setStartDate(selectedDate);
            }}
            onCancel={() => {setShowStartDatePicker(false)}}
          />
        </View>

        <View className="w-[49%]">
          <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
            End Date
          </Text>

          <TouchableOpacity onPress={() => {setShowEndDatePicker(true)}}>
            <TextInput
              className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
              value= {endDate ? endDate.toISOString().split('T')[0] : "Select"}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={showEndDatePicker}
            mode="date"
            onConfirm={(selectedDate) => {
              setShowEndDatePicker(false);
              if (selectedDate) setEndDate(selectedDate);
            }}
            onCancel={() => {setShowEndDatePicker(false)}}
          />
          
        </View>
      </View>

      <FlatList
        data={filteredData}
        renderItem={({item}) => <RenderItem item={item} onPress={() => handleListItemPress(item.id)} isExpanded={expandedId === item.id} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

