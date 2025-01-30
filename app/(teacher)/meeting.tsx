import React, { useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { JitsiMeeting } from '@jitsi/react-native-sdk';
import { router, useLocalSearchParams } from 'expo-router';

const MeetingScreen = () => {

  const { meet_link, Title, StudentName } = useLocalSearchParams();

  const link = Array.isArray(meet_link) ? meet_link[0] : meet_link;
  const title = Array.isArray(Title) ? Title[0] : Title;
  const studentName = Array.isArray(StudentName) ? StudentName[0] : StudentName;

  return (
    <JitsiMeeting
      room={link}
      serverURL={`https://meet.jit.si/ + ${meet_link}`}
      config={{
        hideConferenceTimer: true,
        subject: title,
        startAudioOnly: true,
        readOnlyName: true,
        prejoinPageEnabled: false,
        recordingEnabled: true,

        participantsPane: {
          hideModeratorSettingsTab: true,
          hideMoreActionsButton: true,
          hideMuteAllButton: true
        },

        giphy: {
          enabled: false,
        },

        hideRecordingLabel: true,

        recordings: {
          recordAudioAndVideo: true,
          suggestRecording: false,
          showPrejoinWarning: false,
        }


      }}

      flags={{
        'call-integration.enabled': false, 
        'fullscreen.enabled': false, 
        'invite.enabled': false,
        "calendar.enabled" : false,
        'recording.enabled': true,
      }}

      eventListeners={{
        onConferenceJoined: () => console.log("Student joined the meeting"),
        onConferenceLeft: () => {
          router.back();
          console.warn("left");
        },
        onReadyToClose: () => {
          router.back();
          console.warn("left");
        },
        onVideoMutedChanged: (e: any) => console.log("Video state changed", e),
        onAudioMutedChanged: (e: any) => console.log("Audio state changed", e),
      }}

      userInfo={{
        displayName: studentName,
        avatarURL: "",
        email: ""
      }}

      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MeetingScreen;
