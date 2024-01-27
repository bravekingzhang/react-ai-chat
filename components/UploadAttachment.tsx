import React from "react";
import { View, TouchableOpacity, Text, Platform } from "react-native";
import { Icon, makeStyles } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker"; // 使用 Expo Image Picker 来选择文件

const UploadAttachment = ({
  onUpload,
}: {
  onUpload: (uri: string, type: string) => void;
}) => {
  const styles = useStyles();

  const pickImage = async () => {
    // 请求媒体库访问权限
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access media library is required!");
      return;
    }

    // 选择图片
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // 允许选择所有类型的媒体，包括图片和视频
      allowsEditing: true, // 允许编辑
      aspect: [4, 3], // 编辑时的宽高比
      quality: 1, // 图片质量
    });

    if (!pickerResult.canceled) {
      // fixme: 一次传多张？
      onUpload(
        pickerResult.assets[0].uri,
        pickerResult.assets[0].type || "image"
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Icon name="add" type="material" size={24} />
        <Text style={styles.buttonText}>Upload Attachment</Text>
      </TouchableOpacity>
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.sm,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    marginLeft: theme.spacing.sm,
  },
}));

export default UploadAttachment;
