import { Button, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, ScrollView } from 'react-native';

import * as ImagePicker from "expo-image-picker";

import { useAuth } from '@/context/auth';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import axios from 'axios';
import AppButton from '@/components/Button';
import NotificationBanner, { NotificationBannerRef } from '@/components/NotificationBanner';

export default function TabOneScreen() {
  const {signOut, user} = useAuth();
  const router = useRouter()

  const notificationBannerRef = useRef<NotificationBannerRef>(null);
  const showBanner = (message:string, type: "success" | "error") => { 
    notificationBannerRef.current?.handleShowBanner(message, type);
  }

  const [fname, SetFname] = useState("");
  const [lname, SetLname] = useState("");
  const [email, SetEmail] = useState("");

  const [CurrentPassword, SetCurrentPassword] = useState("");
  const [password, SetPassword] = useState("");
  const [rePassword, SetRePassword] = useState("");
  const [img, SetImg] = useState("")
  const [image, setImage] = useState<null | { uri: string }>(null);
  const [profileLoading, SetProfileLoading] = useState(false);
  const [passwordLoading, SetPasswordLoading] = useState(false);


  const updateProfile = async () => {
    SetProfileLoading(true);
    try {
      const formData = new FormData();
      formData.append("first_name", fname);
      formData.append("last_name", lname);
      formData.append("email", email);
  
      if (image) {
        const fileName = image.uri.split("/").pop();
        const fileType = fileName?.split(".").pop();
  
        formData.append("user_image", {
          uri: image.uri,
          name: fileName,
          type: `image/${fileType}`,
        } as any);
      }

      console.log(formData)
  
      const response = await axios.post(`http://lms.knowledgequran.info/teacher/profile_app/update/${user.user_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Profile updated:", response.data);
      showBanner("Profile updated", "success");

      GetInfo();
    } catch (error) {
      showBanner(`Failed: ${error}`, "error");
      console.error("Error updating profile:", error);
    }
    finally {
      SetProfileLoading(false)
    }
  };

  
  const updatePassword = async () => {

    if (!password)
    {
      showBanner("Password required", "error")
      return
    }

    if (password != rePassword)
    {
      showBanner("Passwords do not Match.", "error")
      return
    }
    SetPasswordLoading(true);

    try {
      const formData = new FormData();
      formData.append("current_password", CurrentPassword);
      formData.append("new_password", password);
      formData.append("confirm_password", rePassword);

  
      const response = await axios.post(`http://lms.knowledgequran.info/teacher/profile_app/password/${user.user_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Profile updated:", response.data);
      showBanner("Profile updated", "success");

      GetInfo();
    } catch (error) {
      console.error("Error updating profile:", error);
      showBanner(`Failed: ${error}`, "error");

    }
    finally {
      SetPasswordLoading(false)
    }
  }

  const GetInfo = async () => {
    try {
      const response = await axios.get(`http://lms.knowledgequran.info/teacher/profile_app/${user.user_id}`);
  
      if (response.data.status === "success") {
        const userInfo = response.data.data.userInfo[0];
        SetFname(userInfo.first_name); 
        SetLname(userInfo.last_name); 
        SetEmail(userInfo.email);
        SetImg(response.data.data.img)
        return;
      } else {
        throw new Error('Network Error.');
      }
  
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'An error occurred while fetching.');
      } else {
        throw new Error('An unknown error occurred.');
      }
    }
  };
  

  useEffect(() => {
    GetInfo()
  }, [user])

  
  if (user === null)
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
  
  return (
    <ScrollView className='px-2 bg-white h-full w-full flex flex-1'>
      <NotificationBanner
        ref= {notificationBannerRef}
        message=''
        type='success'
      />
      <View className="rounded-lg border-2 border-gray-200 flex items-center w-full pt-[10px] shadow-lg">
        <View className='w-5/6'>
          <Text className="text-btn_title text-gray-600 mb-2 pl-3">First Name</Text>
          <TextInput 
            className="h-12 bg-l-grey mb-4 px-2 rounded-xl text-btn_title border-gray-500 focus:border-2 focus:shadow-md "
            value={fname}
            onChangeText={SetFname}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        <View className='w-5/6'>
          <Text className="text-btn_title text-gray-600 mb-2 pl-3">Last Name</Text>
          <TextInput 
            className="h-12 bg-l-grey mb-4 px-2 rounded-xl text-btn_title border-gray-500 focus:border-2 focus:shadow-md "
            value={lname}
            onChangeText={SetLname}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        <View className='w-5/6'>
          <Text className="text-btn_title text-gray-600 mb-2 pl-3">Email</Text>
          <TextInput
            className={`h-12 bg-l-grey px-2 rounded-xl text-btn_title border-gray-500 focus:border-2 focus:shadow-md mb-2`}
            value={email}
            onChangeText={SetEmail}
          />
        </View>

        <View className='flex flex-row items-center justify-between w-full px-8'>
          <View className='p-4'>
            {
              image? 
              <Image
                className='w-20 h-20 rounded-full'
                source={{ uri: image.uri }}
                resizeMode="cover" 
              />
              :
              img &&
              <Image
                className='w-20 h-20 rounded-full'
                source={{ uri: img }}
                resizeMode="cover" 
              />
            }
          </View>
          <View>
            <TouchableOpacity
              onPress={pickImage}
              className="bg-primary p-2 mr-2 rounded mb-4"
            >
              <Text className="text-center text-btn_title font-semibold text-white px-4">Upload</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <AppButton
          title="Update Profile"
          onPress={updateProfile}
          class_Name='mb-4 bg-primary w-[70%]'
          textClassName='font-semibold'
          Loading= {profileLoading}
        />
      </View>

      <View className="rounded-lg border-2 border-gray-200 flex items-center w-full pt-[10px] shadow-lg">
        <View className='w-5/6'>
          <Text className="text-btn_title text-gray-600 mb-2 pl-3">Current Password</Text>
          <TextInput 
            className="h-12 bg-l-grey mb-4 px-2 rounded-xl text-btn_title border-gray-500 focus:border-2 focus:shadow-md "
            value={CurrentPassword}
            onChangeText={SetCurrentPassword}
            autoCapitalize="none"
            secureTextEntry
          />
        </View>
        <View className='w-5/6'>
          <Text className="text-btn_title text-gray-600 mb-2 pl-3">New Password</Text>
          <TextInput 
            className="h-12 bg-l-grey mb-4 px-2 rounded-xl text-btn_title border-gray-500 focus:border-2 focus:shadow-md "
            value={password}
            onChangeText={SetPassword}
            autoCapitalize="none"
            secureTextEntry
          />
        </View>
        <View className='w-5/6'>
          <Text className="text-btn_title text-gray-600 mb-2 pl-3">Confirm Password</Text>
          <TextInput 
            className="h-12 bg-l-grey mb-4 px-2 rounded-xl text-btn_title border-gray-500 focus:border-2 focus:shadow-md "
            value={rePassword}
            onChangeText={SetRePassword}
            autoCapitalize="none"
            secureTextEntry
          />
        </View>
        <AppButton
          title="Update Password"
          onPress={updatePassword}
          class_Name='mb-4 bg-primary w-[70%]'
          textClassName='font-semibold'
          Loading= {passwordLoading}
        />
      </View>
    </ScrollView>

  );
}
