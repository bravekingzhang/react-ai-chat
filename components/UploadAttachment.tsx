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

    // 请求相机访问权限
    const cameraPermissionResult =
      await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermissionResult.granted === false) {
      alert("Permission to access camera is required!");
      return;
    }

    // 选择图片
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // 允许选择所有类型的媒体，包括图片和视频
      allowsEditing: true, // 允许编辑
      quality: 1, // 图片质量
    });

    if (!pickerResult.canceled) {
      // fixme: 一次传多张？
      pickerResult.assets.forEach((asset) => {
        onUpload(asset.uri, asset.type || "image");
      });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Icon name="attachment" type="material" size={24} />
      </TouchableOpacity>
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
}));

export default UploadAttachment;
