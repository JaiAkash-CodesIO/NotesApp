import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { ThemeColors } from '../theme/theme';
import { CloseIcon, WifiIcon } from './Icons';

interface WirelessDebugModalProps {
  visible: boolean;
  theme: ThemeColors;
  onClose: () => void;
}

export const WirelessDebugModal: React.FC<WirelessDebugModalProps> = ({
  visible,
  theme,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.titleRow}>
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: theme.primaryLight },
                ]}
              >
                <WifiIcon size={20} color={theme.primary} />
              </View>
              <Text style={[styles.title, { color: theme.text }]}>
                Wireless Debugging Guide
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <CloseIcon size={18} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Step 1 */}
            <View style={styles.stepCard}>
              <View style={[styles.stepNumberBadge, { backgroundColor: theme.primary }]}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={[styles.stepTitle, { color: theme.text }]}>
                  Connect to Same Wi-Fi
                </Text>
                <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                  Ensure your phone and this computer are connected to the exact same Wi-Fi network.
                </Text>
              </View>
            </View>

            {/* Step 2 */}
            <View style={styles.stepCard}>
              <View style={[styles.stepNumberBadge, { backgroundColor: theme.primary }]}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={[styles.stepTitle, { color: theme.text }]}>
                  Enable Wireless Debugging (Android 11+)
                </Text>
                <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                  On your phone: Go to <Text style={{ fontWeight: '700' }}>Settings → Developer Options → Wireless Debugging</Text> and turn it ON.
                </Text>
              </View>
            </View>

            {/* Step 3 */}
            <View style={styles.stepCard}>
              <View style={[styles.stepNumberBadge, { backgroundColor: theme.primary }]}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={[styles.stepTitle, { color: theme.text }]}>
                  Pair in Android Studio
                </Text>
                <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                  In Android Studio: Open <Text style={{ fontWeight: '700' }}>Device Manager → "Pair Devices Using Wi-Fi"</Text>, then scan the QR code on your phone!
                </Text>
              </View>
            </View>

            {/* Terminal Command Box */}
            <View
              style={[
                styles.codeBox,
                { backgroundColor: theme.inputBg, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.codeHeader, { color: theme.textMuted }]}>
                OR VIA COMMAND LINE:
              </Text>
              <Text style={[styles.codeText, { color: theme.text }]}>
                adb pair [IP_ADDRESS]:[PORT]
              </Text>
              <Text style={[styles.codeText, { color: theme.text }]}>
                adb connect [IP_ADDRESS]:[PORT]
              </Text>
              <Text style={[styles.codeText, { color: theme.success }]}>
                adb reverse tcp:8081 tcp:8081
              </Text>
            </View>
          </ScrollView>

          {/* Footer Button */}
          <TouchableOpacity
            style={[styles.gotItBtn, { backgroundColor: theme.primary }]}
            onPress={onClose}
          >
            <Text style={styles.gotItBtnText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  scrollContent: {
    gap: 12,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  codeBox: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    marginTop: 8,
    gap: 4,
  },
  codeHeader: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '600',
  },
  gotItBtn: {
    margin: 16,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gotItBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
