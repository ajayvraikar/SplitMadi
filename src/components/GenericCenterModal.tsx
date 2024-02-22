import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
interface GenericCenterModalProps {
  onRequestClose?: () => void;
  visible?: boolean;
  children: string | JSX.Element | JSX.Element[];
}

const GenericCenterModal: React.FC<GenericCenterModalProps> = ({
  onRequestClose,
  visible = false,
  children,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={onRequestClose}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {children}
      </View>
    </Modal>
  );
};

export default GenericCenterModal;

const styles = StyleSheet.create({});
