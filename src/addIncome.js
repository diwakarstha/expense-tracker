import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Picker,
  Pressable,
} from "react-native";
import { createTables, db } from "./db";

export default function AddIncome({ navigation }) {
  const [selectedValue, setSelectedValue] = useState("default");
  const [categories, setCategories] = useState();
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    readCategories();
    // console.log(categories);
  }, []);

  const readCategories = () => {
    createTables();
    const resultCategories = [];
    try {
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM Categories", [], (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              resultCategories.push(results.rows.item(i));
            }
            setCategories(resultCategories);
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onPressConfirm = () => {
    try {
      console.log("confirm pressed");
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM Categories WHERE ID='" + selectedValue + "'",
          [],
          async (tx, results) => {
            if (results.rows.length > 0) {
              let updatedAmount =
                parseInt(results.rows.item(0).Balance) + parseInt(amount);
              try {
                await db.transaction(async (tx) => {
                  await tx.executeSql(
                    "INSERT INTO Records (Type, CategoryId, CategoryName, Amount) VALUES (?,?,?,?)",
                    ["income", selectedValue, results.rows.item(0).Name, amount]
                  );
                });

                await db.transaction(async (tx) => {
                  await tx.executeSql(
                    "UPDATE Categories SET Balance='" +
                      updatedAmount +
                      "' WHERE ID='" +
                      selectedValue +
                      "'"
                  );
                });
                navigation.goBack();
              } catch (error) {
                console.log(error);
              }
            } else {
              Alert.alert("Warning!", "Please select vaid category");
            }
          }
        );
      });
    } catch (error) {
      console.log(error);
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
        Add Income
      </Text>
      <View style={{ marginRight: 20, marginLeft: 20 }}>
        <Text style={{ fontSize: 25, marginTop: 10, marginBottom: 10 }}>
          Income Type:
        </Text>
        <View style={{ borderWidth: 1, borderRadius: 10 }}>
          <Picker
            selectedValue={selectedValue}
            style={{
              height: 50,
              width: "100%",
            }}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedValue(itemValue)
            }
          >
            <Picker.Item label="Select Category" value="default" />
            {categories &&
              categories.map((category) => {
                return (
                  <Picker.Item
                    key={category.ID}
                    label={category.Name}
                    value={category.ID}
                  />
                );
              })}
          </Picker>
        </View>
      </View>
      <View style={{ marginRight: 20, marginLeft: 20 }}>
        <Text style={{ fontSize: 25, marginTop: 10, marginBottom: 10 }}>
          Amount:
        </Text>
        <TextInput
          style={{
            fontSize: 20,
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
          }}
          placeholder="Enter Amount"
          editable={selectedValue === "default" ? false : true}
          onChangeText={setAmount}
        />
      </View>
      <Pressable
        style={({ pressed }) =>
          pressed ? styles.buttonPressed : styles.button
        }
        onPress={onPressConfirm}
      >
        <Text style={styles.buttonText}>Confirm</Text>
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
