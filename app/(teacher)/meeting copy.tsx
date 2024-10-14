import React, { useState, useEffect } from "react";
import { Button, SafeAreaView, View, StyleSheet, Text, ScrollView } from "react-native";
import {
  mediaDevices,
  MediaStream,
  RTCView,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
} from "react-native-webrtc";
import { db } from "@/firebaseConfig";
import { addDoc, arrayUnion, collection, doc, onSnapshot, setDoc, updateDoc, getDoc, getDocs, deleteDoc, DocumentReference } from "firebase/firestore";
import { useLocalSearchParams } from "expo-router";

const App = () => {

  const { TeacherID, StudentID, StudentName } = useLocalSearchParams();
  
  const teacherID = Array.isArray(TeacherID) ? TeacherID[0] : TeacherID;
  const studentID = Array.isArray(StudentID) ? StudentID[0] : StudentID;
  const studentName = Array.isArray(StudentName) ? StudentName[0] : StudentName;

  const roomCode = `${teacherID}_${studentID}_${studentName}`;

  const [localStream, setLocalStream] = useState<MediaStream | null | undefined>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [remoteDescriptionSet, setRemoteDescriptionSet] = useState(false);

  const [remoteCandidates, setRemoteCandidates] = useState<any[]>([]);

  const processCandidates = () => {
    if (peerConnection?.remoteDescription) {
      if (remoteCandidates.length < 1) return;

      remoteCandidates.forEach(candidate => {
        peerConnection?.addIceCandidate(candidate)
          .catch(error => console.error("Error adding queued ICE candidate:", error));
      });
      setRemoteCandidates([]);
    }
  };



  const mediaConstraints = {
    audio: true,
    video: { frameRate: 30, facingMode: 'user' },
  };

  const configuration = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };
  

  // Initialize media devices and local stream
  const startLocalStream = async (): Promise<MediaStream | undefined> => {
    try {
      const stream = await mediaDevices.getUserMedia(mediaConstraints);
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error("Error getting local stream:", error);
    }
  };

  // Create peer connection with local stream and handle ICE candidates
  const initializePeerConnection = async (): Promise<RTCPeerConnection | null> => {

    let stream = localStream;

    if (!stream) {
      console.log("Starting local stream...");
      stream = await startLocalStream();  // Wait for the stream to initialize and use it directly
    }

    if (!stream) {
      console.error("Failed to get local stream.");
      return null;
    }
    
    try {
      const pc = new RTCPeerConnection(configuration);

      const dataChannel = pc.createDataChannel("myDataChannel");
  
      // Use addEventListener to handle the onopen event
      dataChannel.addEventListener('open', () => {
        console.log("Data channel is open");
      });
  
      // Handle the message event
      dataChannel.addEventListener('message', (event) => {
          console.log("Received message: ", event.data);
      });
  
      stream.getTracks().forEach((track) => {
        console.log(`Adding track: ${track.kind}, id: ${track.id}`);
        pc.addTrack(track, stream);
      });
      
      setPeerConnection(pc);
  
      registerPeerConnectionListeners();
  
      return pc;
      
    } catch (error) {
      console.error("Error initializing PeerConnection:", error);
      return null;
    }
  };

  // Create a room and handle SDP offer/answer
  const createRoom = async () => {
    console.log("CREATING ROOM")
    if (!localStream) await startLocalStream();

    const pc = await initializePeerConnection();

    if (!pc) {
      stopMediaStream();
      console.log("join room, no peer connection after initialization")
      return;
    }

    pc.addEventListener( 'connectionstatechange', event => {
      switch( pc.connectionState ) {
        case 'closed':
          stopMediaStream();
          return;
      };
    } );

    pc.addEventListener( 'signalingstatechange', event => {
      switch( pc.signalingState ) {
        case 'closed':
          // You can handle the call being disconnected here.
    
          break;
      };
    } );
    
    const roomRef = doc(collection(db, "rooms"), roomCode);
            
    // Handle ICE candidates for the caller
    const callerCandidatesCollection = collection(roomRef, 'callerCandidates');

    pc.addEventListener('icecandidate', async event => {
      if (!event.candidate) {
        console.log('Got final candidate!');
        return;
      }
      console.log('Got candidate: ', event.candidate);
      await addDoc(callerCandidatesCollection, { candidate: event.candidate.toJSON() });
    });

    pc.addEventListener( 'iceconnectionstatechange', event => {
      switch( pc.iceConnectionState ) {
        case 'connected':
        case 'completed':
          // You can handle the call being connected here.
          // Like setting the video streams to visible.
          console.log("call connected!!!!!!!!! create call side..")
          break;
      };
    } );   

    pc.addEventListener( 'negotiationneeded', event => {
      // You can start the offer stages here.
      // Be careful as this event can be called multiple times.
    } );

    const sessionConstraints = {
      mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true,
        VoiceActivityDetection: true,
      },
    };

    const offer = await pc.createOffer(sessionConstraints);
    await pc.setLocalDescription(offer);
    await setDoc(roomRef, {
      offer: {
        type: offer.type,
        sdp: offer.sdp,
      },
    });

    console.log(`Room created with ID: ${roomCode}`);
    
    // Handle receiving remote track and updating remoteStream
    pc.addEventListener('track', event => {
      console.log('Got remote track:', event.streams[0]);
    
      // Create a new MediaStream object if remoteStream is not initialized
      if (!remoteStream) {
        const newRemoteStream = new MediaStream();
        event.streams[0].getTracks().forEach(track => {
          console.log('Add a track to the new remoteStream:', track);
          newRemoteStream.addTrack(track);
        });
        setRemoteStream(newRemoteStream); // Update state with the new MediaStream
      } else {
        // If remoteStream is already there, add tracks to it
        const updatedRemoteStream = new MediaStream(remoteStream);
        event.streams[0].getTracks().forEach(track => {
          console.log('Add a track to the updated remoteStream:', track);
          updatedRemoteStream.addTrack(track);
        });
        setRemoteStream(updatedRemoteStream); // Update state with the updated MediaStream
      }
    });


    // Listen for remote ICE candidates
    const calleeCandidatesCollection = collection(roomRef, 'calleeCandidates');
    onSnapshot(calleeCandidatesCollection, snapshot => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {

          const data = change.doc.data();
          const candidate = new RTCIceCandidate(data);

          if (pc.remoteDescription == null)
          {
            return remoteCandidates.push( candidate );
          }

          console.log(`Got new remote ICE candidate callee: ${JSON.stringify(data)}`);

          await pc.addIceCandidate(candidate);
        }
      });
    });

    // Listen for remote answer
    onSnapshot(roomRef, async (snapshot) => {
      const data = snapshot.data();
      await processCandidates();

      if (data?.answer && !remoteDescriptionSet) {
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        try {
          await pc.setRemoteDescription(rtcSessionDescription);
          setRemoteDescriptionSet(true);
          console.log('Got remote description: ');
          
        } catch (error) {
          console.error('Error setting remote description:', error);
        }
      }
    });


    listenForRoomDeletion(roomRef);

  };

  const joinRoom = async () => {
    console.log("JOINING ROOM")

    if (!localStream) await startLocalStream();
    const roomRef = doc(collection(db, "rooms"), roomCode);
    const roomSnapshot = await getDoc(roomRef);

    if (roomSnapshot.exists()) {
      const pc = await initializePeerConnection();
      const offer = roomSnapshot.data()?.offer;
      
      if (!pc) {
        console.log("join room, no peer connection after initialization")
        stopMediaStream();
        return;
      }

      pc.addEventListener( 'connectionstatechange', event => {
        switch( pc.connectionState ) {
          case 'closed':
            stopMediaStream();
            return;
        };
      } );

      pc.addEventListener( 'signalingstatechange', event => {
        switch( pc.signalingState ) {
          case 'closed':
            // You can handle the call being disconnected here.
      
            break;
        };
      } );

      // Code for collecting ICE candidates (callee side)
      const calleeCandidatesCollection = collection(roomRef, "calleeCandidates");
      pc.addEventListener('icecandidate', async event => {
        if (!event.candidate) {
          console.log('Got final candidate!');
          return;
        }
        console.log('Got candidate: ', event.candidate);
        await addDoc(calleeCandidatesCollection, event.candidate.toJSON());
      });

      pc.addEventListener( 'iceconnectionstatechange', event => {
        switch( pc.iceConnectionState ) {
          case 'connected':
          case 'completed':
            // You can handle the call being connected here.
            // Like setting the video streams to visible.
            console.log("call connected!!!!!!!!! join call side..")
            break;
        };
      } );   

      pc.addEventListener( 'negotiationneeded', event => {
        // You can start the offer stages here.
        // Be careful as this event can be called multiple times.
      } );


      // Handle receiving remote track and updating remoteStream
      pc.addEventListener('track', event => {
        console.log('Got remote track:', event.streams[0]);
        
        const newRemoteStream = new MediaStream();
        event.streams[0].getTracks().forEach(track => {
          console.log('Add a track to the new remoteStream:', track);
          newRemoteStream.addTrack(track);
        });
        setRemoteStream(newRemoteStream);  // Set the remote stream in state
      });


      if (offer) {
        console.log('Got offer:', offer);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
  
        const answer = await pc.createAnswer();
        console.log('Created answer:');
        await pc.setLocalDescription(answer);
        
        processCandidates();

        // Update room document with the answer
        const roomWithAnswer = {
          answer: {
            type: answer.type,
            sdp: answer.sdp,
          },
        };
        await updateDoc(roomRef, roomWithAnswer);
      }

      // Listening for remote ICE candidates
      const callerCandidatesCollection = collection(roomRef, 'callerCandidates');
      onSnapshot(callerCandidatesCollection, snapshot => {
        snapshot.docChanges().forEach(async change => {
          if (change.type === 'added') {
            const data = change.doc.data();
            const Candidate = new RTCIceCandidate(data)

            if ( pc.remoteDescription == null ) {
              return remoteCandidates.push( Candidate );
            };

            console.log(`Got new remote ICE candidate caller: ${JSON.stringify(data)}`);
            await pc.addIceCandidate(Candidate);
          }
        });
      });

      listenForRoomDeletion(roomRef);
    }
  };

  const deleteRoom = async (): Promise<void> => {
    const roomRef = doc(db, "rooms", roomCode);
    console.log("deleting rooms")
    try {
      // Delete callee candidates
      const calleeCandidatesSnapshot = await getDocs(collection(roomRef, "calleeCandidates"));
      await Promise.all(
        calleeCandidatesSnapshot.docs.map(async (candidateDoc) => {
          await deleteDoc(candidateDoc.ref);
        })
      );

      // Delete caller candidates
      const callerCandidatesSnapshot = await getDocs(collection(roomRef, "callerCandidates"));
      await Promise.all(
        callerCandidatesSnapshot.docs.map(async (candidateDoc) => {
          await deleteDoc(candidateDoc.ref);
        })
      );

      // Finally, delete the room and candidate collections
      await deleteDoc(roomRef);
      console.log("Room deleted from Firestore.");
    } catch (error) {
      console.error("Error deleting room and candidates:", error);
    }
  };

  const listenForRoomDeletion = (roomRef: DocumentReference) => {
    onSnapshot(roomRef, (snapshot) => {
      if (!snapshot.exists()) {
        console.log("Room was deleted. Stopping the meeting.");
        stopMediaStream();
      }
    });
  };
  
  // Stop local media stream and close peer connection
  const stopMediaStream = () => {
    console.trace("media stream stopped")
    localStream?.getTracks().forEach((track) => track.stop());
    peerConnection?.close();
    setLocalStream(null);
    setPeerConnection(null);
    setRemoteStream(null);
    deleteRoom();
  };

  function registerPeerConnectionListeners() {
    peerConnection?.addEventListener('icegatheringstatechange', () => {
      console.warn(
          `ICE gathering state changed: ${peerConnection.iceGatheringState}`);
    });
  
    peerConnection?.addEventListener('connectionstatechange', () => {
      console.warn(`Connection state change: ${peerConnection.connectionState}`);
    });
  
    peerConnection?.addEventListener('signalingstatechange', () => {
      console.warn(`Signaling state change: ${peerConnection.signalingState}`);
    });
  
    peerConnection?.addEventListener('iceconnectionstatechange ', () => {
      console.warn(
          `ICE connection state change: ${peerConnection.iceConnectionState}`);
    });
  }
  
  return (
    <SafeAreaView style={{ flex: 1 }}>

      <View style={styles.buttonContainer}>
        <Button title="Create Room" onPress={createRoom} />
        <Button title="Join Room" onPress={joinRoom} />
        <Button title="Stop" onPress={stopMediaStream} />
      </View>

      {localStream && <RTCView streamURL={localStream.toURL()} style={styles.stream} mirror={true} />}
      {remoteStream && <RTCView streamURL={remoteStream?.toURL()} style={styles.stream} />}
      {remoteStream && <Text>remote desc set</Text>}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  stream: { width: '100%', height: '50%' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 20 },
});

export default App;
