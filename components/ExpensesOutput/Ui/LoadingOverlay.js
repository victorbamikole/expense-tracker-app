import { View, ActivityIndicator, StyleSheet } from "react-native";
import { GlobalStyles } from "../../../constants/styles";

function LoadingOverlay() {
  return (
    <View style={StyleSheet.container}>
      <ActivityIndicator size="large" color="black" />
    </View>
  );
}

export default LoadingOverlay;

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
});
