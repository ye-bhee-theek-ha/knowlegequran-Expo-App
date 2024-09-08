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
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import AppButton from "@/components/Button";
import { Picker } from "@react-native-picker/picker";
import { useApp } from "@/context/app";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import NotificationBanner, {NotificationBannerRef} from "./NotificationBanner";

interface AddTeacherModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (teacherData: FormData) => void;
  title: string;
}

interface ImageData {
  uri: string;
  name: string;
  type: string;
  blob: Blob;
}

interface TeacherFormData {
  teacher_code: string;
  teacher_name: string;
  gender: string;
  fhm_name: string;
  cnic: string;
  experience: string;
  language: string;
  dob: string;
  qual: string;
  subjects: string;
  city: string;
  teacher_contact: string;
  emergency_contact: string;
  email: string;
  password: string;
  teacher: string;
}


const AddTeacherModal: React.FC<AddTeacherModalProps> = ({
  visible,
  onClose,
  onSubmit,
  title,
}) => {

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [image, setImage] = useState<null | { uri: string }>(null);

  const notificationBannerRef = useRef<NotificationBannerRef>(null);
  const showBanner = (message: string, type: 'success' | 'error') => {
    notificationBannerRef.current?.handleShowBanner(message, type);
  }


  const [formData, setFormData] = useState<TeacherFormData>({
    teacher_code: "",
    teacher_name: "",
    gender: "male",
    fhm_name: "",
    cnic: "",
    experience: "",
    language: "",
    dob: "",
    qual: "",
    subjects: "",
    city: "",
    teacher_contact: "",
    emergency_contact: "",
    email: "",
    password: "",
    teacher: "quran_teacher",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDateConfirm = (date : Date) => {
    const formattedDate = date.toISOString().split('T')[0];

    handleInputChange("dob", formattedDate);
    setDatePickerVisibility(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };




  const handleSubmit = async () => {
    const requiredFields = [
      "teacher_code",
      "teacher_name",
      "gender",
      "fhm_name",
      "cnic",
      "experience",
      "language",
      "dob",
      "qual",
      "subjects",
      "city",
      "teacher_contact",
      "emergency_contact",
      "email",
      "password",
      "teacher",
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

    if (image) {
      const fileName = image.uri.split("/").pop();
      const fileType = fileName?.split(".").pop();

      form.append("user_image", {
        uri: image.uri,
        name: fileName,
        type: `image/${fileType}`,
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
      <NotificationBanner ref={notificationBannerRef} message="" type="success" />


      <View className="flex-1 justify-center items-center py-20 px-6 backdrop-blur-lg bg-primary-20/70 ">
        <View className="bg-white w-full rounded-lg border-2 border-primary justify-center">
          <Text className="text-heading font-bold mt-4 self-center">
            {title}
          </Text>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Teacher Code
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.teacher_code}
                onChangeText={(text) => handleInputChange("teacher_code", text)}
              />
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
              Teacher Name
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.teacher_name}
                onChangeText={(text) => handleInputChange("teacher_name", text)}
              />
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Gender
              </Text>
              <View className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md" >
                <Picker
                  selectedValue={formData.gender}
                  onValueChange={(itemValue) =>
                    handleInputChange("gender", itemValue)
                  }
                >
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                </Picker>
              </View>
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Father's/Mother's Name
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.fhm_name}
                onChangeText={(text) => handleInputChange("fhm_name", text)}
              />
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                CNIC
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.cnic}
                onChangeText={(text) => handleInputChange("cnic", text)}
              />
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Email
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                keyboardType="email-address"
              />
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Password
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.password}
                onChangeText={(text) => handleInputChange("password", text)}
                secureTextEntry
              />
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Experience
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.experience}
                onChangeText={(text) => handleInputChange("experience", text)}
              />
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Qualification
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.qual}
                onChangeText={(text) => handleInputChange("qual", text)}
              />
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Date of Birth
              </Text>
              <TouchableOpacity onPress={() => {setDatePickerVisibility(true)}}>
                <TextInput
                  className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                  value={formData.dob}
                  editable={false}
                  pointerEvents="none"
                />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={() => {setDatePickerVisibility(false)}}
              />
            </View>
            
            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Language
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.language}
                onChangeText={(text) => handleInputChange("language", text)}
              />
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Subjects
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.subjects}
                onChangeText={(text) => handleInputChange("subjects", text)}
              />
            </View>


            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                City
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.city}
                onChangeText={(text) => handleInputChange("city", text)}
              />
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Teacher contact
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.teacher_contact}
                onChangeText={(text) => handleInputChange("teacher_contact", text)}
              />
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Emergency contact
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.emergency_contact}
                onChangeText={(text) => handleInputChange("emergency_contact", text)}
              />
            </View>


            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Teacher Type
              </Text>
              <View className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md">
                <Picker
                  selectedValue={formData.teacher}
                  onValueChange={(itemValue) =>
                    handleInputChange("teacher", itemValue)
                  }
                >
                  <Picker.Item label="Quran Tracher" value="quran_teacher" />
                  <Picker.Item label="School Teacher" value="school_teacher" />
                </Picker>
              </View>
            </View>
            
            <View className="items-center">
              <TouchableOpacity
                onPress={pickImage}
                className="bg-primary-20 p-2 rounded w-[80%] mb-4"
              >
                <Text className="text-center text-gray-600">Pick an Image</Text>
              </TouchableOpacity>

              {image && (
                <Image
                  source={{ uri: image.uri }}
                  className="w-28 h-28 rounded-lg border mb-4"
                />
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

export default AddTeacherModal;
