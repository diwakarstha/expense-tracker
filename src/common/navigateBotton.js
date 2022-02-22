import React, { useState } from "react";
import { StyleSheet, Text, Pressable } from "react-native";

export default function NavigateButton({
  navigation,
  buttonName,
  pageToNavigate,
}) {
  const handleNextPress = () => {
    navigation.navigate(pageToNavigate);
  };
  return (
    <Pressable
      style={({ pressed }) => (pressed ? styles.buttonPressed : styles.button)}
      onPress={handleNextPress}
    >
      <Text style={styles.buttonText}>{buttonName}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 15,
    // width: "100%",
    margin: 15,
    padding: 10,
  },
  buttonPressed: {
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 10,
    // width: "100%",
    margin: 15,
    padding: 10,
    backgroundColor: "lightblue",
  },
  buttonText: {
    color: "blue",
    textAlign: "center",
    fontSize: 20,
  },
});
