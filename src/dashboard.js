import react, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Alert, Button, Pressable, StyleSheet, Text, View } from "react-native";
import NavigateButton from "./common/navigateBotton";
import Test from "./test";
import { createTables, db } from "./db";
import { ScrollView } from "react-native";
import { useIsFocused } from "@react-navigation/native";

export default function Dashboard({ navigation }) {
  const [categories, setCategories] = useState();
  const [totalBalance, setTotalBalance] = useState();

  const isFocused = useIsFocused();

  useEffect(() => {
    // db.transaction((tx) => {
    //   tx.executeSql("DROP TABLE Categories");
    //   tx.executeSql("DROP TABLE Records");
    // });
    readCategories();
  }, [isFocused]);

  const calculateTotalBalance = (list) => {
    let sumBalance = 0;
    if (list) {
      list.map((item) => {
        sumBalance += item.Balance;
      });
    }

    setTotalBalance(sumBalance);
  };

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
            calculateTotalBalance(resultCategories);
            setCategories(resultCategories);
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
                setCategories();
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Expense Tracker</Text>
      <Text style={styles.balance}>Total Balance: {totalBalance}</Text>
      <View style={styles.category}>
        {categories ? (
          categories.map((category) => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginRight: 10,
                  marginLeft: 10,
                  marginTop: 10,
                }}
                key={category.ID}
              >
                <Text style={styles.balance}>
                  {category.Name}: {category.Balance}
                </Text>
                <Pressable
                  style={{
                    borderWidth: 2,
                    borderRadius: 20,
                    borderColor: "red",
                    padding: 5,
                  }}
                  onPress={() => onPressDelete(category.ID)}
                >
                  <Text style={{ color: "red" }}>Delete</Text>
                </Pressable>
              </View>
            );
          })
        ) : (
          <Text style={styles.balance}>No Categories</Text>
        )}
        <NavigateButton
          navigation={navigation}
          buttonName="Add Category"
          pageToNavigate="Add Category"
        />
      </View>

      <NavigateButton
        navigation={navigation}
        buttonName="Add Income"
        pageToNavigate="Add Income"
      />
      <NavigateButton
        navigation={navigation}
        buttonName="Add Expense"
        pageToNavigate="Add Expense"
      />
      <NavigateButton
        navigation={navigation}
        buttonName="View Records"
        pageToNavigate="View Records"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 40,
  },
  balance: {
    // textAlign: "center",
    margin: 10,
    fontSize: 20,
  },
  category: {
    borderWidth: 2,
    margin: 10,
    borderRadius: 10,
  },
});
