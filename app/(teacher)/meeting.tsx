import React, { useState, useEffect, useRef } from "react";
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
import { addDoc, arrayUnion, collection, doc, onSnapshot, setDoc, updateDoc, getDoc, getDocs, deleteDoc, DocumentReference, query } from "firebase/firestore";
import { useLocalSearchParams } from "expo-router";

const peerConstraints = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

const App = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [gettingCall, setGettingCall] = useState(false);

  const connecting = useRef(false);

  let pc = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const cRef = doc(db, "meet", "chatId");
    const subscribe = onSnapshot(cRef, (snapshot) => {
      const data = snapshot.data();

      // On answer start the call
      if (pc.current && !pc.current.remoteDescription && data && data.answer) {
        pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      }

      // if there is offer for chatId set the getting call flag
      if (data && data.offer && !connecting.current) {
        setGettingCall(true);
      }
    });

    // On Delete of collection call hangup
    // The other side has clicked on hangup
    const qdelete = query(collection(cRef, "callee"));
    const subscribeDelete = onSnapshot(qdelete, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type == "removed") {
          hangup();
        }
      });
    });
    return () => {
      subscribe();
      subscribeDelete();
    };
  }, []);

  async function setupWebrtc() {
    pc.current = new RTCPeerConnection(peerConstraints);

    const dataChannel = pc.current.createDataChannel("myDataChannel");

    // Use addEventListener to handle the onopen event
    dataChannel.addEventListener('open', () => {
      console.log("Data channel is open");
    });

    // Handle the message event
    dataChannel.addEventListener('message', (event) => {
        console.log("Received message: ", event.data);
    });

    
    // Get the audio and video stream for the call
    const stream = await getStream();

    if (stream) {
      setLocalStream(stream);
    
      // Add all the tracks from the stream to the peer connection
      stream.getTracks().forEach(track => {
        pc.current?.addTrack(track, stream);
      });
    }
    
    // Get the remote stream once it is available
    pc.current.addEventListener('track', (event) => {
      // Check if remote stream already exists or create a new one
      console.log("GOt Remote track")
      const [remoteStream] = event.streams;
      if (remoteStream) {
        setRemoteStream(remoteStream);
      } else {
        const newRemoteStream = new MediaStream();
        event.streams[0].getTracks().forEach(track => newRemoteStream.addTrack(track));
        setRemoteStream(newRemoteStream);
      }
    });  
  }


  async function create() {
    console.log("calling");
    connecting.current = true;

    // setUp webrtc
    await setupWebrtc();

    // Document for the call
    const cRef = doc(db, "meet", "chatId");
    // await setDoc(cRef, {});

    // Exchange the ICE candidates between the caller and callee
    collectIceCandidates(cRef, "caller", "callee");

    if (pc.current) {
      // Create the offer for the call
      // Store the offer under the document
      console.log("create");

      pc.current.addEventListener( 'iceconnectionstatechange', event => {
        switch( pc.current?.iceConnectionState ) {
          case 'connected':
          case 'completed':
            // You can handle the call being connected here.
            // Like setting the video streams to visible.
            console.log("call connected!!!!!!!!! create call side..")
            break;
        };
      } );   

      pc.current.addEventListener('iceconnectionstatechange', event => {
        console.log("ICE Connection State:", pc.current?.iceConnectionState);
        if (pc.current?.iceConnectionState === 'failed') {
          console.error("ICE connection failed");
        }
      });

      pc.current.addEventListener('signalingstatechange', event => {
        console.log("Signaling State [create call side]:", pc.current?.signalingState);
      });

      try {
        let sessionConstraints = {
          mandatory: {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true,
          },
        };
        const offerDescription = await pc.current.createOffer(
          sessionConstraints
        );
        await pc.current.setLocalDescription(offerDescription);

        const cWithOffer = {
          offer: {
            type: offerDescription.type,
            sdp: offerDescription.sdp,
          },
        };

        // cRef.set(cWithOffer)
        await setDoc(cRef, cWithOffer);
      } catch (error) {
        console.log("error", error);
      }
    }
  }


  const join = async () => {
    console.log("Joining the call");
    connecting.current = true;
    setGettingCall(false);

    //const cRef = firestore().collection("meet").doc("chatId")
    const cRef = doc(db, "meet", "chatId");
    // const offer = (await cRef.get()).data()?.offer
    const offer = (await getDoc(cRef)).data()?.offer;

    if (offer) {
      // Setup Webrtc
      await setupWebrtc();

      // Exchange the ICE candidates
      // Check the parameters, Its reversed. Since the joining part is callee
      collectIceCandidates(cRef, "callee", "caller");

      if (pc.current) {
        pc.current.setRemoteDescription(new RTCSessionDescription(offer));

        pc.current.addEventListener( 'iceconnectionstatechange', event => {
          switch( pc.current?.iceConnectionState ) {
            case 'connected':
            case 'completed':
              // You can handle the call being connected here.
              // Like setting the video streams to visible.
              console.log("call connected!!!!!!!!! join call side..")
              break;
          };
        } );   

        pc.current.addEventListener('iceconnectionstatechange', event => {
          console.log("ICE Connection State:", pc.current?.iceConnectionState);
          if (pc.current?.iceConnectionState === 'failed') {
            console.error("ICE connection failed join call side");
          }
        });

        pc.current.addEventListener('signalingstatechange', event => {
          console.log("Signaling State [join call side]:", pc.current?.signalingState);
        });

        // Create the answer for the call
        // Updates the document with answer
        const answer = await pc.current.createAnswer();
        pc.current.setLocalDescription(answer);
        const cWithAnswer = {
          answer: {
            type: answer.type,
            sdp: answer.sdp,
          },
        };
        // cRef.update(cWithAnswer)
        await updateDoc(cRef, cWithAnswer);
      }
    }
  };


  
  //helper functions


  async function getStream() {
    let isVoiceOnly = false;
    let mediaConstraints = {
      audio: true,
      video: {
        frameRate: 30,
        facingMode: "user",
      },
    };
    try {
      const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);

      if (isVoiceOnly) {
        let videoTrack = mediaStream.getVideoTracks()[0];
        videoTrack.enabled = false;
      }

      return mediaStream;
    } catch (err) {
      console.log("err", err);
    }
  }

  async function collectIceCandidates(cRef:any, localName:string, remoteName:string) {
    console.log("localName", localName);
    const candidateCollection = collection(db, "meet", "chatId", localName);

    if (pc.current) {
      // Use addEventListener for onicecandidate to avoid TypeScript errors
      pc.current.addEventListener('icecandidate', (event) => {
        if (event.candidate) {
          console.log("New ICE candidate, adding to Firestore:", event.candidate);
          addDoc(candidateCollection, event.candidate.toJSON())
            .then(() => console.log("Candidate added to Firestore"))
            .catch((error) => console.error("Error adding candidate to Firestore:", error));
        }else {
          console.log("All ICE candidates have been sent", localName);
        }
      });
    }

    // Query to get ICE candidates from Firestore (from the remote peer)
    const q = query(collection(cRef, remoteName));

    // Listen for new ICE candidates added to Firestore by the remote peer and update the local PC
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          const candidate = new RTCIceCandidate(data);

          // Add the remote candidate to the local peer connection
          pc.current?.addIceCandidate(candidate)
            .then(() => console.log("Remote ICE candidate added:", candidate))
            .catch((error) => console.error("Error adding remote ICE candidate:", error));
        }
      });
    });
  };

  async function hangup() {
    console.log("hangup");
    setGettingCall(false);
    connecting.current = false;
    streamCleanUp();
    firebaseCleanUp();
    if (pc.current) {
      pc.current.close();
    }
  }

  async function streamCleanUp() {
    console.log("streamCleanUp");
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      localStream.release();
    }
    setLocalStream(null);
    setRemoteStream(null);
  }

  async function firebaseCleanUp() {
    console.log("firebaseCleanUp");
    const cRef = doc(db, "meet", "chatId");
    if (cRef) {
      const qee = query(collection(cRef, "callee"));
      const calleeCandidate = await getDocs(qee);
      calleeCandidate.forEach(async (candidate) => {
        await deleteDoc(candidate.ref);
      });
      const qer = query(collection(cRef, "caller"));
      const callerCandidate = await getDocs(qer);
      callerCandidate.forEach(async (candidate) => {
        await deleteDoc(candidate.ref);
      });
      deleteDoc(cRef);
    }
  }


  // display functions
    
  // Displays the gettingCall Component
  if (gettingCall) {
    console.log("gettingCall");
    return <View className="w-full h-full bg-green-200">
    <Text>
      getting call
    </Text>

    <Button
      title="answer"
      onPress={join}
    >

    </Button>
    </View>;
  }

 const joinmeet = () => {
  if (gettingCall) {
    join();
  }
  else {
    create();
  }
 }

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <View style={styles.buttonContainer}>
        <Button title="Join" onPress={joinmeet} />
        {localStream || remoteStream? <Button title="Stop" onPress={hangup} />: ""}
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
