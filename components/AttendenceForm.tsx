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
import NotificationBanner, {
  NotificationBannerRef,
} from "./NotificationBanner";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface AttendanceData {
  code: string;
  role_id: number;
  date: string;
  teacher_code: string;
  attendance: string;

  education_type?: "Quranic Study" | "Schoolic Study"; // Education type
  course_name_quranic?: string;
  course_name_schoolic?: string;
  lesson_progress?: string; // Lesson progress
  lesson_number?: number; // Lesson number
  line_number?: number; // Line number
  parah_number?: number; // Parah number
  rukoo_number?: number; // Rukoo number
  surah_name?: string; // Surah name
  book_name?: string; // Book name
  chapter_number?: string; // Chapter number
  Language?: string;
  Subject?: string;

  namaz?: string; // Namaz attendance
  namaz_reasons?: string; // Reasons for missing Namaz
  namaz_counting?: "complete" | "less_than_5" | "none"; // Namaz counting
  namaz_attendance_compulsory?: string[]; // Array of Namaz attendance
  problem?: string; // Problem description
  problem_select?: "teacher" | "student"; // Problem caused by
  teacher_issue?: string; // Teacher issue
  other_issues_text?: string; // Other issues
  student_issue?: string; // Student issue
  other_student_issues_text?: string; // Other student issues
  problem_solved?: string; // Problem solution
  ask_786_group?: string;
  solved_by_786?: string; // Solved by 786 group
  lesson_progress_issue_type?: string; // Lesson progress issue type

  monthly_project?: string; // Monthly project
  guide_student_improve?: "yes" | "no";
  praise_student?: "yes" | "no";
  monthly_project_ins?: string;

  leave_reason?: string; // Reason for leave
  permission_from_gm_teacher_leave?: string;
  emergency_reason?: string;
  contacted_gm_for_location?: string;
  inform_whatsapp_group_for_leave?: string;

  leave_times?: string;
  informed_gm?: string;
  informed_whatsapp?: string;
  leave_reason_student?: string;
  emergency_reason_student?: string;
  absent_times?: string;

  was_test_done?: string;
  testNotReason?: string;
  reasonNotDoingTestText?: string;

  notice_form_noted?: string;
  test_details?: string; // Test details
  class_progress?: string; // Class progress
  reason_not_reading_text?: string; // Reason for not reading
}

interface AttendenceFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (AttendenceData: FormData) => void;
  title: string;
  studentName: string;
  studentID: string;
  TeacherID: string;
}

