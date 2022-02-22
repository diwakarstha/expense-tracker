import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import AddCategory from "./src/addCategory";
import AddExpense from "./src/addExpense";
import AddIncome from "./src/addIncome";
import Dashboard from "./src/dashboard";
import NinthPage from "./src/db";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Add Category" component={AddCategory} />
        <Stack.Screen name="Add Income" component={AddIncome} />
        <Stack.Screen name="Add Expense" component={AddExpense} />
        {/* <Stack.Screen name="Add Expense" component={NinthPage} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
