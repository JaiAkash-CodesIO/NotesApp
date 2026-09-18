import React from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Text,
  Alert,
} from 'react-native';
import { ThemeColors } from '../theme/theme';
import { CloseIcon, TrashIcon } from './Icons';

interface ImageViewerModalProps {
  visible: boolean;
  imageUrl: string | null;
  theme: ThemeColors;
  onClose: () => void;
  onRemove?: () => void;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  visible,
  imageUrl,
  theme,
  onClose,
  onRemove,
}) => {
  if (!imageUrl) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Top Controls Bar */}
        <SafeAreaView style={styles.topBar}>
          <TouchableOpacity
            style={[styles.circleBtn, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
            onPress={onClose}
          >
            <CloseIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>

          {onRemove && (
            <TouchableOpacity
              style={[styles.circleBtn, { backgroundColor: 'rgba(239, 68, 68, 0.8)' }]}
              onPress={() => {
                Alert.alert('Remove Image', 'Do you want to remove this photo attachment?', [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                      onRemove();
                      onClose();
                    },
                  },
                ]);
              }}
            >
              <TrashIcon size={18} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </SafeAreaView>

        {/* Center Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
