import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SUBJECTS } from "@/utils/subjects";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

export default function Summary() {
  const [selectedData, setSelectedData] = useState<any[]>([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const auth = getAuth();
  const db = getFirestore();

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const user = auth.currentUser;
        let selectedIds: any[] = [];

        if (user) {
          const userDocRef = doc(db, "students", user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            selectedIds = userData.selectedSubjects || [];
            setTotalCredits(userData.totalCredits || 0);
          }
        }
        const selectedData = SUBJECTS.filter((subj) => selectedIds.includes(subj.id));
        setSelectedData(selectedData);
      };

      fetchData();
    }, [auth, db])
  );

  const renderSubject = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.subjectName}>{item.name}</Text>
      <View style={styles.creditsContainer}>
        <Text style={styles.credits}>{item.credits}</Text>
        <Text style={styles.creditsLabel}>credits</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enrollment Summary</Text>
      <FlatList
        data={selectedData}
        keyExtractor={(item) => item.id}
        renderItem={renderSubject}
        contentContainerStyle={styles.list}
      />
      <Text style={styles.totalCredits}>
        Total Credits: {totalCredits}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  creditsContainer: {
    alignItems: "flex-end",
  },
  credits: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  creditsLabel: {
    fontSize: 14,
    color: "#777",
  },
  totalCredits: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});
