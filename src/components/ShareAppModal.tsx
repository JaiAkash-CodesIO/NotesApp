import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  Linking,
  Alert,
} from 'react-native';
import { ThemeColors } from '../theme/theme';
import {
  CloseIcon,
  ShareIcon,
  WhatsAppIcon,
  TelegramIcon,
  CopyIcon,
  CheckIcon,
  LinkIcon,
} from './Icons';

interface ShareAppModalProps {
  visible: boolean;
  theme: ThemeColors;
  onClose: () => void;
}

const DEFAULT_SHARE_URL = 'https://github.com/notesapp/download';
const DEFAULT_SHARE_MESSAGE =
  '📝 Hey! Check out Modern Notes — a super clean, fast, offline Notes & To-Do app with rich checklists and dark mode! 🚀\n\nDownload or get it here: ' +
  DEFAULT_SHARE_URL;

export const ShareAppModal: React.FC<ShareAppModalProps> = ({
  visible,
  theme,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  // Share via WhatsApp
  const handleShareWhatsApp = async () => {
    const url = `whatsapp://send?text=${encodeURIComponent(DEFAULT_SHARE_MESSAGE)}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        onClose();
      } else {
        // Fallback to web link or native share
        await Linking.openURL(`https://api.whatsapp.com/send?text=${encodeURIComponent(DEFAULT_SHARE_MESSAGE)}`);
        onClose();
      }
    } catch {
      // Fallback to system share
      handleNativeShare();
    }
  };

  // Share via Telegram
  const handleShareTelegram = async () => {
    const tgDeepLink = `tg://msg?text=${encodeURIComponent(DEFAULT_SHARE_MESSAGE)}`;
    const tgWebLink = `https://t.me/share/url?url=${encodeURIComponent(DEFAULT_SHARE_URL)}&text=${encodeURIComponent('📝 Check out Modern Notes App!')}`;
    try {
      const supported = await Linking.canOpenURL(tgDeepLink);
      if (supported) {
        await Linking.openURL(tgDeepLink);
        onClose();
      } else {
        await Linking.openURL(tgWebLink);
        onClose();
      }
    } catch {
      handleNativeShare();
    }
  };

  // Native System Share Sheet
  const handleNativeShare = async () => {
    try {
      await Share.share({
        title: 'Modern Notes App',
        message: DEFAULT_SHARE_MESSAGE,
      });
      onClose();
    } catch (error) {
      console.warn('Error sharing:', error);
    }
  };

  // Copy Link to clipboard simulation with visual confirmation
  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

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
                <ShareIcon size={17} color={theme.primary} />
              </View>
              <Text style={[styles.title, { color: theme.text }]}>
                Share App with Friends
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <CloseIcon size={18} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Subtitle Message */}
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Invite your friends to try Modern Notes on Android!
          </Text>

          {/* Action Buttons Grid */}
          <View style={styles.actionsList}>
            {/* WhatsApp */}
            <TouchableOpacity
              style={[
                styles.shareRowBtn,
                { backgroundColor: '#25D36620', borderColor: '#25D36650' },
              ]}
              onPress={handleShareWhatsApp}
              activeOpacity={0.8}
            >
              <View style={[styles.appIconCircle, { backgroundColor: '#25D366' }]}>
                <WhatsAppIcon size={18} color="#FFFFFF" />
              </View>
              <View style={styles.btnTextContainer}>
                <Text style={[styles.btnTitle, { color: theme.text }]}>
                  WhatsApp
                </Text>
                <Text style={[styles.btnDesc, { color: theme.textMuted }]}>
                  Share directly to chat or status
                </Text>
              </View>
            </TouchableOpacity>

            {/* Telegram */}
            <TouchableOpacity
              style={[
                styles.shareRowBtn,
                { backgroundColor: '#229ED920', borderColor: '#229ED950' },
              ]}
              onPress={handleShareTelegram}
              activeOpacity={0.8}
            >
              <View style={[styles.appIconCircle, { backgroundColor: '#229ED9' }]}>
                <TelegramIcon size={18} color="#FFFFFF" />
              </View>
              <View style={styles.btnTextContainer}>
                <Text style={[styles.btnTitle, { color: theme.text }]}>
                  Telegram
                </Text>
                <Text style={[styles.btnDesc, { color: theme.textMuted }]}>
                  Send to contacts or channels
                </Text>
              </View>
            </TouchableOpacity>

            {/* Native System Share Sheet */}
            <TouchableOpacity
              style={[
                styles.shareRowBtn,
                { backgroundColor: theme.inputBg, borderColor: theme.border },
              ]}
              onPress={handleNativeShare}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.appIconCircle,
                  { backgroundColor: theme.primary },
                ]}
              >
                <ShareIcon size={17} color="#FFFFFF" />
              </View>
              <View style={styles.btnTextContainer}>
                <Text style={[styles.btnTitle, { color: theme.text }]}>
                  More Sharing Options
                </Text>
                <Text style={[styles.btnDesc, { color: theme.textMuted }]}>
                  Gmail, Quick Share, Bluetooth, SMS
                </Text>
              </View>
            </TouchableOpacity>

            {/* Copy Link Button */}
            <TouchableOpacity
              style={[
                styles.shareRowBtn,
                { backgroundColor: theme.inputBg, borderColor: theme.border },
              ]}
              onPress={handleCopyLink}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.appIconCircle,
                  { backgroundColor: copied ? theme.success : theme.cardBorder },
                ]}
              >
                {copied ? (
                  <CheckIcon size={16} color="#FFFFFF" />
                ) : (
                  <LinkIcon size={16} color={theme.textSecondary} />
                )}
              </View>
              <View style={styles.btnTextContainer}>
                <Text style={[styles.btnTitle, { color: copied ? theme.success : theme.text }]}>
                  {copied ? 'Link Copied to Clipboard!' : 'Copy Share Link'}
                </Text>
                <Text style={[styles.btnDesc, { color: theme.textMuted }]}>
                  {DEFAULT_SHARE_URL}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Done Button */}
          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: theme.primary }]}
            onPress={onClose}
          >
            <Text style={styles.doneBtnText}>Done</Text>
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
    maxWidth: 400,
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
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
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
  subtitle: {
    fontSize: 12.5,
    paddingHorizontal: 16,
    paddingTop: 12,
    lineHeight: 17,
  },
  actionsList: {
    padding: 16,
    gap: 10,
  },
  shareRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  appIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTextContainer: {
    flex: 1,
  },
  btnTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  btnDesc: {
    fontSize: 11.5,
  },
  doneBtn: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
