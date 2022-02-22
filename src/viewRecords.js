import react, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Alert, Button, Pressable, StyleSheet, Text, View } from "react-native";
import NavigateButton from "./common/navigateBotton";
import Test from "./test";
import { createTables, db } from "./db";
import { ScrollView } from "react-native";
import { useIsFocused } from "@react-navigation/native";

export default function ViewRecords({ navigation }) {
  const [records, setRecords] = useState();

  const isFocused = useIsFocused();

  useEffect(() => {
    readRecords();
  }, [isFocused]);

  const readRecords = () => {
    createTables();
    const resultRecords = [];
    try {
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM Records", [], (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              resultRecords.push(results.rows.item(i));
            }
            setRecords(resultRecords);
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onPressDelete = (categoryId) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM Records WHERE CategoryId='" + categoryId + "' ",
          [],
          (tx, results) => {
            if (results.rows.length > 0) {
              Alert.alert("Warning!", "Can't delete category contains records");
            } else {
              try {
                db.transaction((tx) => {
                  tx.executeSql(
                    "DELETE FROM Categories WHERE ID='" + categoryId + "'",
                    []
                  );
                });
                readCategories();
              } catch (error) {
                console.log(error);
              }
            }
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.column}>
          <Text style={styles.title}>Type</Text>
          {records &&
            records.map((record) => {
              return (
                <Text
                  style={
                    record.Type === "income" ? styles.income : styles.expense
                  }
                >
                  {record.Type.toUpperCase()}
                </Text>
              );
            })}
        </View>
        <View style={styles.column}>
          <Text style={styles.title}>Category</Text>
          {records &&
            records.map((record) => {
              return (
                <Text
                  style={
                    record.Type === "income" ? styles.income : styles.expense
                  }
                >
                  {record.CategoryName.toUpperCase()}
                </Text>
              );
            })}
        </View>
        <View style={styles.column}>
          <Text style={styles.title}>Amount</Text>
          {records &&
            records.map((record) => {
              return (
                <Text
                  style={
                    record.Type === "income" ? styles.income : styles.expense
                  }
                >
                  {record.Amount}
                </Text>
              );
            })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
    padding: 20,
  },
  column: {},
  title: {
    fontWeight: "bold",
    fontSize: 18,
    paddingBottom: 10,
    textAlign: "center",
    borderBottomWidth: 1,
  },
  income: {
    color: "green",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  expense: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
});
