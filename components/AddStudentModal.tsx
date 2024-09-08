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
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import AppButton from "@/components/Button";
import { useApp } from "@/context/app";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import NotificationBanner, { NotificationBannerRef } from "./NotificationBanner";

interface AddStudentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (studentData: FormData) => Promise<void>;
  title: string;
}

interface ImageData {
  uri: string;
  name: string;
  type: string;
  blob: Blob;
}

interface StudentFormData {
  student_code: string;
  student_name: string;
  gender: string;
  father_name: string;
  father_number: string;
  email: string;
  password: string;
  dob: string;
  language: string;
  site: string;
  status: string;
  timezone: string;
  cst: string;
  cet: string;
  enroll_date: string;
  country: string;
  teacher_code: string;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({
  visible,
  onClose,
  onSubmit,
  title,
}) => {

  const timezones = [
    "Africa/Abidjan",
    "Africa/Accra",
    "Africa/Addis_Ababa",
    "Africa/Algiers",
    "Africa/Asmara",
    "Africa/Bamako",
    "Africa/Bangui",
    "Africa/Banjul",
    "Africa/Bissau",
    "Africa/Blantyre",
    "Africa/Brazzaville",
    "Africa/Bujumbura",
    "Africa/Cairo",
    "Africa/Casablanca",
    "Africa/Ceuta",
    "Africa/Conakry",
    "Africa/Dakar",
    "Africa/Dar_es_Salaam",
    "Africa/Djibouti",
    "Africa/Douala",
    "Africa/El_Aaiun",
    "Africa/Freetown",
    "Africa/Gaborone",
    "Africa/Harare",
    "Africa/Johannesburg",
    "Africa/Juba",
    "Africa/Kampala",
    "Africa/Khartoum",
    "Africa/Kigali",
    "Africa/Kinshasa",
    "Africa/Lagos",
    "Africa/Libreville",
    "Africa/Lome",
    "Africa/Luanda",
    "Africa/Lubumbashi",
    "Africa/Lusaka",
    "Africa/Malabo",
    "Africa/Maputo",
    "Africa/Maseru",
    "Africa/Mbabane",
    "Africa/Mogadishu",
    "Africa/Monrovia",
    "Africa/Nairobi",
    "Africa/Ndjamena",
    "Africa/Niamey",
    "Africa/Nouakchott",
    "Africa/Ouagadougou",
    "Africa/Porto-Novo",
    "Africa/Sao_Tome",
    "Africa/Tripoli",
    "Africa/Tunis",
    "Africa/Windhoek",
    "America/Adak",
    "America/Anchorage",
    "America/Anguilla",
    "America/Antigua",
    "America/Araguaina",
    "America/Argentina/Buenos_Aires",
    "America/Argentina/Catamarca",
    "America/Argentina/Cordoba",
    "America/Argentina/Jujuy",
    "America/Argentina/La_Rioja",
    "America/Argentina/Mendoza",
    "America/Argentina/Rio_Gallegos",
    "America/Argentina/Salta",
    "America/Argentina/San_Juan",
    "America/Argentina/San_Luis",
    "America/Argentina/Tucuman",
    "America/Argentina/Ushuaia",
    "America/Aruba",
    "America/Asuncion",
    "America/Atikokan",
    "America/Bahia",
    "America/Bahia_Banderas",
    "America/Barbados",
    "America/Belem",
    "America/Belize",
    "America/Blanc-Sablon",
    "America/Boa_Vista",
    "America/Bogota",
    "America/Boise",
    "America/Cambridge_Bay",
    "America/Campo_Grande",
    "America/Cancun",
    "America/Caracas",
    "America/Cayenne",
    "America/Cayman",
    "America/Chicago",
    "America/Chihuahua",
    "America/Ciudad_Juarez",
    "America/Costa_Rica",
    "America/Creston",
    "America/Cuiaba",
    "America/Curacao",
    "America/Danmarkshavn",
    "America/Dawson",
    "America/Dawson_Creek",
    "America/Denver",
    "America/Detroit",
    "America/Dominica",
    "America/Edmonton",
    "America/Eirunepe",
    "America/El_Salvador",
    "America/Fort_Nelson",
    "America/Fortaleza",
    "America/Glace_Bay",
    "America/Goose_Bay",
    "America/Grand_Turk",
    "America/Grenada",
    "America/Guadeloupe",
    "America/Guatemala",
    "America/Guayaquil",
    "America/Guyana",
    "America/Halifax",
    "America/Havana",
    "America/Hermosillo",
    "America/Indiana/Indianapolis",
    "America/Indiana/Knox",
    "America/Indiana/Marengo",
    "America/Indiana/Petersburg",
    "America/Indiana/Tell_City",
    "America/Indiana/Vevay",
    "America/Indiana/Vincennes",
    "America/Indiana/Winamac",
    "America/Inuvik",
    "America/Iqaluit",
    "America/Jamaica",
    "America/Juneau",
    "America/Kentucky/Louisville",
    "America/Kentucky/Monticello",
    "America/Kralendijk",
    "America/La_Paz",
    "America/Lima",
    "America/Los_Angeles",
    "America/Lower_Princes",
    "America/Maceio",
    "America/Managua",
    "America/Manaus",
    "America/Marigot",
    "America/Martinique",
    "America/Matamoros",
    "America/Mazatlan",
    "America/Menominee",
    "America/Merida",
    "America/Metlakatla",
    "America/Mexico_City",
    "America/Miquelon",
    "America/Moncton",
    "America/Monterrey",
    "America/Montevideo",
    "America/Montserrat",
    "America/Nassau",
    "America/New_York",
    "America/Nome",
    "America/Noronha",
    "America/North_Dakota/Beulah",
    "America/North_Dakota/Center",
    "America/North_Dakota/New_Salem",
    "America/Nuuk",
    "America/Ojinaga",
    "America/Panama",
    "America/Paramaribo",
    "America/Phoenix",
    "America/Port-au-Prince",
    "America/Port_of_Spain",
    "America/Porto_Velho",
    "America/Puerto_Rico",
    "America/Punta_Arenas",
    "America/Rankin_Inlet",
    "America/Recife",
    "America/Regina",
    "America/Resolute",
    "America/Rio_Branco",
    "America/Santarem",
    "America/Santiago",
    "America/Santo_Domingo",
    "America/Sao_Paulo",
    "America/Scoresbysund",
    "America/Sitka",
    "America/St_Barthelemy",
    "America/St_Johns",
    "America/St_Kitts",
    "America/St_Lucia",
    "America/St_Thomas",
    "America/St_Vincent",
    "America/Swift_Current",
    "America/Tegucigalpa",
    "America/Thule",
    "America/Tijuana",
    "America/Toronto",
    "America/Tortola",
    "America/Vancouver",
    "America/Whitehorse",
    "America/Winnipeg",
    "America/Yakutat",
    "Antarctica/Casey",
    "Antarctica/Davis",
    "Antarctica/DumontDUrville",
    "Antarctica/Macquarie",
    "Antarctica/Mawson",
    "Antarctica/McMurdo",
    "Antarctica/Palmer",
    "Antarctica/Rothera",
    "Antarctica/Syowa",
    "Antarctica/Troll",
    "Antarctica/Vostok",
    "Arctic/Longyearbyen",
    "Asia/Aden",
    "Asia/Almaty",
    "Asia/Amman",
    "Asia/Anadyr",
    "Asia/Aqtau",
    "Asia/Aqtobe",
    "Asia/Ashgabat",
    "Asia/Atyrau",
    "Asia/Baghdad",
    "Asia/Bahrain",
    "Asia/Baku",
    "Asia/Bangkok",
    "Asia/Barnaul",
    "Asia/Beirut",
    "Asia/Bishkek",
    "Asia/Brunei",
    "Asia/Chita",
    "Asia/Choibalsan",
    "Asia/Colombo",
    "Asia/Damascus",
    "Asia/Dhaka",
    "Asia/Dili",
    "Asia/Dubai",
    "Asia/Dushanbe",
    "Asia/Famagusta",
    "Asia/Gaza",
    "Asia/Hebron",
    "Asia/Ho_Chi_Minh",
    "Asia/Hong_Kong",
    "Asia/Hovd",
    "Asia/Irkutsk",
    "Asia/Jakarta",
    "Asia/Jayapura",
    "Asia/Jerusalem",
    "Asia/Kabul",
    "Asia/Kamchatka",
    "Asia/Karachi",
    "Asia/Kathmandu",
    "Asia/Khandyga",
    "Asia/Kolkata",
    "Asia/Krasnoyarsk",
    "Asia/Kuala_Lumpur",
    "Asia/Kuching",
    "Asia/Kuwait",
    "Asia/Macau",
    "Asia/Magadan",
    "Asia/Makassar",
    "Asia/Manila",
    "Asia/Muscat",
    "Asia/Nicosia",
    "Asia/Novokuznetsk",
    "Asia/Novosibirsk",
    "Asia/Omsk",
    "Asia/Oral",
    "Asia/Phnom_Penh",
    "Asia/Pontianak",
    "Asia/Pyongyang",
    "Asia/Qatar",
    "Asia/Qostanay",
    "Asia/Qyzylorda",
    "Asia/Riyadh",
    "Asia/Sakhalin",
    "Asia/Samarkand",
    "Asia/Seoul",
    "Asia/Shanghai",
    "Asia/Singapore",
    "Asia/Srednekolymsk",
    "Asia/Taipei",
    "Asia/Tashkent",
    "Asia/Tbilisi",
    "Asia/Tehran",
    "Asia/Thimphu",
    "Asia/Tokyo",
    "Asia/Tomsk",
    "Asia/Ulaanbaatar",
    "Asia/Urumqi",
    "Asia/Ust-Nera",
    "Asia/Vientiane",
    "Asia/Vladivostok",
    "Asia/Yakutsk",
    "Asia/Yangon",
    "Asia/Yekaterinburg",
    "Asia/Yerevan",
    "Atlantic/Azores",
    "Atlantic/Bermuda",
    "Atlantic/Canary",
    "Atlantic/Cape_Verde",
    "Atlantic/Faroe",
    "Atlantic/Madeira",
    "Atlantic/Reykjavik",
    "Atlantic/South_Georgia",
    "Atlantic/St_Helena",
    "Atlantic/Stanley",
    "Australia/Adelaide",
    "Australia/Brisbane",
    "Australia/Broken_Hill",
    "Australia/Darwin",
    "Australia/Eucla",
    "Australia/Hobart",
    "Australia/Lindeman",
    "Australia/Lord_Howe",
    "Australia/Melbourne",
    "Australia/Perth",
    "Australia/Sydney",
    "Europe/Amsterdam",
    "Europe/Andorra",
    "Europe/Astrakhan",
    "Europe/Athens",
    "Europe/Belgrade",
    "Europe/Berlin",
    "Europe/Bratislava",
    "Europe/Brussels",
    "Europe/Bucharest",
    "Europe/Budapest",
    "Europe/Busingen",
    "Europe/Chisinau",
    "Europe/Copenhagen",
    "Europe/Dublin",
    "Europe/Gibraltar",
    "Europe/Guernsey",
    "Europe/Helsinki",
    "Europe/Isle_of_Man",
    "Europe/Istanbul",
    "Europe/Jersey",
    "Europe/Kaliningrad",
    "Europe/Kirov",
    "Europe/Kyiv",
    "Europe/Lisbon",
    "Europe/Ljubljana",
    "Europe/London",
    "Europe/Luxembourg",
    "Europe/Madrid",
    "Europe/Malta",
    "Europe/Mariehamn",
    "Europe/Minsk",
    "Europe/Monaco",
    "Europe/Moscow",
    "Europe/Oslo",
    "Europe/Paris",
    "Europe/Podgorica",
    "Europe/Prague",
    "Europe/Riga",
    "Europe/Rome",
    "Europe/Samara",
    "Europe/San_Marino",
    "Europe/Sarajevo",
    "Europe/Saratov",
    "Europe/Simferopol",
    "Europe/Skopje",
    "Europe/Sofia",
    "Europe/Stockholm",
    "Europe/Tallinn",
    "Europe/Tirane",
    "Europe/Ulyanovsk",
    "Europe/Vaduz",
    "Europe/Vatican",
    "Europe/Vienna",
    "Europe/Vilnius",
    "Europe/Volgograd",
    "Europe/Warsaw",
    "Europe/Zagreb",
    "Europe/Zurich",
    "Indian/Antananarivo",
    "Indian/Chagos",
    "Indian/Christmas",
    "Indian/Cocos",
    "Indian/Comoro",
    "Indian/Kerguelen",
    "Indian/Mahe",
    "Indian/Maldives",
    "Indian/Mauritius",
    "Indian/Mayotte",
    "Indian/Reunion",
    "Pacific/Apia",
    "Pacific/Auckland",
    "Pacific/Bougainville",
    "Pacific/Chatham",
    "Pacific/Chuuk",
    "Pacific/Easter",
    "Pacific/Efate",
    "Pacific/Fakaofo",
    "Pacific/Fiji",
    "Pacific/Funafuti",
    "Pacific/Galapagos",
    "Pacific/Gambier",
    "Pacific/Guadalcanal",
    "Pacific/Guam",
    "Pacific/Honolulu",
    "Pacific/Kanton",
    "Pacific/Kiritimati",
    "Pacific/Kosrae",
    "Pacific/Kwajalein",
    "Pacific/Majuro",
    "Pacific/Marquesas",
    "Pacific/Midway",
    "Pacific/Nauru",
    "Pacific/Niue",
    "Pacific/Norfolk",
    "Pacific/Noumea",
    "Pacific/Pago_Pago",
    "Pacific/Palau",
    "Pacific/Pitcairn",
    "Pacific/Pohnpei",
    "Pacific/Port_Moresby",
    "Pacific/Rarotonga",
    "Pacific/Saipan",
    "Pacific/Tahiti",
    "Pacific/Tarawa",
    "Pacific/Tongatapu",
    "Pacific/Wake",
    "Pacific/Wallis"
  ];

  const {teachers} = useApp()

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isEnrollmentDatePickerVisible, setEnrollmentDatePickerVisibility] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);

  const [image, setImage] = useState<null | { uri: string }>(null);

    // notification
  const notificationBannerRef = useRef<NotificationBannerRef>(null)
  const showBanner = (message: string, type: "success"|"error") => {
    notificationBannerRef.current?.handleShowBanner(message, type);
  }


  const [formData, setFormData] = useState<StudentFormData>({
    student_code: "",
    student_name: "",
    gender: "male",
    father_name: "",
    father_number: "",
    email: "",
    password: "",
    dob: "",
    cst: "",
    cet: "",
    enroll_date: "",
    country: "",
    language: "English",
    site: "1",
    status: "1",
    teacher_code: "",
    timezone: "Africa/Abidjan",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDateConfirm = (date : Date) => {
    const formattedDate = date.toISOString().split('T')[0];

    handleInputChange("dob", formattedDate);
    setDatePickerVisibility(false);
  };

  const handleEnrollmentDateConfirm = (date : Date) => {
    const formattedDate = date.toISOString().split('T')[0];

    handleInputChange("enroll_date", formattedDate);
    setEnrollmentDatePickerVisibility(false);
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

  const handleStartTimeConfirm = (time: Date) => {
    // Format the time as HH:mm:ss 
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    handleInputChange("cst", formattedTime);
    setStartTimePickerVisibility(false);
  };

  const handleEndTimeConfirm = (time: Date) => {
    // Format the time as HH:mm:ss 
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    handleInputChange("cet", formattedTime);
    setEndTimePickerVisibility(false);
  };



  const handleSubmit = async () => {
    const requiredFields = [
      "student_code",
      "student_name",
      "gender",
      "father_name",
      "father_number",
      "email",
      "password",
      "dob",
      "cst",
      "cet",
      "enroll_date",
      "country",
      "teacher_code"
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
      <NotificationBanner ref={notificationBannerRef} message="" type="success"/>
      <View className="flex-1 justify-center items-center py-20 px-6 backdrop-blur-lg bg-primary-20/70 ">
        <View className="bg-white w-full rounded-lg border-2 border-primary justify-center">
          <Text className="text-heading font-bold mt-4 self-center">
            {title}
          </Text>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Student Code
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.student_code}
                onChangeText={(text) => handleInputChange("student_code", text)}
              />
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Student Name
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.student_name}
                onChangeText={(text) => handleInputChange("student_name", text)}
              />
            </View>

            <View className="w-full flex flex-row justify-between">
              <View className="w-[49%]">
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

              <View className="w-[49%]">
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
            </View>
            
            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Father's/Mother's Name
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.father_name}
                onChangeText={(text) => handleInputChange("father_name", text)}
              />
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Father's Number
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.father_number}
                onChangeText={(text) =>
                  handleInputChange("father_number", text)
                }
                keyboardType="phone-pad"
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
              />
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Teacher
              </Text>
              <View className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md">
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

            <View className="w-full flex flex-row justify-between">
              <View className="w-[49%]">
                <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                  Start Time
                </Text>

                <TouchableOpacity onPress={() => {setStartTimePickerVisibility(true)}}>
                  <TextInput
                    className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                    value={formData.cst}
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

              <View className="w-[49%]">
                <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                  End Time
                </Text>

                <TouchableOpacity onPress={() => {setEndTimePickerVisibility(true)}}>
                  <TextInput
                    className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                    value={formData.cet}
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
            </View>

            <View className="w-full flex flex-row justify-between">
              <View className="w-[49%]">
                <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                  Enroll Date
                </Text>
                <TouchableOpacity onPress={() => {setEnrollmentDatePickerVisibility(true)}}>
                    <TextInput
                      className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                      value={formData.enroll_date}
                      editable={false}
                      pointerEvents="none"
                    />
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isEnrollmentDatePickerVisible}
                    mode="date"
                    onConfirm={handleEnrollmentDateConfirm}
                    onCancel={() => {setEnrollmentDatePickerVisibility(false)}}
                  />
              </View>

              <View className="w-[49%]">
                <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                  Language
                </Text>
                
                <View className="h-12 bg-primary-10 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md" >
                  <Picker
                    selectedValue={formData.language}
                    onValueChange={(itemValue) =>
                      handleInputChange("language", itemValue)
                    }
                  >
                    <Picker.Item label="Urdu" value="Urdu" />
                    <Picker.Item label="English" value="English" />
                    <Picker.Item label="Arabic" value="Arabic" />
                    <Picker.Item label="Farsi" value="Farsi" />
                    <Picker.Item label="Pashto" value="Pashto" />
                    <Picker.Item label="Other" value="Other" />
                  </Picker>
                </View>

              </View>
             
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Country
              </Text>
              <TextInput
                className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md"
                value={formData.country}
                onChangeText={(text) => handleInputChange("country", text)}
              />
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Online/Onsite
              </Text>
              <View className="h-12 bg-primary-10 mb-4 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md" >
                <Picker
                  selectedValue={formData.site}
                  onValueChange={(itemValue) =>
                    handleInputChange("site", itemValue)
                  }
                >
                  <Picker.Item label="Online" value="1" />
                  <Picker.Item label="Onsite" value="0" />

                </Picker>
              </View>
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Status
              </Text>
              
              <View className="h-12 bg-primary-10 mb-4 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md" >
                <Picker
                  selectedValue={formData.status}
                  onValueChange={(itemValue) =>
                    handleInputChange("status", itemValue)
                  }
                >
                  <Picker.Item label="Enabled" value="1" />
                  <Picker.Item label="Disabled" value="0" />

                </Picker>
              </View>              
            </View>

            <View className="w-full">
              <Text className="text-btn_title text-gray-600 font-semibold mb-2 pl-3">
                Timezone
              </Text>
             
              <View className="h-12 bg-primary-10 mb-4 px-2 rounded-xl text-btn_title border-primary-25 focus:border-2 focus:shadow-md">
                <Picker
                    selectedValue={formData.timezone}
                    onValueChange={(itemValue) =>
                      handleInputChange("timezone", itemValue)
                    }
                  >
                    {timezones.map((timezone) => (
                      <Picker.Item key={timezone} label={timezone} value={timezone} />
                    ))}
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

export default AddStudentModal;
