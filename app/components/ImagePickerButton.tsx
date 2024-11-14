import React, { useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useActionSheet } from "@expo/react-native-action-sheet";
import Icon from "react-native-vector-icons/Ionicons";

interface ImagePickerButtonProps {
  onImagePicked: (uri: string) => void;
}

/**
 * ImagePickerButton component
 * This component renders a button that opens an action sheet to pick an image from the library or take a photo.
 *
 * @component
 * @example
 * return (
 *   <ImagePickerButton onImagePicked={(uri) => console.log(uri)} />
 * )
 */
const ImagePickerButton: React.FC<ImagePickerButtonProps> = ({
  onImagePicked,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { showActionSheetWithOptions } = useActionSheet();

  /**
   * Pick an image from the library
   * @async
   * @function
   */
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      onImagePicked(result.assets[0].uri);
    }
  };

  /**
   * Open the camera to take a photo
   * @async
   * @function
   */
  const openCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      onImagePicked(result.assets[0].uri);
    }
  };

  /**
   * Show the action sheet with options to pick an image or take a photo
   * @function
   */
  const showActionSheet = () => {
    const options = ["Cancel", "Pick an Image", "Take a Photo"];
    const cancelButtonIndex = 0;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          pickImage();
        } else if (buttonIndex === 2) {
          openCamera();
        }
      }
    );
  };

  return (
    <TouchableOpacity onPress={showActionSheet} className="items-center">
      <Icon name="camera-outline" size={24} color="gray" />
    </TouchableOpacity>
  );
};

export default ImagePickerButton;
