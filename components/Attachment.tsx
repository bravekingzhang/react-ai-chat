import React from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { Icon, makeStyles } from "@rneui/themed";

const Attachment = ({
  uri,
  type,
  onRemove,
}: {
  uri: string;
  type: string;
  onRemove: (uri: string) => void;
}) => {
  const styles = useStyles();

  const isImage = type === "image";

  return (
    <View style={styles.container}>
      {isImage ? (
        <Image source={{ uri }} style={styles.image} />
      ) : (
        <View style={styles.fileContainer}>
          <Icon name="insert-drive-file" type="material" size={24} />
          <Text numberOfLines={1} style={styles.fileName}>
            {uri.split("/").pop()} {/* 获取文件名 */}
          </Text>
        </View>
      )}
      <TouchableOpacity style={styles.closeIcon} onPress={() => onRemove(uri)}>
        <Icon name="close" type="material" size={18} />
      </TouchableOpacity>
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: "row",
    padding: theme.spacing.sm,
    margin: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.greyOutline,
    borderRadius: 5,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 3,
  },
  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileName: {
    marginLeft: theme.spacing.sm,
  },
  closeIcon: {
    zIndex: 100,
    position: "absolute",
    right: 0,
    backgroundColor: theme.colors.background,
    borderRadius: 5,
  },
}));

export default Attachment;
