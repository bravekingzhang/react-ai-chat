import React, { useState } from "react";
import { View, TouchableOpacity, Text, Platform } from "react-native";
import {
  BottomSheet,
  Divider,
  Icon,
  ListItem,
  makeStyles,
} from "@rneui/themed";
import * as ImagePicker from "expo-image-picker"; // 使用 Expo Image Picker 来选择文件

const UploadAttachment = ({
  onUpload,
}: {
  onUpload: (uri: string, type: string) => void;
}) => {
  const styles = useStyles();
  const [isVisible, setIsVisible] = useState(false);

  const pickImage = async ({
    isPickImage = true,
  }: {
    isPickImage?: boolean;
  }) => {
    let pickerResult;
    // 请求媒体库访问权限
    if (isPickImage) {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert("Permission to access media library is required!");
        return;
      }
      // 选择图片
      pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // 允许选择所有类型的媒体，包括图片和视频
        allowsEditing: true, // 允许编辑
        quality: 1, // 图片质量
      });
    } else {
      // 请求相机访问权限
      const cameraPermissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermissionResult.granted === false) {
        alert("Permission to access camera is required!");
        return;
      }
      pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
    }

    if (!pickerResult.canceled) {
      // fixme: 一次传多张？
      pickerResult.assets.forEach((asset) => {
        onUpload(asset.uri, asset.type || "image");
      });
    }
  };
  return (
    <View style={styles.container}>
      <BottomSheet
        modalProps={{}}
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
      >
        <ListItem
          key={"pickImage"}
          onPress={() => {
            pickImage({ isPickImage: true });
            setIsVisible(false);
          }}
        >
          <ListItem.Content>
            <ListItem.Title style={styles.actionSheet}>
              {"选择照片"}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <Divider></Divider>
        <ListItem
          key={"takePhotos"}
          onPress={() => {
            pickImage({ isPickImage: false });
            setIsVisible(false);
          }}
        >
          <ListItem.Content>
            <ListItem.Title style={styles.actionSheet}>
              {"拍摄照片"}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </BottomSheet>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setIsVisible(true);
        }}
      >
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
  actionSheet: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
}));

export default UploadAttachment;
