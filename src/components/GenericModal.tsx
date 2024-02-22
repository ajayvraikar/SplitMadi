import { StyleSheet, Text, View } from "react-native";
import React, { RefObject, useCallback, useMemo, useRef } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  useBottomSheetSpringConfigs,
  useBottomSheetTimingConfigs,
} from "@gorhom/bottom-sheet";
import { Easing } from "react-native-reanimated";

interface GenericModalProps {
  bottomSheetModalRef: RefObject<BottomSheetModal>;
  snapPointsArray: Array<string>;
  children: string | JSX.Element | JSX.Element[];
}
const GenericModal: React.FC<GenericModalProps> = ({
  bottomSheetModalRef,
  snapPointsArray,
  children,
}) => {
  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 400,
    easing: Easing.ease,
  });
  // const animationConfigs = useBottomSheetSpringConfigs({
  //   damping: 80,
  //   overshootClamping: true,
  //   restDisplacementThreshold: 0.1,
  //   restSpeedThreshold: 0.1,
  //   stiffness: 500,
  // });
  const snapPoints = useMemo(() => snapPointsArray, []);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior={"collapse"}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={() => bottomSheetModalRef.current?.close()}
      />
    ),
    []
  );
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        // style={{ maxHeight: 400 }}
        keyboardBehavior="interactive"
        ref={bottomSheetModalRef}
        index={0}
        animationConfigs={animationConfigs}
        snapPoints={snapPoints}
        // onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        // maxDynamicContentSize={700}
        enableDynamicSizing={true}
      >
        {children}
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default GenericModal;

const styles = StyleSheet.create({});
