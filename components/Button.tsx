import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import LoadingSpinner from './LoadingSpinner'; // Import the LoadingSpinner component

interface AppButtonProps {
  title: string;
  onPress?: () => void;
  class_Name?: string;
  textClassName?: string;
  Loading?: boolean;
  spinnerSize?: number;
  spinnerColor?: string;
  spinnerStyle?: object;
}

const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  class_Name,
  textClassName,
  Loading = false,
  spinnerSize = 24,
  spinnerColor = "white",
  spinnerStyle = { marginLeft: 8 }
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={Loading}
      className={`bg-black rounded-lg px-4 py-2 flex items-center justify-center flex-row ${class_Name}`}
    >
      <Text className={`text-white text-center text-lg ${textClassName}`}>{title}</Text>
      {Loading && <LoadingSpinner isLoading={Loading} size={spinnerSize} color={spinnerColor} style={spinnerStyle} />}
    </TouchableOpacity>
  );
};

export default AppButton;
