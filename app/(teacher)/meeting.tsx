import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface JitsiWebViewProps {
  roomName: string;
  userName: string;
}

const JitsiWebView: React.FC<JitsiWebViewProps> = ({ roomName, userName }) => {
  const jitsiURL = `https://meet.jit.si/${roomName}`;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: `${jitsiURL}#userInfo.displayName="${userName}"` }}
        style={styles.webview}
        javaScriptEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default JitsiWebView;
