import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { auth } from "@/config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, query, where, getDocs, collection } from "firebase/firestore";
import { router } from "expo-router";

export default function Login() {
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");

  const db = getFirestore();

  const handleLogin = async () => {
    try {
      if (loginInput.includes("@")) {
        await signInWithEmailAndPassword(auth, loginInput, password);
      } else {
        const studentQuery = query(
          collection(db, "students"),
          where("studentID", "==", loginInput)
        );
        const querySnapshot = await getDocs(studentQuery);

        if (querySnapshot.empty) {
          Alert.alert("Error", "Student ID not found.");
          return;
        }

        const studentData = querySnapshot.docs[0].data();
        await signInWithEmailAndPassword(auth, studentData.email, password);
      }

      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Student Enrollment Login
      </Text>
      <View style={{ width: "100%" }}>
        <Text>Email or Student ID:</Text>
        <TextInput
          placeholder="Email or Student ID"
          value={loginInput}
          onChangeText={setLoginInput}
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
        <Button title="Login" onPress={handleLogin} />
        <Text style={{ marginTop: 20 }}>Don't have an account?</Text>
        <Button title="Register Here" onPress={() => router.push("/register")} />
      </View>
    </View>
  );
}
