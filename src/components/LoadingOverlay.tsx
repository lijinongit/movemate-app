import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

interface LoadingOverlayProps {
  visible: boolean;
  testID?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible, testID }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      testID={testID}
    >
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel="Loading"
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
