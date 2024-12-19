import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { auth } from "@/config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { router } from "expo-router";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentID, setStudentID] = useState("");

  const db = getFirestore();

  const handleRegister = async () => {
    if (!/^\d+$/.test(studentID)) {
      Alert.alert("Error", "Student ID must be numeric only.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
      await setDoc(doc(db, "students", user.uid), {
        email,
        studentID,
      });

      Alert.alert("Success", "Registration Complete!");
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Student Enrollment Register
      </Text>
      <View style={{ width: "100%" }}>
        <Text>Email:</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
        />
        <Text>Password:</Text>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
        />
        <Text>Student ID:</Text>
        <TextInput
          placeholder="Student ID (Numbers only)"
          value={studentID}
          onChangeText={setStudentID}
          keyboardType="numeric"
          style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
        />
        <Button title="Register" onPress={handleRegister} />
      </View>
    </View>
  );
}
