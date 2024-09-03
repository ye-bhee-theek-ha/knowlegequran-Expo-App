import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, Animated } from 'react-native';
import { styled } from 'nativewind';

interface NotificationBannerProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
  }

const NotificationBanner: React.FC<NotificationBannerProps> = ({ message, type, onClose }) => {
  const [opacity] = useState(new Animated.Value(1));

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => onClose());
    }, 5000); // Automatically disappear after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose, opacity]);

  // Conditional className based on type
  const bannerStyle = type === 'success' ? 'bg-green-100 border-primary border-2 text-green-700' : 'bg-red-100 border-red-200 text-red-700';

  return (
    <Animated.View style={{ opacity }} className={`flex-row w-fit justify-between p-3 rounded-md absolute top-5 right-2 z-50 border ${bannerStyle}`}>
      <Text className="text-base mr-4">{message}</Text>
      <TouchableOpacity onPress={onClose}>
        <Text className="text-lg font-bold">×</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default styled(NotificationBanner);
