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
        "(ID INTEGER PRIMARY KEY AUTOINCREMENT, Type TEXT,  CategoryId INTEGER,CategoryName TEXT, Amount INTEGER,FOREIGN KEY (CategoryId) REFERENCES Categories (ID) );"
    );
  });
}
