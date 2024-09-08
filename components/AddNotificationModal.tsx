import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import AppButton from "@/components/Button";
import { useApp } from "@/context/app";
import NotificationBanner, {NotificationBannerRef} from "./NotificationBanner";

type NoticeData = {
  title: string;
  description: string;
};

interface AddNotificationProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (NoticeData: NoticeData) => void;
  title: string;
}

const AddNotificationModal: React.FC<AddNotificationProps> = ({
  visible,
  onClose,
  onSubmit,
  title,
}) => {

  // notification
  const notificationBannerRef = useRef<NotificationBannerRef>(null);
  const showBanner = (message: string, type: 'success' | 'error') => {
    notificationBannerRef.current?.handleShowBanner(message, type);
  }

  const [formData, setFormData] = useState<{title: string; description:string}>({
    title: "",
    description: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };


  const handleSubmit = async () => {
    const requiredFields = [
      "title",
      "description",
    ];
  
    // Check for missing fields
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );
  
    if (missingFields.length > 0) {
      showBanner(`Missing fields: ${missingFields.join(", ")}`, 'error')
      return;
    }
  

    onSubmit(formData);
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

          <ScrollView contentContainerStyle={{ padding: 14 }}>
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
                Description
              </Text>
              <TextInput
                className="h-24 bg-primary-10 mb-4 p-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.description}
                onChangeText={(text) => handleInputChange("description", text)}
                multiline={true}
                numberOfLines={4}  // Adjust this value as needed
                textAlignVertical="top"
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

export default AddNotificationModal;
