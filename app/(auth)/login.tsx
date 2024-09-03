import React, { useState } from 'react';
import { Button, StyleSheet, TextInput } from 'react-native';
import "@/global.css";
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/context/auth';
import AppButton from '@/components/Button';

export default function TabOneScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    // if (email.trim() === '') {
    //   setError('Email is required');
    //   return;
    // }
    // else if (password.trim() === '') {
    //   setError('Password is required');
    //   return;
    // }
    // else
    // {
    //   setError('');
    // }

    setLoading(true);
    try {
      await signIn("admin@kqc.com", "123");
      // await signIn(email, password);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setError(errorMessage);
      setEmail("");
      setPassword("")
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className='flex flex-1 bg-primary'>
      <View className='h-[30%] bg-primary'>

      </View>
      <View className="flex  items-center h-[70%] w-full pt-[20px] rounded-tr-[200px] shadow-lg">
        <Text className="text-heading font-bold text-black mb-2">Login</Text>
        <Text className="text-small font-light font-sans text-gray-600 mb-8">Sign In to Continue.</Text>

        <View className='w-3/4'>
          <Text className="text-btn_title text-gray-600 mb-2 pl-3">Email</Text>
          <TextInput 
            className="h-12 bg-l-grey mb-4 px-2 rounded-xl text-btn_title border-gray-500 focus:border-2 focus:shadow-md "
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        <View className='w-3/4'>
          <Text className="text-btn_title text-gray-600 mb-2 pl-3">Password</Text>
          <TextInput
            className={`h-12 bg-l-grey px-2 rounded-xl text-btn_title border-gray-500 focus:border-2 focus:shadow-md ${error === "" ? "mb-6" : "mb-2"}`}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {error != "" && 
          <View className='w-3/4'>
            <Text className="text-btn_title text-red-500 mb-3 pl-3">{error}</Text>
          </View>        
        }
        <AppButton
          title="Sign In"
          onPress={handleSignIn}
          class_Name='w-3/5 '
          textClassName=''
          Loading= {loading}
        />
      </View>
    </View>
  );

}