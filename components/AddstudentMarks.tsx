import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AppButton from "@/components/Button";
import { useApp } from "@/context/app";
import NotificationBanner, { NotificationBannerRef } from "./NotificationBanner";
import { Student } from "@/constants/types";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "react-native-modal-datetime-picker";

type TestMarksData = {
  teacher_code: string;
  student_code: string;
  date: string;
  test_name: string;
  total_marks: string;
  obtained_marks: string;
};

interface AddTestMarksProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (TestMarksData: FormData) => void;
  title: string;
  teacherID: string;
  students: Student[];
}

const AddStudentMarks: React.FC<AddTestMarksProps> = ({
  visible,
  onClose,
  onSubmit,
  title,
  teacherID,
  students
}) => {

  // Notification banner
  const notificationBannerRef = useRef<NotificationBannerRef>(null);
  const showBanner = (message: string, type: 'success' | 'error') => {
    notificationBannerRef.current?.handleShowBanner(message, type);
  }

  const [DateVisibility,setDateVisibility] = useState(false);

  const handleDateConfirm = (date : Date) => {
    const formattedDate = date.toISOString().split('T')[0];

    handleInputChange("date", formattedDate);
    setDateVisibility(false);
  };
  
  const [formData, setFormData] = useState<TestMarksData>({
    teacher_code: teacherID,
    student_code: "",
    date: "",
    test_name: "",
    total_marks: "",
    obtained_marks: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    const requiredFields = [
      "teacher_code",
      "student_code",
      "date",
      "test_name",
      "total_marks",
      "obtained_marks",
    ];

    // Check for missing fields
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );

    if (missingFields.length > 0) {
      showBanner(`Missing fields: ${missingFields.join(", ")}`, 'error');
      return;
    }

      
    const form = new FormData();
  
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key as keyof typeof formData] || "");
    });

    // Call onSubmit with formData
    onSubmit(form);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <NotificationBanner ref={notificationBannerRef} message="" type="success"/>
      <View className="flex-1 justify-center items-center py-20 px-6 backdrop-blur-lg bg-primary-20/70">
        <View className="bg-white w-full rounded-lg border-2 border-primary justify-center">
          <Text className="text-heading font-bold mt-4 self-center">
            {title}
          </Text>

          <ScrollView contentContainerStyle={{ padding: 14 }}>
            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Teacher Code
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md text-black"
                value={formData.teacher_code}
                onChangeText={(text) => handleInputChange("teacher_code", text)}
                editable={false}
                pointerEvents="none"
              />
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Student
              </Text>
              <View className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md" >
                <Picker
                  selectedValue={formData.student_code}
                  onValueChange={(itemValue) =>
                    handleInputChange("student_code", itemValue)
                  }
                >
                  {students.map((student) => (
                    <Picker.Item
                      key={student.teacher_code}
                      label={student.student_name + " (" + student.student_code + ")" }
                      value={student.student_code }
                    />
                  ))}
                </Picker>
              </View>
            </View>

            

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Date
              </Text>
              
              <TouchableOpacity onPress={() => {setDateVisibility(true)}}>
                <TextInput
                  className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md text-black"
                  value={formData.date}
                  editable={false}
                  pointerEvents="none"
                />
              </TouchableOpacity>
              <DateTimePicker
                isVisible={DateVisibility}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={() => {setDateVisibility(false)}}
              />
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Test Name
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.test_name}
                onChangeText={(text) => handleInputChange("test_name", text)}
              />
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Total Marks
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.total_marks}
                onChangeText={(text) => handleInputChange("total_marks", text)}
                keyboardType="numeric"
              />
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Obtained Marks
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.obtained_marks}
                onChangeText={(text) => handleInputChange("obtained_marks", text)}
                keyboardType="numeric"
              />
            </View>

            <View className="flex-row justify-end">
              <AppButton
                title="Cancel"
                class_Name="bg-secondary-50 px-4 mr-2"
                onPress={onClose}
              />
              <AppButton
                title="Submit"
                class_Name="bg-primary px-4"
                onPress={handleSubmit}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AddStudentMarks;
