import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Text, TouchableOpacity, Animated } from 'react-native';
import { styled } from 'nativewind';

interface NotificationBannerProps {
  message: string;
  type: 'success' | 'error';
}

export interface NotificationBannerRef {
  handleShowBanner: (message: string, type: 'success' | 'error') => void;
}

const NotificationBanner = forwardRef<NotificationBannerRef, NotificationBannerProps>((props, ref) => {
  const [opacity] = useState(new Animated.Value(0));
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState(props.message);
  const [bannerType, setBannerType] = useState(props.type);

  useImperativeHandle(ref, () => ({
    handleShowBanner(message: string, type: 'success' | 'error') {
      setBannerMessage(message);
      setBannerType(type);
      opacity.setValue(0);
      setShowBanner(true);

      // Fade in
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        const timer = setTimeout(() => {
          // Fade out after 5 seconds
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => setShowBanner(false));
        }, 5000);

        return () => clearTimeout(timer);
      });
    },
  }));

  const handleCloseBanner = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setShowBanner(false));
  };

  const bannerStyle = bannerType === 'success' ? 'bg-green-100 border-primary border-2 text-green-700' : 'bg-red-100 border-red-200 text-red-700';

  if (!showBanner) return null;

  return (
    <Animated.View style={{ opacity }} className={`flex-row w-fit justify-between p-3 rounded-md absolute top-5 right-2 z-50 border ${bannerStyle}`}>
      <Text className="text-base mr-4">{bannerMessage}</Text>
      <TouchableOpacity onPress={handleCloseBanner}>
        <Text className="text-lg font-bold">×</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default styled(NotificationBanner);
