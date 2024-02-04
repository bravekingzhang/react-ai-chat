import { makeStyles } from "@rneui/themed";
import React from "react";
import { ActivityIndicator, Animated, Easing, View } from "react-native";

export default function MessageLoading({}) {
  const styles = useStyles();
  const spinValue = new Animated.Value(0);

  // 在组件挂载后开始动画
  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.messageReceiveBubble}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <ActivityIndicator size="small" />
      </Animated.View>
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  messageReceiveBubble: {
    borderColor: theme.colors.greyOutline,
    backgroundColor: theme.colors.primary,
    borderWidth: 0.5,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    maxWidth: "90%",
  },
}));
