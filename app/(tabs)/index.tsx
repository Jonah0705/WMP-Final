import React, { useState } from "react";
import { StyleSheet, Button, Alert, TextInput } from "react-native";
import { Text, View } from "@/components/Themed";
import { auth } from "@/config/firebase";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

export default function TabOneScreen() {
  const [studentID, setStudentID] = useState("");
  const [totalCredits, setTotalCredits] = useState(0);
  const [maxCredits, setMaxCredits] = useState(0);
  const [newMaxCredits, setNewMaxCredits] = useState("");
  const router = useRouter();
  const db = getFirestore();

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        const user = auth.currentUser;
      
        if (user) {
          const userDocRef = doc(db, "students", user.uid);
          const docSnap = await getDoc(userDocRef);
      
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setStudentID(userData.studentID || "Unknown");
            setTotalCredits(userData.totalCredits || 0);
            setMaxCredits(userData.maxCredits || 24); 
            
            if (!userData.maxCredits) {
              await updateDoc(userDocRef, { maxCredits: 24 });
            }
          } else {
            Alert.alert("Error", "User data not found.");
          }
        }
      };
      
      fetchUserData();
      return () => {};
    }, [auth, db])
  );

  const handleUpdateMaxCredits = async () => {
    const newMaxCreditsValue = parseInt(newMaxCredits, 10);

    if (isNaN(newMaxCreditsValue) || newMaxCreditsValue <= 0) {
      Alert.alert("Error", "Please enter a valid number greater than zero.");
      return;
    }

    if (newMaxCreditsValue < totalCredits) {
      Alert.alert(
        "Error",
        "Maximum credits cannot be less than the credits you are currently taking."
      );
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "students", user.uid);
        await updateDoc(userDocRef, { maxCredits: newMaxCreditsValue });
        setMaxCredits(newMaxCreditsValue);
        setNewMaxCredits("");
        Alert.alert("Success", "Maximum credits updated successfully!");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Dashboard</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.info}>Student ID: {studentID}</Text>
      <Text style={styles.info}>Total Credits Taken: {totalCredits}</Text>
      <Text style={styles.info}>Maximum Credits: {maxCredits}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.title}>Update Maximum Credits </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new maximum credits"
        value={newMaxCredits}
        onChangeText={setNewMaxCredits}
        keyboardType="numeric"
      />
      <Button title="Update Maximum Credits" onPress={handleUpdateMaxCredits} />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: "80%",
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: "80%",
  },
});
