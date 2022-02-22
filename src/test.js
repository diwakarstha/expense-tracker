import { Pressable, Text } from "react-native";

import { View } from "react-native";
export default function Test() {
  return (
    <View>
      <Pressable style={{ backgroundColor: "red" }}>
        <Text>Hello World!!!</Text>
      </Pressable>
    </View>
  );
}
