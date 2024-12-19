import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, Alert, StyleSheet } from "react-native";
import { SUBJECTS } from "@/utils/subjects";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

export default function SelectSubject() {
  const [selectedSubjects, setSelectedSubjects] = useState<any[]>([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [maxCredits, setMaxCredits] = useState(24);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "students", user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setSelectedSubjects(userData.selectedSubjects || []);
          setTotalCredits(userData.totalCredits || 0);
          setMaxCredits(userData.maxCredits || 24); 
        }
      }
    };
    fetchData();
  }, [auth, db]);
  

  const toggleSubject = async (subject: any) => {
    let updatedSubjects;
    let updatedCredits;

    if (selectedSubjects.includes(subject.id)) {
      updatedSubjects = selectedSubjects.filter((id) => id !== subject.id);
      updatedCredits = totalCredits - subject.credits;
    } else {
      if (totalCredits + subject.credits > maxCredits) {
        Alert.alert("Error", "Credit limit exceeded!");
        return;
      }
      updatedSubjects = [...selectedSubjects, subject.id];
      updatedCredits = totalCredits + subject.credits;
    }

    setSelectedSubjects(updatedSubjects);
    setTotalCredits(updatedCredits);

    // Save data to Firebase
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "students", user.uid);
      await setDoc(
        userDocRef,
        { selectedSubjects: updatedSubjects, totalCredits: updatedCredits },
        { merge: true }
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Subjects (Max: {maxCredits} Credits)</Text>
      <FlatList
        data={SUBJECTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.subjectItem}>
            <Text>{item.name} ({item.credits} credits)</Text>
            <Button
              title={selectedSubjects.includes(item.id) ? "Remove" : "Add"}
              onPress={() => toggleSubject(item)}
            />
          </View>
        )}
      />
      <Text style={styles.totalCredits}>Total Credits: {totalCredits}</Text>
      <Button
        title="View Summary"
        onPress={() =>
          router.push({
            pathname: "/summary",
            params: { selectedSubjects: JSON.stringify(selectedSubjects) },
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  subjectItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  totalCredits: {
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 16,
  },
});
