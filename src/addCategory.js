import React, { useState } from "react";
import { createTables, db } from "./db";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Picker,
  Pressable,
  Alert,
} from "react-native";

export default function AddCategory({ navigation }) {
  const [category, setCategory] = useState("");

  const addCategory = async () => {
    createTables();
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM Categories WHERE Name='" +
            category +
            "' COLLATE NOCASE",
          [],
          async (tx, results) => {
            if (results.rows.length > 0) {
              Alert.alert("Warning!", "Category already exists");
            } else {
              try {
                await db.transaction(async (tx) => {
                  await tx.executeSql(
                    "INSERT INTO Categories (Name, Balance) VALUES (?,?)",
                    [category, 0]
                  );
                });
                navigation.goBack("Dashboard");
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

  const onPressHandle = () => {
    if (category.length == 0) {
      Alert.alert("Warning!", "Please write your data");
    } else {
      addCategory();
    }
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 40,
          textAlign: "center",
          marginBottom: 30,
          borderBottomWidth: 1,
        }}
      >
        Add Category
      </Text>
      <View style={{ marginRight: 20, marginLeft: 20 }}>
        <Text style={{ fontSize: 25, marginTop: 10, marginBottom: 10 }}>
          Category Name:
        </Text>
        <TextInput
          style={{
            fontSize: 20,
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
          }}
          placeholder="e.g. Rent"
          onChangeText={setCategory}
        />
      </View>
      <Pressable
        style={({ pressed }) =>
          pressed ? styles.buttonPressed : styles.button
        }
      >
        <Text style={styles.buttonText} onPress={onPressHandle}>
          Confirm
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 30,
  },
  button: {
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 15,
    // width: "100%",
    margin: 20,
    padding: 10,
  },
  buttonPressed: {
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 10,
    // width: "100%",
    margin: 20,
    padding: 10,
    backgroundColor: "lightblue",
  },
  buttonText: {
    color: "blue",
    textAlign: "center",
    fontSize: 20,
  },
});
