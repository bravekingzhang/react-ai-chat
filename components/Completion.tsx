import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchOpenAiCompletion } from "../query/completion";
import { Text } from "@rneui/base";
import { View } from "react-native";

const Completion = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["openAiCompletion", "这是一个测试"],
    queryFn: () => fetchOpenAiCompletion("这是一个测试"),
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>An error occurred: {error.message}</Text>;

  return (
    <View>
      <Text>OpenAI Response</Text>
      <Text>{JSON.stringify(data)}</Text>
    </View>
  );
};

export default Completion;
