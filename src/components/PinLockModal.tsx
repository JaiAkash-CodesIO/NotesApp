import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { ThemeColors } from '../theme/theme';
import { CloseIcon, LockIcon, ShieldIcon, CheckIcon } from './Icons';
import { getAppPin, setAppPin } from '../storage/noteStorage';

interface PinLockModalProps {
  visible: boolean;
  theme: ThemeColors;
  noteTitle?: string;
  isSettingNewPin?: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export const PinLockModal: React.FC<PinLockModalProps> = ({
  visible,
  theme,
  noteTitle,
  isSettingNewPin = false,
  onSuccess,
  onClose,
}) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'enter' | 'create' | 'confirm'>('enter');
  const [errorMessage, setErrorMessage] = useState('');
  const [storedPin, setStoredPin] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setPin('');
      setConfirmPin('');
      setErrorMessage('');
      const fetchPin = async () => {
        const saved = await getAppPin();
        setStoredPin(saved);
        if (!saved || isSettingNewPin) {
          setStep('create');
        } else {
          setStep('enter');
        }
      };
      fetchPin();
    }
  }, [visible, isSettingNewPin]);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setErrorMessage('');

      if (nextPin.length === 4) {
        handlePinComplete(nextPin);
      }
    }
  };

  const handlePinComplete = async (enteredPin: string) => {
    if (step === 'create') {
      setConfirmPin(enteredPin);
      setPin('');
      setStep('confirm');
    } else if (step === 'confirm') {
      if (enteredPin === confirmPin) {
        await setAppPin(enteredPin);
        setStoredPin(enteredPin);
        onSuccess();
      } else {
        setErrorMessage('PINs do not match. Try again.');
        setPin('');
        setConfirmPin('');
        setStep('create');
      }
    } else {
      // Enter mode
      const validPin = storedPin || '1234'; // default fallback PIN
      if (enteredPin === validPin) {
        onSuccess();
      } else {
        setErrorMessage('Incorrect PIN. (Default PIN: 1234)');
        setTimeout(() => setPin(''), 400);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setErrorMessage('');
    }
  };

  const getTitle = () => {
    if (step === 'create') return 'Create 4-Digit Security PIN';
    if (step === 'confirm') return 'Confirm Security PIN';
    return noteTitle ? `Unlock "${noteTitle}"` : 'Enter Security PIN';
  };

  const getSubtitle = () => {
    if (step === 'create') return 'Enter 4 digits to secure your private notes';
    if (step === 'confirm') return 'Re-enter your 4-digit PIN to confirm';
    return 'Enter your PIN to access this private note';
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'];

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
                  styles.iconBadge,
                  { backgroundColor: theme.primaryLight },
                ]}
              >
                <ShieldIcon size={18} color={theme.primary} />
              </View>
              <Text numberOfLines={1} style={[styles.title, { color: theme.text }]}>
                {getTitle()}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <CloseIcon size={18} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Subtitle */}
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {getSubtitle()}
          </Text>

          {/* PIN 4-Dot Indicators */}
          <View style={styles.dotsRow}>
            {[0, 1, 2, 3].map((idx) => {
              const isFilled = idx < pin.length;
              return (
                <View
                  key={idx}
                  style={[
                    styles.dot,
                    {
                      borderColor: theme.primary,
                      backgroundColor: isFilled ? theme.primary : 'transparent',
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Error message */}
          {errorMessage.length > 0 && (
            <Text style={[styles.errorText, { color: theme.danger }]}>
              {errorMessage}
            </Text>
          )}

          {/* Numeric Keypad */}
          <View style={styles.keypad}>
            {keys.map((key, i) => {
              if (key === 'C') {
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.keyBtn, { backgroundColor: theme.inputBg }]}
                    onPress={() => setPin('')}
                  >
                    <Text style={[styles.keyText, { color: theme.textMuted }]}>
                      Clear
                    </Text>
                  </TouchableOpacity>
                );
              }
              if (key === '⌫') {
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.keyBtn, { backgroundColor: theme.inputBg }]}
                    onPress={handleDelete}
                  >
                    <Text style={[styles.keyText, { color: theme.text }]}>
                      ⌫
                    </Text>
                  </TouchableOpacity>
                );
              }
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.keyBtn, { backgroundColor: theme.inputBg }]}
                  onPress={() => handleKeyPress(key)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.keyText, { color: theme.text }]}>
                    {key}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
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
    flex: 1,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  subtitle: {
    fontSize: 12.5,
    textAlign: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginVertical: 18,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  errorText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  keyBtn: {
    width: '30%',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 19,
    fontWeight: '700',
  },
});
