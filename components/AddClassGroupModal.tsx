import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AppButton from "@/components/Button";
import { Picker } from "@react-native-picker/picker";
import { useApp } from "@/context/app";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import NotificationBanner, {NotificationBannerRef} from "./NotificationBanner";
import * as DocumentPicker from 'expo-document-picker';

interface AddClassModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (teacherData: FormData) => void;
  title: string;
}

interface ClassFormData {
  id?: string;
  title: string;
  teacher_code: string;
  student_code: string;
  start: string;
  end: string;
  status: string;
  room: string;
  salary?: string | null;
  active?: string;
}

interface SyllabusFile {
  uri: string;
  name: string;
  size: number;
  mimeType?: string;
}

const AddClassGroupModal: React.FC<AddClassModalProps> = ({
  visible,
  onClose,
  onSubmit,
  title,
}) => {

  const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);

  const [syllabusFile, setSyllabusFile] = useState<null | SyllabusFile>(null);

  // notification
  const notificationBannerRef = useRef<NotificationBannerRef>(null);
  const showBanner = (message: string, type: 'success' | 'error') => {
    notificationBannerRef.current?.handleShowBanner(message, type);
  }

  const {teachers, students, classes} = useApp();

  const [formData, setFormData] = useState<ClassFormData>({
    title: "",
    teacher_code: "",
    student_code: "",
    start: "",
    end: "",
    status: "2",
    room: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleStartTimeConfirm = (time: Date) => {
    // Format the time as HH:mm:ss 
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    handleInputChange("start", formattedTime);
    setStartTimePickerVisibility(false);
  };

  const handleEndTimeConfirm = (time: Date) => {
    // Format the time as HH:mm:ss 
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    handleInputChange("end", formattedTime);
    setEndTimePickerVisibility(false);
  };




  const pickSyllabus = async () => {
    try {
      const result: any = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      const file = result.assets[0];

      if (result.canceled == false) {
        setSyllabusFile({
          uri: file.uri,
          name: file.name,
          size: file.size,
          mimeType: file.mimeType,
        });
      } else {
        console.log('No file selected');
      }
      console.log(syllabusFile)
    } catch (err) {
      console.log('Error picking PDF:', err);
    }
  };


  const handleSubmit = async () => {
    const requiredFields = [
      "title",
      "teacher_code",
      "student_code",
      "start",
      "end",
      "status",
      "room",
    ]
  
    // Check for missing fields
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );
  
    if (missingFields.length > 0) {
      showBanner(`Missing fields: ${missingFields.join(", ")}`, 'error')
      return;
    }

    
  
    const form = new FormData();

    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key as keyof typeof formData] || "");
    });
  
    if (syllabusFile) {
      const fileName = syllabusFile.uri.split("/").pop();
      const fileType = fileName?.split(".").pop();

      form.append("syllabus_file", {
        "uri": syllabusFile.uri,
        "name": fileName,
        "type": `image/${fileType}`,
      } as any);
    }

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
      <View className="flex-1 justify-center items-center py-20 px-6 backdrop-blur-lg bg-primary-20/70 ">
        <View className="bg-white w-full rounded-lg border-2 border-primary justify-center">
          <Text className="text-heading font-bold mt-4 self-center">
            {title}
          </Text>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Title
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.title}
                onChangeText={(text) => handleInputChange("title", text)}
              />
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Teacher
              </Text>
              <View className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md" >
                <Picker
                  selectedValue={formData.teacher_code}
                  onValueChange={(itemValue) =>
                    handleInputChange("teacher_code", itemValue)
                  }
                >
                  {teachers.map((teacher) => (
                    <Picker.Item
                      key={teacher.teacher_code}
                      label={teacher.name + " (" + teacher.teacher_code + ")" }
                      value={teacher.teacher_code}
                    />
                  ))}
                </Picker>
              </View>
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
                Start Time
              </Text>
              <TouchableOpacity onPress={() => {setStartTimePickerVisibility(true)}}>
                <TextInput
                  className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                  value={formData.start}
                  editable={false}
                  pointerEvents="none"
                />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isStartTimePickerVisible}
                mode="time"
                onConfirm={handleStartTimeConfirm}
                onCancel={() => {setStartTimePickerVisibility(false)}}
              />
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                End Time
              </Text>
              
              <TouchableOpacity onPress={() => {setEndTimePickerVisibility (true)}}>
                <TextInput
                  className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                  value={formData.end}
                  editable={false}
                  pointerEvents="none"
                />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isEndTimePickerVisible}
                mode="time"
                onConfirm={handleEndTimeConfirm}
                onCancel={() => {setEndTimePickerVisibility(false)}}
              />
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Status
              </Text>
              <View className="h-12 mb-3 bg-primary-10 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md" >
                <Picker
                  selectedValue={formData.status}
                  onValueChange={(itemValue) =>
                    handleInputChange("status", itemValue)
                  }
                >
                  <Picker.Item label="Active" value={2} />
                  <Picker.Item label="Pending" value={1} />
                  <Picker.Item label="Expired" value={0} />
                </Picker>
              </View>
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Meeting Link
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.room}
                onChangeText={(text) => handleInputChange("room", text)}
              />
            </View>
            
            <View className="items-center">
              <TouchableOpacity
                onPress={pickSyllabus}
                className= {`bg-primary-20 p-2 rounded w-[80%] ${syllabusFile? 'mb-2' : 'mb-4'}`}
              >
                <Text className="text-center text-gray-600">Upload Syllabus</Text>
              </TouchableOpacity>

              {syllabusFile && (
                <View className="mb-4">
                  <Text className="text-small font-medium">Selected Syllabus: {syllabusFile.name}</Text>
                </View>
              )}
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

export default AddClassGroupModal;