const AttendenceForm: React.FC<AttendenceFormProps> = ({
  visible,
  onClose,
  onSubmit,
  title,
  studentName,
  studentID,
  TeacherID,
}) => {
  // Notification
  const notificationBannerRef = useRef<NotificationBannerRef>(null);
  const showBanner = (message: string, type: "success" | "error") => {
    notificationBannerRef.current?.handleShowBanner(message, type);
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // Form state
  const [formData, setFormData] = useState<AttendanceData>({
    code: studentID,
    role_id: 4,
    teacher_code: TeacherID,
    date: new Date().toISOString().split("T")[0],
    attendance: "",
    education_type: undefined,
    course_name_quranic: "",
    course_name_schoolic: "",
    lesson_progress: "",
    lesson_number: undefined,
    line_number: undefined,
    parah_number: undefined,
    rukoo_number: undefined,
    book_name: "",
    chapter_number: "",
    Language: "",
    surah_name: "",
    namaz: undefined,
    namaz_reasons: undefined,
    namaz_counting: undefined,
    namaz_attendance_compulsory: [],
    problem: undefined,
    problem_select: undefined,
    teacher_issue: undefined,
    other_issues_text: undefined,
    student_issue: undefined,
    other_student_issues_text: undefined,
    problem_solved: undefined,
    solved_by_786: undefined,
    ask_786_group: undefined,
    lesson_progress_issue_type: undefined,
    monthly_project: undefined,
    leave_reason: undefined,
    test_details: undefined,
    class_progress: undefined,
    reason_not_reading_text: undefined,
  });

  // Handle input changes dynamically
  const handleInputChange = (field: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleDateConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];

    handleInputChange("date", formattedDate);
    setDatePickerVisibility(false);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form data (optional)
    const requiredFields = [
     "attendance"
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
      const value = formData[key as keyof typeof formData];
    
      // Convert non-string values to strings
      if (typeof value === 'number') {
        form.append(key, String(value)); // Convert number to string
      } else if (Array.isArray(value)) {
        form.append(key, JSON.stringify(value)); // Convert array to string (or use .join(',') if needed)
      } else if (typeof value === 'string') {
        form.append(key, value); // Append string values directly
      }
    });


    onSubmit(form);
    onClose();
  };

  // Attendance options
  const attendanceOptions = [
    { label: "Present", value: "4" },
    { label: "Absent by Teacher", value: "0" },
    { label: "Absent by Student", value: "1" },
    { label: "Leave by Teacher", value: "2" },
    { label: "Leave by Student", value: "5" },
    { label: "Test Today", value: "3" },
  ];

  const educationOptions = [
    { label: "Quranic Study قرآن کی علی", value: "Quranic Study" },
    { label: "Schoolic Study سکل ک تعیم", value: "Schoolic Study" },
  ];

  const courseOptionsQuranic = [
    { label: "Qaidah", value: "Qaidah" },
    { label: "Nazrah Quran", value: "Nazrah Quran" },
    { label: "Hifz-ul-Quran", value: "Hifz-ul-Quran" },
    { label: "Translation & Tafseer", value: "Translation & Tafseer" },
    { label: "Tarbiyah", value: "Tarbiyah" },
    { label: "Tajweed", value: "Tajweed" },
    { label: "Language", value: "Language" },
    { label: "Other", value: "Other" },
  ];

  const courseOptionsSchoolic = [
    { label: "Physics", value: "Physics" },
    { label: "Chemistry", value: "Chemistry" },
    { label: "Biology", value: "Biology" },
    { label: "Accounting", value: "Accounting" },
    { label: "Computer", value: "Computer" },
    { label: "Urdu Language Course", value: "Urdu" },
    { label: "English Language", value: "English" },
    { label: "Arabic عربی", value: "Arabic" },
  ];

  const languageOptions = [
    { label: "Urdu", value: "Urdu" },
    { label: "Arabic", value: "Arabic" },
    { label: "Persian", value: "Persian" },
    { label: "English", value: "English" },
  ];

  const namazOptions = [
    { label: "Compulsory", value: "Compulsory" },
    { label: "Not Compulsory", value: "Not-Compulsory" },
  ];

  const namazCountingOptions = [
    { label: "Complete", value: "complete" },
    { label: "Less than 5", value: "less_than_5" },
    { label: "None", value: "none" },
  ];

  const namazReasonOptions = [
    { label: "Appointment", value: "appointment" },
    { label: "Illness", value: "illness" },
    { label: "Traffic", value: "traffic" },
    { label: "Party", value: "party" },
    { label: "Forgot", value: "forgot" },
    { label: "Exam", value: "exam" },
    { label: "Other", value: "other" },
  ];

  const notCompulsoryReasons = [
    {
      label: "No need because of less than 7 years",
      value: "No need because of less than 7 years",
    },
    {
      label: "Above 18, will be questioned only once a week",
      value: "Above 18",
    },
    { label: "Disabled mental condition", value: "disabled" },
    {
      label: "Special instructions by institute",
      value: "special_instructions",
    },
    { label: "No need", value: "no_need" },
  ];

  const prayers = [
    { label: "Fajar", value: "Fajar" },
    { label: "Zuhur", value: "Zuhur" },
    { label: "Asar", value: "Asar" },
    { label: "Maghrib", value: "Maghrib" },
    { label: "Esha", value: "Esha" },
  ];

  const lessonProgressOptions = [
    { label: "Excellent", value: "excellent" },
    { label: "Average بس مناسب سا", value: "average" },
    { label: "Poor بہت ہی برا", value: "poor" },
    {
      label: "Did not read any lesson کچھ ھی سبق ن پڑ ا",
      value: "did_not_read",
    },
  ];

  const lessonIssueOptions = [
    { label: "One time issue ایک بر ا مسئلہ", value: "one_time_issue" },
    { label: "On and Off issue کبھی کبھر کا مسئلہ", value: "on_off_issue" },
    { label: "Repeated issue بار بار کا مسئہ", value: "repeated_issue" },
  ];

  const monthlyProjectOptions = [
    { label: "Continued", value: "Continue" },
    {
      label: "No Need as Student has Disabled Mental Condition",
      value: "no_need",
    },
  ];

  const leaveReasonsOptions = [
    { label: "For marriage شادی کے لیئے", value: "marriage" },
    { label: "For travelling out city دوسرے شہر سفر کے لیئے", value: "travel" },
    { label: "For illness بیماری کے لیئے", value: "illness" },
    { label: "For Funeral وفات یا جنازہ کے لیئے", value: "funeral" },
    {
      label: "For electricity problem بجلی کے مسئلہ کی وجہ سے",
      value: "electricity_issue",
    },
    {
      label: "For internet problem انٹرنٹ کی خرابی کی وجہ سے",
      value: "internet_issue",
    },
    {
      label: "For device problem سٹم کی خرابی کی وجہ سے",
      value: "device_issue",
    },
    { label: "Household issues گھریلو مسئلہ", value: "household_issue" },
    { label: "For child birth بچے کی پیدائش کی وجہ سے", value: "child_birth" },
    {
      label: "Others emergency مندجہ باالا وجوہات کے لاوہ",
      value: "other_emergency",
    },
  ];

  const travelReasonOptions = [
    { label: "Yes جی ہاں", value: "yes" },
    {
      label:
        "No need because I'll not be taking classes there ضرورت نہیں کیونکہ مجھے نئی جگہ کلاسیں نہیں لینی",
      value: "no_need",
    },
  ];

  const noticeFormOptions = [{ label: "Noted", value: "noted" }];

  const leaveTimesOptions = [
    {
      label: "One time leave in a month ایک ماہ میں ایک دفعہ غیر حاضری",
      value: "one_time",
    },
    { label: "Second leave in a month", value: "second" },
    {
      label: "More than 2 leaves in a month ایک ماہ میں 2 سے زیادہ غیر حاضر",
      value: "more_than_2",
    },
  ];

  const informedOptions = [
    { label: "Informed GM every time", value: "informed_everytime" },
    { label: "Yes", value: "yes" },
  ];

  const leaveReasonStudentOptions = [
    {
      label: "Student forgot to attend the class طالب علم کلاس لینا بھول گیا۔",
      value: "forgot_to_attend",
    },
    { label: "Due to exam issue امتحانات کی وجہ سے", value: "exam_issue" },
    {
      label:
        "Due to internet/electricity problem انٹرنیٹ یا بجلی نہ ہونے کی وجہ سے",
      value: "internet_electricity_issue",
    },
    {
      label: "Because of any appointment کسی ملاقات کی وجہ سے",
      value: "appointment",
    },
    { label: "Stuck in traffic ٹریفک میں پھنسنے کی وجہ سے", value: "traffic" },
    { label: "Student was ill بیماری کی وجہ سے", value: "illness" },
    { label: "Student was sleeping طالب علم سویا رہا", value: "sleeping" },
    {
      label: "Function in school سکول میں کسی سرگرمی کی وجہ سے",
      value: "function",
    },
    {
      label: "Other emergency اوپر کی گئی وجوہات کے علاوہ کسی اور وجہ سے",
      value: "emergency",
    },
  ];

  const absentTimesOptions = [
    {
      label: "One time absent in a month ایک ماہ میں ایک دفعہ غیر حاضری",
      value: "one_time",
    },
    { label: "Second absent in a month", value: "second" },
    {
      label: "More than 2 absents in a month ایک ماہ میں 2 سے زیادہ غیر حاضری",
      value: "more_than_2",
    },
  ];

  const testNotReasonsOptions = [
    { label: "Examiner was absent ممتحن غیر حاضر تھے", value: "absent" },
    { label: "Examiner was late ممتحن دیر سے آئے", value: "late" },
    {
      label:
        "Internet connection problem from examiner side ممتحن کی طرف سے انٹرنیٹ کا مسئلہ تھا",
      value: "Internet_connection_problem",
    },
    {
      label: "Examiner used wrong syllabus ممتحن نے غلط سلیبس کا انتخاب کیا",
      value: "wrong_syllabus",
    },
    {
      label:
        "Background noise from examiner side ممتحن کی طرف سے شور سنائی دینا",
      value: "Background_noise",
    },
    {
      label:
        "Examiner was not giving proper concentration ممتحن کا بے توجہی سے ٹیسٹ لینا",
      value: "concentration",
    },
    {
      label: "Examiner took short test ممتحن کا طے کردہ وقت سے کم ٹیسٹ لینا",
      value: "short_test",
    },
    {
      label:
        "Examiner was unaware of syllabus ممتحن ٹیسٹ کے سلیبس سے لاعلم تھے",
      value: "unaware",
    },
    { label: "Other issue اوپر کی گئی وجوہات کے علاوہ", value: "Other" },
  ];

  const testNotReasonOptions = [
    { value: "absent", label: "Examiner was absent ممتن غیر حاضر تھے" },
    { value: "late", label: "Examiner was late ممتح دیر سے آئ" },
    {
      value: "internet",
      label:
        "Internet connection problem from examiner side ممتحن کی طرف سے نٹرنیٹ کا مسئلہ تھا",
    },
    {
      value: "wrong_syllabus",
      label: "The examiner used wrong syllabus ممتح نے غلط سلیبس لے لیا",
    },
    {
      value: "background_noise",
      label:
        "Background noise from examiner side ممتحن کی طرف سے شور سنائی دینا",
    },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <NotificationBanner
        ref={notificationBannerRef}
        message=""
        type="success"
      />
      <View className="flex-1 justify-center items-center py-20 px-6 backdrop-blur-lg bg-primary-20/70">
        <View className="bg-white w-full rounded-lg border-2 border-primary justify-center">
          <Text className="text-heading font-bold mt-4 self-center">
            {title}
          </Text>

          <ScrollView contentContainerStyle={{ padding: 14 }}>
            {/* Student Code Input */}
            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Student Code
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.code}
                onChangeText={(text) => handleInputChange("studentCode", text)}
                editable={false}
                pointerEvents="none"
                style={{ color: "black" }}
              />
            </View>

            {/* Date Input */}
            <View className="w-full">
              <TouchableOpacity
                onPress={() => {
                  setDatePickerVisibility(true);
                }}
              >
                <TextInput
                  className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                  value={formData.date}
                  editable={false}
                  pointerEvents="none"
                  style={{ color: "black" }}
                />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={() => {
                  setDatePickerVisibility(false);
                }}
              />
            </View>

            {/* Attendance Radio Group */}
            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Attendance
              </Text>
              <View className="mb-4 pl-5">
                {attendanceOptions.map((option) => (
                  <View
                    key={option.value}
                    className="flex-row items-center mb-2"
                  >
                    <Text
                      className={`mr-2 text-medium ${
                        formData.attendance === option.value
                          ? "text-primary font-bold"
                          : "text-gray-600"
                      }`}
                      onPress={() =>
                        handleInputChange("attendance", option.value)
                      }
                    >
                      {option.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* present */}

            {formData.attendance === "4" && (
              <View className="w-full">
                <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                  Please choose education type برا کرم یح ش کا انتاب یئ:
                </Text>
                <View className="mb-4 pl-5">
                  {educationOptions.map((option) => (
                    <View
                      key={option.value}
                      className="flex-row items-center mb-2"
                    >
                      <Text
                        className={`mr-2 text-medium ${
                          formData.education_type === option.value
                            ? "text-primary font-bold"
                            : "text-gray-600"
                        }`}
                        onPress={() =>
                          handleInputChange("education_type", option.value)
                        }
                      >
                        {option.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* selecting courses based on course names */}

            {formData.attendance === "4" &&
              formData.education_type == "Quranic Study" && (
                <View className="w-full">
                  <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                    Course Name کورس ک نم:
                  </Text>
                  <View className="mb-4 pl-5">
                    {courseOptionsQuranic.map((option) => (
                      <View
                        key={option.value}
                        className="flex-row items-center mb-2"
                      >
                        <Text
                          className={`mr-2 text-medium ${
                            formData.course_name_quranic === option.value
                              ? "text-primary font-bold"
                              : "text-gray-600"
                          }`}
                          onPress={() =>
                            handleInputChange(
                              "course_name_quranic",
                              option.value
                            )
                          }
                        >
                          {option.label}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* more options for quranic course options */}

                  <View className="ml-4">
                    {formData.course_name_quranic === "Qaidah" && (
                      <View>
                        <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                          Lesson Number (1-25)
                        </Text>
                        <TextInput
                          className="text-medium py-1 text-gray-600 font-normal mb-2 pl-3 border border-primary-75 rounded-md"
                          placeholder="Enter Lesson Number"
                          keyboardType="numeric"
                          value={
                            formData.lesson_number !== undefined
                              ? formData.lesson_number.toString()
                              : undefined
                          }
                          onChangeText={(value) =>
                            handleInputChange("lesson_number", value)
                          }
                        />
                        <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                          Line Number
                        </Text>
                        <TextInput
                          className="text-medium py-1 text-gray-600 font-normal mb-2 pl-3 border border-primary-75 rounded-md"
                          placeholder="Enter Line Number"
                          keyboardType="numeric"
                          value={
                            formData.line_number !== undefined
                              ? formData.line_number.toString()
                              : undefined
                          }
                          onChangeText={(value) =>
                            handleInputChange("line_number", value)
                          }
                        />
                      </View>
                    )}

                    {/* FIX BACKEND OPTIONS */}
                    {(formData.course_name_quranic === "Nazrah Quran" ||
                      formData.course_name_quranic === "Hifz-ul-Quran" ||
                      formData.course_name_quranic ===
                        "Translation & Tafseer") && (
                      <View>
                        <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                          Parah Number (1-30)
                        </Text>
                        <TextInput
                          className="text-medium py-1 text-gray-600 font-normal mb-2 pl-3 border border-primary-75 rounded-md"
                          placeholder="Enter Parah Number"
                          keyboardType="numeric"
                          value={
                            formData.parah_number !== undefined
                              ? formData.parah_number.toString()
                              : undefined
                          }
                          onChangeText={(value) =>
                            handleInputChange("parah_number", value)
                          }
                        />
                        <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                          Rukoo Number (1-39)
                        </Text>
                        <TextInput
                          className="text-medium py-1 text-gray-600 font-normal mb-2 pl-3 border border-primary-75 rounded-md"
                          placeholder="Enter Rukoo Number"
                          keyboardType="numeric"
                          value={
                            formData.rukoo_number !== undefined
                              ? formData.rukoo_number.toString()
                              : undefined
                          }
                          onChangeText={(value) =>
                            handleInputChange("rukoo_number", value)
                          }
                        />
                      </View>
                    )}

                    {formData.course_name_quranic === "Tarbiyah" && (
                      <View>
                        <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                          Book Name
                        </Text>
                        <TextInput
                          className="text-medium py-1 text-gray-600 font-normal mb-2 pl-3 border border-primary-75 rounded-md"
                          placeholder="Enter Book Name"
                          value={formData.book_name}
                          onChangeText={(value) =>
                            handleInputChange("book_name", value)
                          }
                        />
                        <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                          Chapter Number
                        </Text>
                        <TextInput
                          className="text-medium py-1 text-gray-600 font-normal mb-2 pl-3 border border-primary-75 rounded-md"
                          placeholder="Enter Chapter Number"
                          value={formData.chapter_number}
                          onChangeText={(value) =>
                            handleInputChange("chapter_number", value)
                          }
                        />
                      </View>
                    )}

                    {formData.course_name_quranic === "Tajweed" && (
                      <View>
                        <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                          Lesson Number
                        </Text>
                        <TextInput
                          placeholder="Enter Lesson Number"
                          className="text-medium py-1 text-gray-600 font-normal mb-2 pl-3 border border-primary-75 rounded-md"
                          value={
                            formData.lesson_number !== undefined
                              ? formData.lesson_number.toString()
                              : undefined
                          }
                          onChangeText={(value) =>
                            handleInputChange("lesson_number", value)
                          }
                        />
                        <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                          Rukoo Number
                        </Text>
                        <TextInput
                          className="text-medium py-1 text-gray-600 font-normal mb-2 pl-3 border border-primary-75 rounded-md"
                          placeholder="Enter Chapter Number"
                          keyboardType="numeric"
                          value={
                            formData.rukoo_number !== undefined
                              ? formData.rukoo_number.toString()
                              : undefined
                          }
                          onChangeText={(value) =>
                            handleInputChange("rukoo_number", value)
                          }
                        />
                        <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                          Surah Name
                        </Text>
                        <TextInput
                          className="text-medium py-1 text-gray-600 font-normal mb-2 pl-3 border border-primary-75 rounded-md"
                          placeholder="Enter Surah Name"
                          value={formData.surah_name}
                          onChangeText={(value) =>
                            handleInputChange("surah_name", value)
                          }
                        />
                      </View>
                    )}

                    {formData.course_name_quranic === "Language" && (
                      <View>
                        <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                          Language
                        </Text>
                        <View className="mb-4 pl-5">
                          {languageOptions.map((option) => (
                            <View
                              key={option.value}
                              className="flex-row items-center mb-2"
                            >
                              <Text
                                className={`mr-2 text-medium ${
                                  formData.Language === option.value
                                    ? "text-primary font-bold"
                                    : "text-gray-600"
                                }`}
                                onPress={() =>
                                  handleInputChange("Language", option.value)
                                }
                              >
                                {option.label}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {formData.course_name_quranic === "Other" && (
                      <View>
                        <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                          Subject
                        </Text>
                        <TextInput
                          className="text-medium py-1 text-gray-600 font-normal mb-2 pl-3 border border-primary-75 rounded-md"
                          placeholder="Enter Subject"
                          value={formData.Subject}
                          onChangeText={(value) =>
                            handleInputChange("subject", value)
                          }
                        />
                        <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                          Lesson Progress
                        </Text>
                        <TextInput
                          className="text-medium py-1 text-gray-600 font-normal mb-2 pl-3 border border-primary-75 rounded-md"
                          placeholder="Enter Lesson Progress"
                          value={formData.lesson_progress}
                          onChangeText={(value) =>
                            handleInputChange("lesson_progress", value)
                          }
                        />
                      </View>
                    )}
                  </View>
                </View>
              )}

            {formData.attendance === "4" &&
              formData.education_type == "Schoolic Study" && (
                <View className="w-full">
                  <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                    Course Name کورس ک نم:
                  </Text>
                  <View className="mb-4 pl-5">
                    {courseOptionsSchoolic.map((option) => (
                      <View
                        key={option.value}
                        className="flex-row items-center mb-2"
                      >
                        <Text
                          className={`mr-2 text-medium ${
                            formData.course_name_schoolic === option.value
                              ? "text-primary font-bold"
                              : "text-gray-600"
                          }`}
                          onPress={() =>
                            handleInputChange(
                              "course_name_schoolic",
                              option.value
                            )
                          }
                        >
                          {option.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

            {/* namaz */}
            {formData.attendance === "4" && (
              <View className="w-full">
                <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                  Namaz Attendance
                </Text>
                <View className="mb-4 pl-5">
                  {namazOptions.map((option) => (
                    <View
                      key={option.value}
                      className="flex-row items-center mb-2"
                    >
                      <Text
                        className={`mr-2 text-medium ${
                          formData.namaz === option.value
                            ? "text-primary font-bold"
                            : "text-gray-600"
                        }`}
                        onPress={() => handleInputChange("namaz", option.value)}
                      >
                        {option.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Namaz Counting Options */}
            {formData.attendance === "4" && formData.namaz === "Compulsory" && (
              <>
                <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                  Counting of Nimaz
                </Text>
                <View className="mb-4 pl-5">
                  {namazCountingOptions.map((option) => (
                    <View
                      key={option.value}
                      className="flex-row items-center mb-2"
                    >
                      <Text
                        className={`mr-2 text-medium ${
                          formData.namaz_counting === option.value
                            ? "text-primary font-bold"
                            : "text-gray-600"
                        }`}
                        onPress={() =>
                          handleInputChange("namaz_counting", option.value)
                        }
                      >
                        {option.label}
                      </Text>
                    </View>
                  ))}
                </View>

                {formData.namaz_counting === "less_than_5" && (
                  <View>
                    <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                      Reason for not offering prayer
                    </Text>
                    <View className="mb-4 pl-5">
                      {prayers.map((option) => (
                        <View
                          key={option.value}
                          className="flex-row items-center mb-2"
                        >
                          <Text
                            className={`mr-2 text-medium ${
                              formData.namaz_attendance_compulsory?.includes(
                                option.value
                              )
                                ? "text-primary font-bold"
                                : "text-gray-600"
                            }`}
                            onPress={() => {
                              // Use a default empty array in case it's undefined
                              const updatedArray = (
                                formData.namaz_attendance_compulsory || []
                              ).includes(option.value)
                                ? formData.namaz_attendance_compulsory?.filter(
                                    (item) => item !== option.value
                                  )
                                : [
                                    ...(formData.namaz_attendance_compulsory ||
                                      []),
                                    option.value,
                                  ];

                              // Set the updated array in the state
                              setFormData({
                                ...formData,
                                namaz_attendance_compulsory: updatedArray,
                              });
                            }}
                          >
                            {option.label}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {formData.namaz_counting === "none" && (
                  <View>
                    <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                      Reason for not offering prayer
                    </Text>
                    <View className="mb-4 pl-5">
                      {namazReasonOptions.map((option) => (
                        <View
                          key={option.value}
                          className="flex-row items-center mb-2"
                        >
                          <Text
                            className={`mr-2 text-medium ${
                              formData.namaz_reasons === option.value
                                ? "text-primary font-bold"
                                : "text-gray-600"
                            }`}
                            onPress={() =>
                              handleInputChange("namaz_reasons", option.value)
                            }
                          >
                            {option.label}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </>
            )}

            {formData.attendance === "4" &&
              formData.namaz === "Not-Compulsory" && (
                <View>
                  <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                    Select Reason
                  </Text>
                  <View className="mb-4 pl-5">
                    {notCompulsoryReasons.map((option) => (
                      <View
                        key={option.value}
                        className="flex-row items-center mb-2"
                      >
                        <Text
                          className={`mr-2 text-medium ${
                            formData.namaz_reasons === option.value
                              ? "text-primary font-bold"
                              : "text-gray-600"
                          }`}
                          onPress={() =>
                            handleInputChange("namaz_reasons", option.value)
                          }
                        >
                          {option.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

            {/* problem */}
            {formData.attendance === "4" && (
              <View>
                <View className="mb-4">
                  <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                    Did you face any problem?
                  </Text>
                  <View className="flex-row mb-4 pl-5">
                    {["Yes", "No"].map((option) => (
                      <View key={option} className="mr-4">
                        <Text
                          className={`mr-2 text-medium ${
                            formData.problem === option
                              ? "text-primary font-bold"
                              : "text-gray-600"
                          }`}
                          onPress={() => handleInputChange("problem", option)}
                        >
                          {option}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {formData.problem === "Yes" && (
                  <>
                    {/* Problem caused by: Teacher or Student */}
                    <View className="mb-4">
                      <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                        Who caused the issue?
                      </Text>
                      <View className="flex-row mb-4 pl-5">
                        {["teacher", "student"].map((option) => (
                          <View key={option} className="mr-4">
                            <Text
                              className={`mr-2 text-medium ${
                                formData.problem_select === option
                                  ? "text-primary font-bold"
                                  : "text-gray-600"
                              }`}
                              onPress={() =>
                                handleInputChange("problem_select", option)
                              }
                            >
                              {option === "teacher" ? "Teacher" : "Student"}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    {/* Teacher Issues (if problem_select === 'teacher') */}
                    {formData.problem_select === "teacher" && (
                      <View className="mb-4">
                        <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                          Issues faced by teacher:
                        </Text>
                        {[
                          {
                            label: "Website taking too long to open",
                            value: "website",
                          },
                          {
                            label: "I left the class early",
                            value: "left_early",
                          },
                          {
                            label:
                              "Using mobile during class with GM permission",
                            value: "using_mobile",
                          },
                          {
                            label: "Started class late",
                            value: "started_late",
                          },
                          {
                            label: "Unknown person sitting with me",
                            value: "unknown_person",
                          },
                          { label: "Camera was off", value: "camera_off" },
                          {
                            label: "Background noise from my side",
                            value: "background_noise",
                          },
                          {
                            label: "My voice was cutting",
                            value: "voice_cutting",
                          },
                          {
                            label: "Bad internet connection",
                            value: "internet",
                          },
                          { label: "Other issues", value: "other" },
                        ].map((issue) => (
                          <View
                            key={issue.value}
                            className="flex-row items-center mb-2"
                          >
                            <View className="flex-row pl-5">
                              <Text
                                className={`mr-2 text-medium ${
                                  formData.teacher_issue === issue.value
                                    ? "text-primary font-bold"
                                    : "text-gray-600"
                                }`}
                                onPress={() =>
                                  handleInputChange(
                                    "teacher_issue",
                                    issue.value
                                  )
                                }
                              >
                                {issue.label}
                              </Text>
                            </View>
                          </View>
                        ))}

                        {/* Show input for other issues if selected */}
                        {formData.teacher_issue === "other" && (
                          <TextInput
                            className="mx-4 text-medium py-1 text-gray-600 font-normal mb-2 pl-3 border border-primary-75 rounded-md"
                            placeholder="Please specify the other issues"
                            value={formData.teacher_issue}
                            onChangeText={(text) =>
                              handleInputChange("other_issues_text", text)
                            }
                          />
                        )}
                      </View>
                    )}

                    {/* Student Issues (if problem_select === 'student') */}
                    {formData.problem_select === "student" && (
                      <View className="mb-4">
                        <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                          Issues from student's side:
                        </Text>
                        {[
                          {
                            label:
                              "Internet connection problem from student side",
                            value: "internet_student",
                          },
                          {
                            label:
                              "Too much background noise from student side",
                            value: "noise_student",
                          },
                          {
                            label: "Student voice cutting",
                            value: "voice_cutting_student",
                          },
                          {
                            label: "Screen sharing problem",
                            value: "screen_sharing_student",
                          },
                          { label: "Camera problem", value: "camera_student" },
                          {
                            label: "Student mutes mic",
                            value: "mute_mic_student",
                          },
                          {
                            label: "Call cutting",
                            value: "call_cutting_student",
                          },
                          {
                            label: "Lack of student concentration",
                            value: "lack_concentration_student",
                          },
                          {
                            label: "Slow speed of lesson",
                            value: "slow_speed_student",
                          },
                          {
                            label: "Misbehavior with teacher",
                            value: "misbehavior_teacher_student",
                          },
                          { label: "Other Reason", value: "other_student" },
                        ].map((issue) => (
                          <View
                            key={issue.value}
                            className="flex-row items-center mb-2 ml-5"
                          >
                            <Text
                              className={`mr-2 text-medium ${
                                formData.student_issue === issue.value
                                  ? "text-primary font-bold"
                                  : "text-gray-600"
                              }`}
                              onPress={() =>
                                handleInputChange("student_issue", issue.value)
                              }
                            >
                              {issue.label}
                            </Text>
                          </View>
                        ))}

                        {/* Show input for other student issues if selected */}
                        {formData.student_issue === "other_student" && (
                          <TextInput
                            className="mx-4 text-medium py-1 text-gray-600 font-normal mb-2 pl-3 border border-primary-75 rounded-md"
                            placeholder="Please specify the other issues"
                            value={formData.other_student_issues_text}
                            onChangeText={(text) =>
                              handleInputChange(
                                "other_student_issues_text",
                                text
                              )
                            }
                          />
                        )}
                      </View>
                    )}

                    {/* 786 WhatsApp Group */}
                    <View className="mb-4">
                      <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                        Did you ask 786 WhatsApp group to solve your problem on
                        immediate basis?
                      </Text>
                      <View className="flex-row">
                        {[
                          { label: "Yes", value: "yes" },
                          {
                            label: "No need, solved by myself",
                            value: "no_need",
                          },
                        ].map((option) => (
                          <View key={option.value} className="mr-4 ml-5">
                            <Text
                              className={`mr-2 text-medium ${
                                formData.ask_786_group === option.value
                                  ? "text-primary font-bold"
                                  : "text-gray-600"
                              }`}
                              onPress={() =>
                                handleInputChange("ask_786_group", option.value)
                              }
                            >
                              {option.label}
                            </Text>
                          </View>
                        ))}
                      </View>

                      {/* Show if ask_786_group is 'yes' */}
                      {formData.ask_786_group === "yes" && (
                        <View className="mt-4">
                          <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                            Did your problem get solved by the 786 WhatsApp
                            group?
                          </Text>
                          {[
                            { label: "Yes", value: "yes" },
                            { label: "No", value: "no" },
                          ].map((option) => (
                            <View
                              key={option.value}
                              className="flex-row items-center mb-4 pl-5"
                            >
                              <Text
                                className={`mr-2 text-medium ${
                                  formData.solved_by_786 === option.value
                                    ? "text-primary font-bold"
                                    : "text-gray-600"
                                }`}
                                onPress={() =>
                                  handleInputChange(
                                    "solved_by_786",
                                    option.value
                                  )
                                }
                              >
                                {option.label}
                              </Text>
                            </View>
                          ))}

                          {/* Show message if solved_by_786 is 'no' */}
                          {formData.solved_by_786 === "no" && (
                            <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                              Jazakallah for highlighting the issue, work will
                              be done on it soon by GM in-sha Allah.
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  </>
                )}
              </View>
            )}

            {formData.attendance === "4" && (
              <>
                <View>
                  <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                    How was the lesson today? طالب لم نے آج کا سب کیس پڑھا؟
                  </Text>
                  <View>
                    {lessonProgressOptions.map((option) => (
                      <View
                        key={option.value}
                        className="flex-row items-center mb-4 pl-5"
                      >
                        <Text
                          className={`mr-2 text-medium ${
                            formData.class_progress === option.value
                              ? "text-primary font-bold"
                              : "text-gray-600"
                          }`}
                          onPress={() =>
                            setFormData({
                              ...formData,
                              class_progress: option.value,
                            })
                          }
                        >
                          {option.label}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* If did not read any lesson */}
                  {formData.lesson_progress === "did_not_read" && (
                    <View className="mt-4">
                      <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                        Please write the reason for not reading any lesson برہ
                        رم سبق نہ سنانے ک سبب تحریر کیجیئ۔
                      </Text>
                      <TextInput
                        className="text-medium py-1 text-gray-600 font-normal mb-2 pl-3 border border-primary-75 rounded-md"
                        style={{ height: 100 }}
                        onChangeText={(text) =>
                          setFormData({
                            ...formData,
                            reason_not_reading_text: text,
                          })
                        }
                        value={formData.reason_not_reading_text}
                        multiline
                      />
                    </View>
                  )}

                  {/* If average or poor */}
                  {(formData.lesson_progress === "average" ||
                    formData.lesson_progress === "poor") && (
                    <View className="mt-4">
                      <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                        Please choose any one of these برا کم کسی ایک کا نتخا
                        کیجیئے۔
                      </Text>
                      {lessonIssueOptions.map((issue) => (
                        <View
                          key={issue.value}
                          className="flex-row items-center mb-4 pl-5"
                        >
                          <Text
                            className={`mr-2 text-medium ${
                              formData.lesson_progress_issue_type ===
                              issue.value
                                ? "text-primary font-bold"
                                : "text-gray-600"
                            }`}
                            onPress={() =>
                              setFormData({
                                ...formData,
                                lesson_progress_issue_type: issue.value,
                              })
                            }
                          >
                            {issue.label}
                          </Text>
                        </View>
                      ))}

                      <Text className="text-medium text-gray-600 font-semibold mb-2 mt-3 pl-3">
                        Did you guide the student to improve the performance in
                        the next class? کیا آپ ے بچے کو اگی کلس میں کارکدگی بہتر
                        بانے کے لیئے ترغیب دی؟
                      </Text>
                      <Text
                        className="mr-2 mb-4 pl-5 text-medium"
                        onPress={() =>
                          setFormData({
                            ...formData,
                            guide_student_improve: "yes",
                          })
                        }
                      >
                        Yes جی ہں
                      </Text>
                    </View>
                  )}

                  {/* If excellent */}
                  {formData.lesson_progress === "excellent" && (
                    <View className="mt-4">
                      <Text className="text-medium text-gray-600 font-semibold mb-2 mt-3 pl-3">
                        Did you praised the student for the excellent
                        performance so that he/she can give the same performance
                        in the next class? یا آپ ے سبق اچھا سانے پ بچے کو شابشی
                        عنایت فرائی ت کہ وہ اگلے دن مید شوق سے پڑھ ک
                      </Text>
                      <Text
                        className={`mr-2 mb-4 pl-5 text-medium ${
                          formData.praise_student === "yes"
                            ? "text-primary font-bold"
                            : "text-gray-600"
                        }`}
                        onPress={() =>
                          setFormData({ ...formData, praise_student: "yes" })
                        }
                      >
                        Yes جی ہاں
                      </Text>
                    </View>
                  )}
                </View>

                <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3 mt-4">
                  Monthly Project
                </Text>
                <View>
                  {monthlyProjectOptions.map((option) => (
                    <View
                      key={option.value}
                      className="flex-row items-center mb-2"
                    >
                      <Text
                        className={`mr-2 mb-4 pl-5 text-medium ${
                          formData.monthly_project === option.value
                            ? "text-primary font-bold"
                            : "text-gray-600"
                        }`}
                        onPress={() =>
                          setFormData({
                            ...formData,
                            monthly_project: option.value,
                          })
                        }
                      >
                        {option.label}
                      </Text>
                    </View>
                  ))}
                </View>

                <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3 ">
                  Monthly Project Special Instructions
                </Text>
                <TextInput
                  className="text-medium py-1 text-gray-600 font-normal mb-2 pl-3 border border-primary-75 rounded-md"
                  style={{ height: 100 }}
                  onChangeText={(text) =>
                    setFormData({ ...formData, monthly_project_ins: text })
                  }
                  value={formData.monthly_project_ins}
                  multiline
                />
              </>
            )}

            {formData.attendance === "2" && (
              <View className="mt-4">
                <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                  Did you get permission from GM sb. for leave? کیا آپ نے GM
                  صاحب سے چھٹی کی اجازت لی؟
                </Text>
                <View>
                  <Text
                    className={`mr-2 mb-4 pl-5 text-medium ${
                      formData.permission_from_gm_teacher_leave === "yes"
                        ? "text-primary font-bold"
                        : "text-gray-600"
                    }`}
                    onPress={() =>
                      setFormData({
                        ...formData,
                        permission_from_gm_teacher_leave: "yes",
                      })
                    }
                  >
                    Yes جی ہاں
                  </Text>
                </View>

                {/* Reasons for Leave */}
                <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                  Please choose the reason for leave براہ کرم چھٹی کی وجہ کا
                  انتخاب کیجیئے۔
                </Text>
                {leaveReasonsOptions.map((option) => (
                  <View
                    key={option.value}
                    className="flex-row items-center mb-2"
                  >
                    <Text
                      className={`mr-2 mb-1 pl-5 text-medium ${
                        formData.leave_reason === option.value
                          ? "text-primary font-bold"
                          : "text-gray-600"
                      }`}
                      onPress={() =>
                        setFormData({ ...formData, leave_reason: option.value })
                      }
                    >
                      - {option.label}
                    </Text>
                  </View>
                ))}

                {/* If the leave reason is other emergency */}
                {formData.leave_reason === "other_emergency" && (
                  <TextInput
                    className="text-medium py-1 text-gray-600 font-normal mb-2 pl-3 border border-primary-75 rounded-md"
                    placeholder="Enter emergency reason"
                    onChangeText={(text) =>
                      setFormData({ ...formData, emergency_reason: text })
                    }
                    value={formData.emergency_reason}
                  />
                )}

                {/* Additional Question for Travel Reason */}
                {formData.leave_reason === "travel" && (
                  <View className="mt-4">
                    <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                      Did you contact GM sb to check your new location's
                      connection and background noise?
                    </Text>
                    {travelReasonOptions.map((option) => (
                      <View
                        key={option.value}
                        className="flex-row items-center mb-4 pl-5"
                      >
                        <Text
                          className={`mr-2 text-medium ${
                            formData.contacted_gm_for_location === option.value
                              ? "text-primary font-bold"
                              : "text-gray-600"
                          }`}
                          onPress={() =>
                            setFormData({
                              ...formData,
                              contacted_gm_for_location: option.value,
                            })
                          }
                        >
                          {option.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Inform WhatsApp group */}
                <View className="mt-4">
                  <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                    Did you Inform WhatsApp group for leave?
                  </Text>
                  <Text
                    className={`mr-2 text-medium pl-5 ${
                      formData.inform_whatsapp_group_for_leave === "yes"
                        ? "text-primary font-bold"
                        : "text-gray-600"
                    }`}
                    onPress={() =>
                      setFormData({
                        ...formData,
                        inform_whatsapp_group_for_leave: "yes",
                      })
                    }
                  >
                    Yes جی ہاں
                  </Text>
                </View>

                {/* Notice Form */}
                <View className="mt-6">
                  <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                    براہ کرم نوٹ فرما لیجیۓ یہ کلاس بروز ہفتہ لی جائے گی۔
                  </Text>
                  {noticeFormOptions.map((option) => (
                    <View
                      key={option.value}
                      className="flex-row items-center mb-2"
                    >
                      <Text
                        className={`mr-2 text-medium pl-5 ${
                          formData.notice_form_noted === option.value
                            ? "text-primary font-bold"
                            : "text-gray-600"
                        }`}
                        onPress={() =>
                          setFormData({
                            ...formData,
                            notice_form_noted: option.value,
                          })
                        }
                      >
                        {option.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Absent by Teacher */}
            {formData.attendance === "0" && (
              <View className="mt-4">
                <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                  Did you Inform GM sb. and WhatsApp group about absence?
                </Text>
                <View>
                  <Text
                    className={`mr-2 pl-5 text-medium ${
                      formData.permission_from_gm_teacher_leave === "yes"
                        ? "text-primary font-bold"
                        : "text-gray-600"
                    }`}
                    onPress={() =>
                      setFormData({
                        ...formData,
                        permission_from_gm_teacher_leave: "yes",
                      })
                    }
                  >
                    Yes جی ہاں
                  </Text>
                </View>

                {/* Reasons for Absence */}
                <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3 mt-4">
                  Please choose the reason for absence براہ کرم غیرحاضری کی وجہ
                  کا انتخاب کیجیئے۔
                </Text>
                {leaveReasonsOptions.map((option) => (
                  <View
                    key={option.value}
                    className="flex-row items-center mb-2 pl-5"
                  >
                    <Text
                      className={`mr-2 text-medium ${
                        formData.leave_reason === option.value
                          ? "text-primary font-bold"
                          : "text-gray-600"
                      }`}
                      onPress={() =>
                        setFormData({ ...formData, leave_reason: option.value })
                      }
                    >
                      - {option.label}
                    </Text>
                  </View>
                ))}

                {/* If the absence reason is other emergency */}
                {formData.leave_reason === "other_emergency" && (
                  <TextInput
                    className="text-medium py-1 text-gray-600 font-normal mb-2 pl-3 border border-primary-75 rounded-md"
                    placeholder="Enter emergency reason"
                    onChangeText={(text) =>
                      setFormData({ ...formData, emergency_reason: text })
                    }
                    value={formData.emergency_reason}
                  />
                )}
              </View>
            )}

            {formData.attendance == "5" && (
              <View className="mt-4">
                {/* Leave by Student */}
                <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                  Please choose one: براہ کرم ایک انتخاب کریں۔
                </Text>
                {leaveTimesOptions.map((option) => (
                  <View
                    key={option.value}
                    className="flex-row items-center mb-2"
                  >
                    <Text
                      className={`mr-2 pl-5 text-medium ${
                        formData.leave_times === option.value
                          ? "text-primary font-bold"
                          : "text-gray-600"
                      }`}
                      onPress={() =>
                        setFormData({ ...formData, leave_times: option.value })
                      }
                    >
                      {option.label}
                    </Text>
                  </View>
                ))}

                {/* Contact GM Group */}
                {formData.leave_times === "more_than_2" && (
                  <View className="mt-4">
                    <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                      Did you inform your GM group about more than 2 leaves?
                    </Text>
                    {informedOptions.map((option) => (
                      <View
                        key={option.value}
                        className="flex-row items-center mb-2 pl-5"
                      >
                        <Text
                          className={`mr-2 text-medium ${
                            formData.informed_gm === option.value
                              ? "text-primary font-bold"
                              : "text-gray-600"
                          }`}
                          onPress={() =>
                            setFormData({
                              ...formData,
                              informed_gm: option.value,
                            })
                          }
                        >
                          {option.label}
                        </Text>
                      </View>
                    ))}
                    <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                      Did you inform the WhatsApp incharge about the student's
                      leave?
                    </Text>
                    {informedOptions.map((option) => (
                      <View
                        key={option.value}
                        className="flex-row items-center mb-2 pl-5"
                      >
                        <Text
                          className={`mr-2 text-medium ${
                            formData.informed_whatsapp === option.value
                              ? "text-primary font-bold"
                              : "text-gray-600"
                          }`}
                          onPress={() =>
                            setFormData({
                              ...formData,
                              informed_whatsapp: option.value,
                            })
                          }
                        >
                          {option.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Leave Reason for Student */}
                <View className="mt-4">
                  <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                    Please choose the reason for leave:
                  </Text>
                  {leaveReasonStudentOptions.map((option) => (
                    <View
                      key={option.value}
                      className="flex-row items-center mb-2"
                    >
                      <Text
                        className={`mr-2 text-medium pl-5 ${
                          formData.leave_reason_student === option.value
                            ? "text-primary font-bold"
                            : "text-gray-600"
                        }`}
                        onPress={() =>
                          setFormData({
                            ...formData,
                            leave_reason_student: option.value,
                          })
                        }
                      >
                        - {option.label}
                      </Text>
                    </View>
                  ))}

                  {formData.leave_reason_student === "emergency" && (
                    <TextInput
                      className="text-medium py-1 text-gray-600 font-normal mb-2 pl-3 border border-primary-75 rounded-md"
                      placeholder="Enter emergency reason"
                      onChangeText={(text) =>
                        setFormData({
                          ...formData,
                          emergency_reason_student: text,
                        })
                      }
                      value={formData.emergency_reason_student}
                    />
                  )}
                </View>

                {/* Notice Form */}
                <View className="mt-4">
                  <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                    Encourage your child to avoid leaves during the week due to
                    its impact.
                  </Text>
                  <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                    Ensure the student makes up for the leave by attending extra
                    classes.
                  </Text>
                  <View className="flex-row items-center mt-2">
                    <Text
                      className={`mr-2 text-medium ${
                        formData.notice_form_noted === "noted"
                          ? "text-primary font-bold"
                          : "text-gray-600"
                      }`}
                      onPress={() =>
                        setFormData({ ...formData, notice_form_noted: "noted" })
                      }
                    >
                      Noted
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Absent by Student */}
            {formData.attendance == "1" && (
              <View className="mt-4">
                <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                  Please choose one for absent times:
                </Text>
                {absentTimesOptions.map((option) => (
                  <View
                    key={option.value}
                    className="flex-row items-center mb-2 pl-5"
                  >
                    <Text
                      className={`mr-2 text-medium ${
                        formData.absent_times === option.value
                          ? "text-primary font-bold"
                          : "text-gray-600"
                      }`}
                      onPress={() =>
                        setFormData({ ...formData, absent_times: option.value })
                      }
                    >
                      - {option.label}
                    </Text>
                  </View>
                ))}

                {/* Contact GM Group */}
                {formData.absent_times === "more_than_2" && (
                  <View className="mt-4">
                    <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                      Did you inform your GM group about more than 2 absents?
                    </Text>
                    {informedOptions.map((option) => (
                      <View
                        key={option.value}
                        className="flex-row items-center mb-2 pl-5"
                      >
                        <Text
                          className={`mr-2 text-medium ${
                            formData.informed_gm === option.value
                              ? "text-primary font-bold"
                              : "text-gray-600"
                          }`}
                          onPress={() =>
                            setFormData({
                              ...formData,
                              informed_gm: option.value,
                            })
                          }
                        >
                          {option.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Notice Form */}
                <View className="mt-4">
                  <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                    Please ensure the student attends make-up classes.
                  </Text>
                  <View className="flex-row items-center mt-2">
                    <Text
                      className={`mr-2 text-medium pl-5 ${
                        formData.notice_form_noted === "noted"
                          ? "text-primary font-bold"
                          : "text-gray-600"
                      }`}
                      onPress={() =>
                        setFormData({ ...formData, notice_form_noted: "noted" })
                      }
                    >
                      Noted
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {formData.attendance == "3" && (
                <View >
                  {/* Test Done Question */}
                  <View className="mt-4">
                    <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                      Was Test Done Today? کیا آج ٹیسٹ ہوا؟
                    </Text>
                    <View className="flex-row items-center mb-4 pl-5 space-x-4">
                      <TouchableOpacity
                        onPress={() =>
                          setFormData({ ...formData, was_test_done: "yes" })
                        }
                      >
                        <Text
                          className={`mr-2 text-medium ${
                            formData.was_test_done === "yes"
                              ? "text-primary font-bold"
                              : "text-gray-600"
                          }`}
                        >
                          Yes
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          setFormData({ ...formData, was_test_done: "no" })
                        }
                      >
                        <Text
                          className={`text-medium ${
                            formData.was_test_done === "no"
                              ? "text-primary font-bold"
                              : "text-gray-600"
                          }`}
                        >
                          No
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Conditional rendering: If "No" is selected */}
                  {formData.was_test_done === "no" && (
                    <View className="mt-4">
                      <Text className="text-medium text-gray-600 font-semibold mb-2 pl-3">
                        Please choose the reason for no test براہ کرم ٹیسٹ نہ
                        ہونے کی وجہ کا انتخاب کریں۔
                      </Text>
                      {testNotReasonOptions.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          onPress={() =>
                            setFormData({
                              ...formData,
                              testNotReason: option.value,
                            })
                          }
                        >
                          <View className="flex-row items-center mb-2 pl-5">
                            <Text
                              className={`mr-2 text-medium ${
                                formData.testNotReason === option.value
                                  ? "text-primary font-bold"
                                  : "text-gray-600"
                              }`}
                            >
                              {option.label}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}

                    </View>
                  )}
                </View>
            )}

            {/* Action Buttons */}
            <View className="flex-row justify-end mt-4">
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

export default AttendenceForm;
