import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Alert, Button } from "react-native";
import SQLite from "react-native-sqlite-storage";

export const db = SQLite.openDatabase(
  {
    name: "MainDB",
    location: "default",
  },
  () => {
    console.log("connection successful");
  },
  (error) => {
    console.log(error);
  }
);

export function createTables() {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS " +
        "Categories " +
        "(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT NOT NULL UNIQUE, Balance INTEGER);"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS " +
        "Records " +
        "(ID INTEGER PRIMARY KEY AUTOINCREMENT, Type TEXT, CategoryId INTEGER, Amount INTEGER,FOREIGN KEY (CategoryId) REFERENCES Categories (ID) );"
    );
  });
}

export async function insertCategory(name) {
  if (name.length == 0) {
    Alert.alert("Warning!", "Please write your data");
  } else {
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "INSERT INTO Categories (Name,Balance) VALUES (?,?)",
          [name, 0]
        );
      });
      console.log(name);
    } catch (error) {
      console.log(error);
    }
  }
}

export function findCategoryByName(name) {
  try {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Categories WHERE Name='" + name + "' COLLATE NOCASE",
        [],
        (tx, results) => {
          var len = results.rows.length;
          console.log(len);
          if (len > 0) {
            // handleCategoryFetch(results.rows.item(0));
            resolve(results.rows.item(0));
          }
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
}

export function fetchAllCategory(handleCategoriesFetch) {
  let categories = [];
  try {
    db.transaction((tx) => {
      let result = tx.executeSql(
        "SELECT * FROM Categories",
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            for (i = 0; i < len; i++) {
              categories.push(results.rows.item(i));
            }
            console.log(categories);
            return categories;
          }
        }
      );
      console.log("Result ", result);
    });
  } catch (error) {
    console.log(error);
  }
}

export default function NinthPage() {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState("");
  // const [count, setCount] = useState(1);
  const [name, setName] = useState("");
  // const [age, setAge] = useState("");
  const [dbName, setDbName] = useState("");
  // const [dbAge, setDbAge] = useState("");

  useEffect(() => {});

  // const createTable = () => {
  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       "CREATE TABLE IF NOT EXISTS " +
  //         "Users " +
  //         "(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Age INTEGER);"
  //     );
  //     tx.executeSql(
  //       "CREATE TABLE IF NOT EXISTS " +
  //         "Subjects " +
  //         "(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Age INTEGER);"
  //     );
  //   });
  // };

  // const getData = () => {
  //   try {
  //     db.transaction((tx) => {
  //       tx.executeSql("SELECT Name, Age FROM Users", [], (tx, results) => {
  //         var len = results.rows.length;
  //         console.log(len);
  //         if (len > 0) {
  //           var userName = results.rows.item(len - 1).Name;
  //           var userAge = results.rows.item(len - 1).Age;
  //           setDbName(userName);
  //           setDbAge(userAge);
  //           console.log("Name:", userName, "Age:", userAge);
  //         }
  //       });
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const setData = async () => {
  //   if (name.length == 0 || age.length == 0) {
  //     Alert.alert("Warning!", "Please write your data");
  //   } else {
  //     try {
  //       await db.transaction(async (tx) => {
  //         //   await tx.executeSql(
  //         //       "INSERT INTO Users (Name, Age) VALUES ('"+name+"',"+age+")"
  //         //   )
  //         await tx.executeSql("INSERT INTO Users (Name, Age) VALUES (?,?)", [
  //           name,
  //           age,
  //         ]);
  //         await tx.executeSql("INSERT INTO Subjects (Name, Age) VALUES (?,?)", [
  //           "Math",
  //           1000,
  //         ]);
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };
  const handleCategoryFetch = (result) => {
    setCategory(result);
  };

  const handleCategoriesFetch = (results) => {
    setCategories(results);
  };

  const onPressHandle = () => {
    // db.transaction((tx) => {
    // tx.executeSql("DROP TABLE IF EXISTS Caregories", []);
    //   tx.executeSql("DROP TABLE IF EXISTS Users", []);
    // });
    if (name.length == 0) {
      Alert.alert("Warning!", "Please write your data");
    } else {
      createTables();
      // fetchAllCategory(handleCategoriesFetch);
      console.log(findCategoryByName(name));
      insertCategory(name);
      // if (category) {
      //   if (category.Name.toLowerCase() === name.toLowerCase()) {
      //     Alert.alert("Warning!", "Category already Exists!!!");
      //   } else {
      //     insertCategory(name);
      //   }
      // }
    }
    // setData();
  };

  return (
    <View style={styles.body}>
      <Text style={styles.text}>Please enter category name:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Rent"
        onChangeText={(value) => setName(value)}
      />

      <Text>Your category is {category ? category.Name : ""}</Text>
      <View>
        {categories ? (
          categories.map((item) => (
            <Text>
              {categories.Name}: {categories.Balance}
            </Text>
          ))
        ) : (
          <Text></Text>
        )}
      </View>
      <Button title="Submit" onPress={onPressHandle} />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    margin: 10,
  },
  input: {
    textAlign: "center",
    width: 300,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 20,
  },
});
