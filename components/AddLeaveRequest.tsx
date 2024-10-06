import React, { useState, useRef } from "react";
import { View, Text, TextInput, Modal, ScrollView, TouchableOpacity } from "react-native";
import AppButton from "@/components/Button";
import NotificationBanner, { NotificationBannerRef } from "./NotificationBanner";
import DateTimePicker from "react-native-modal-datetime-picker";

interface LeaveData {
  student_code: string;
  option: string;
  start_time: string;
  end_time: string;
}

interface LeaveModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (leaveData: FormData) => void;
  title: string;
  studentID: string;
}

const AddLeaveModal: React.FC<LeaveModalProps> = ({ visible, onClose, onSubmit, title, studentID }) => {
  const notificationBannerRef = useRef<NotificationBannerRef>(null);

  const showBanner = (message: string, type: 'success' | 'error') => {
    notificationBannerRef.current?.handleShowBanner(message, type);
  };

  const [formData, setFormData] = useState<LeaveData>({
    student_code: studentID,
    option: "",
    start_time: "",
    end_time: "",
  });

  const [showDateInputs, setShowDateInputs] = useState(false);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  const handleStartDateConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];

    handleInputChange("start_time", formattedDate);
    setStartDatePickerVisibility(false);
  };

  const handleEndDateConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];

    handleInputChange("end_time", formattedDate);
    setEndDatePickerVisibility(false);
  };

  const handleInputChange = (field: keyof LeaveData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleLeaveTypeChange = (type: string) => {
    setFormData({ ...formData, option: type });
    setShowDateInputs(true); // Show date inputs when a leave type is selected
  };

  const handleSubmit = async () => {
    const requiredFields: (keyof LeaveData)[] = ["student_code", "option", "start_time", "end_time"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      showBanner(`Missing fields: ${missingFields.join(", ")}`, 'error');
      return;
    }

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key as keyof typeof formData] || "");
    });

    onSubmit(form);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <NotificationBanner ref={notificationBannerRef} message="" type="success" />
      <View className="flex-1 justify-center items-center py-20 px-6 backdrop-blur-lg bg-primary-20/70">
        <View className="bg-white w-full rounded-lg border-2 border-primary justify-center">
          <Text className="text-heading font-bold mt-4 self-center">{title}</Text>
          <ScrollView contentContainerStyle={{ padding: 14 }}>
            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">Student Code</Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md text-black"
                value={formData.student_code}
                editable={false}
                pointerEvents="none"
              />
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">Leave Type</Text>
              <View className="pl-5 flex-col mb-4 text-medium">
                <TouchableOpacity onPress={() => handleLeaveTypeChange("short leave")}>
                  <Text
                    className={`mr-2 text-medium mb-3 ${
                      formData.option === "short leave"
                        ? "text-primary font-bold"
                        : "text-gray-600"
                    }`}
                    onPress={() =>
                      handleLeaveTypeChange("short leave")
                    }
                  >
                    Short Leave (Less than 30 days)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleLeaveTypeChange("long leave")}>
                  <Text
                    className={`mr-2 text-medium ${
                      formData.option === "long leave"
                        ? "text-primary font-bold"
                        : "text-gray-600"
                    }`}
                    onPress={() =>
                      handleLeaveTypeChange("long leave")
                    }
                  >
                    Long Leave (More than 30 days)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {showDateInputs && (
              <>
                <View className="w-full">
                  <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">Start Date</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setStartDatePickerVisibility(true);
                    }}
                  >
                    <TextInput
                      className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                      value={formData.start_time}
                      editable={false}
                      pointerEvents="none"
                      style={{ color: "black" }}
                    />
                  </TouchableOpacity>
                  <DateTimePicker
                    isVisible={isStartDatePickerVisible}
                    mode="date"
                    onConfirm={handleStartDateConfirm}
                    onCancel={() => {
                      setStartDatePickerVisibility(false);
                    }}
                  />
                </View>

                  {/* ------- */}

                <View className="w-full">
                  <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">End Date</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setEndDatePickerVisibility(true);
                    }}
                  >
                    <TextInput
                      className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                      value={formData.end_time}
                      editable={false}
                      pointerEvents="none"
                      style={{ color: "black" }}
                    />
                  </TouchableOpacity>
                  <DateTimePicker
                    isVisible={isEndDatePickerVisible}
                    mode="date"
                    onConfirm={handleEndDateConfirm}
                    onCancel={() => {
                      setEndDatePickerVisibility(false);
                    }}
                  />
                </View>
              </>
            )}

            <View className="flex-row justify-end">
              <AppButton title="Cancel" class_Name="bg-secondary-50 px-4 mr-2" onPress={onClose} />
              <AppButton title="Submit" class_Name="bg-primary px-4" onPress={handleSubmit} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AddLeaveModal;
