import { MaterialCommunityIcons } from "@expo/vector-icons";

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { firebase } from '../firebaseConfig';
import { Video } from 'expo-av';
import { useLayoutEffect } from "react";

export default function CountingNumbers({ navigation }) {
  const [header, setHeader] = useState("Kids Progress");

  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const video = React.useRef(null);
  const secondVideo = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [statusSecondVideo, setStatusSecondVideo] = React.useState({});
  useLayoutEffect(() => {
    navigation.setOptions({
      title: header,
      headerStyle: {
        backgroundColor: "#4F1964",
      },
      headerTintColor: "white",
      headerRight: () => (
        <TouchableOpacity onPress={() => openMenu()}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={28}
            color="white"
            style={{ marginRight: 15 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  useEffect(() => {
    const processDoneRef = firebase.database().ref('processDone');
    const countResultRef = firebase.database().ref('countResult');
    const conTextRef = firebase.database().ref('conText');

    const onProcessDoneChange = async (snapshot) => {
      const processDone = snapshot.val();
      console.log("Process Done changed:", processDone);
      if (processDone) {
        try {
          const countResultSnapshot = await countResultRef.once('value');
          const countResult = countResultSnapshot.val();
          console.log("Count Result:", countResult);

          if (countResult === true) {
            Alert.alert("Success", "Processing was successful");
          } else if (countResult === false) {
            Alert.alert("Unsuccessful", "Try again..!");
          }


          const conTextSnapshot = await conTextRef.once('value');
          const conText = conTextSnapshot.val();
          console.log("Con Text:", conText);
          if (conText) {
            Alert.alert("Your recording is ", conText);
            console.log(conText);
          }


          await firebase.database().ref().update({ processDone: false, countResult: null });
        } catch (error) {
          console.error("Error fetching process results:", error);
        }
      }
    };

    processDoneRef.on('value', onProcessDoneChange);

    return () => {
      processDoneRef.off('value', onProcessDoneChange);
    };
  }, []);

  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });

        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await recording.startAsync();
        setRecording(recording);
        Alert.alert("Recording started");
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;

    setRecording(undefined);

    try {
      await recording.stopAndUnloadAsync();
      const { status } = await recording.createNewLoadedSoundAsync();


      const uri = recording.getURI();
      const newUri = FileSystem.cacheDirectory + 'recording.3gp';
      await FileSystem.moveAsync({ from: uri, to: newUri });


      try {
        const response = await fetch(newUri);
        const blob = await response.blob();


        const mimeType = 'audio/3gp';
        const file = new File([blob], 'Recording.3gp', { type: mimeType });

        const storageRef = firebase.storage().ref();
        const audioRef = storageRef.child('recordings/Recording.3gp');
        await audioRef.put(file);
        Alert.alert("Recording uploaded to Firebase");


        firebase.database().ref('recordings').push({
          duration: getDurationFormatted(status.durationMillis),
          file: newUri,
        });


        const newRecordingRef = firebase.database().ref('newRecording');
        await newRecordingRef.set(true);


        // setTimeout(async () => {
        //   await newRecordingRef.remove();
        //   console.log('newRecording node removed');
        // }, 5000);

      } catch (error) {
        console.error('Error uploading recording to Firebase:', error);
        Alert.alert("Failed to upload recording to Firebase");
      }

      setRecordings([...recordings, { duration: getDurationFormatted(status.durationMillis), file: newUri }]);
      Alert.alert("Recording stopped");
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  }

  function getDurationFormatted(milliseconds) {
    const minutes = Math.floor(milliseconds / 1000 / 60);
    const seconds = Math.round((milliseconds / 1000) % 60);
    return seconds < 10 ? `${minutes}:0${seconds}` : `${minutes}:${seconds}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => (
      <View key={index} style={styles.row}>
        <Text style={styles.fill}>
          Recording #{index + 1} | {recordingLine.duration}
        </Text>
        <TouchableOpacity style={styles.playButton} onPress={() => playRecording(recordingLine.file)}>
          <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>
      </View>
    ));
  }

  async function playRecording(fileUri) {
    try {
      console.log('Playing recording from URI:', fileUri);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      const { sound } = await Audio.Sound.createAsync({ uri: fileUri });
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to play the recording', error);
    }
  }

  function clearRecordings() {
    setRecordings([]);
    Alert.alert("All recordings cleared");
  }

  return (
    <View style={styles.container}>


       
      <Video
        ref={video}
        style={styles.video}
        source={require('./../images/video/videoclip.mp4')}
        useNativeControls
        resizeMode="contain"
        isLooping
        onPlaybackStatusUpdate={setStatus}
      />

      <TouchableOpacity style={styles.recordButton} onPress={recording ? stopRecording : startRecording}>
        <Text style={styles.buttonText}>{recording ? 'Stop Recording' : 'Start Recording'}</Text>
      </TouchableOpacity>
      <ScrollView style={styles.recordingsContainer}>
        {getRecordingLines()}
      </ScrollView>
      {recordings.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearRecordings}>
          <Text style={styles.buttonText}>Clear Recordings</Text>
        </TouchableOpacity>
      )}
    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  recordButton: {
    marginTop: 150,
    backgroundColor: '#4F1964',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  clearButton: {
    backgroundColor: '#4F1964',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  recordingsContainer: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  fill: {
    flex: 1,
    marginLeft: 10,
  },
  playButton: {
    backgroundColor: '#4F1964',
    padding: 10,
    borderRadius: 5,
  },
  Text: {
    marginTop: 50,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4F1964',
  },
  video: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  headerContainer: {
    paddingVertical: 10,
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4F1964",
  },

});