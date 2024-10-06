import React, { useState } from "react";
import {
  Button,
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
} from "react-native";
import { mediaDevices, MediaStream, RTCView } from "react-native-webrtc";

// Define the types for your component's state and props if necessary
const App = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  const start = async () => {
    console.log("start");
    if (!stream) {
      let s: MediaStream;
      try {
        s = await mediaDevices.getUserMedia({ video: true });
        setStream(s);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stop = () => {
    console.log("stop");
    if (stream) {
      stream.release();
      setStream(null);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        {stream && (
          <RTCView
            streamURL={stream.toURL()}
            className="flex-1"
            style={styles.stream} // Applying native styles alongside Tailwind classes if needed
          />
        )}
        <View className="absolute bottom-0 left-0 right-0 p-4 flex-row justify-between bg-white">
          <Button title="Start" onPress={start} />
          <Button title="Stop" onPress={stop} />
        </View>
      </SafeAreaView>
    </>
  );
};

// Optionally use inline styles or a mix of Tailwind and native styles
const styles = StyleSheet.create({
  stream: {
    width: '100%',
    height: '100%',
  },
});

export default App;
