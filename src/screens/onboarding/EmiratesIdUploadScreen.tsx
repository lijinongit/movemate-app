import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { ErrorBanner } from '../../components/ErrorBanner';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { EmiratesIdUploadScreenProps } from '../../types/navigation';
import {
  useRequestPresignedUrlMutation,
  useUploadFileMutation,
  useConfirmUploadMutation,
} from '../../api/queries';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function EmiratesIdUploadScreen({
  navigation,
  route,
}: EmiratesIdUploadScreenProps): React.ReactElement {
  const { t } = useTranslation();
  const { userId, userType } = route.params;

  const { mutate: requestUrl, isPending: isRequestingUrl } = useRequestPresignedUrlMutation();
  const { mutate: uploadFile, isPending: isUploading } = useUploadFileMutation();
  const { mutate: confirmUpload, isPending: isConfirming } = useConfirmUploadMutation();

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handlePickImage = async (): Promise<void> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 10],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const file = {
          uri: asset.uri,
          type: 'image/jpeg',
          name: `emirates-id-${Date.now()}.jpg`,
        };

        handleUploadFile(file);
      }
    } catch (err) {
      setError(t('emiratesId.errors.uploadFailed'));
    }
  };

  const handleUploadFile = (file: any): void => {
    requestUrl(
      {
        documentType: 'emirates_id',
        fileName: file.name,
        fileType: 'image/jpeg',
      },
      {
        onSuccess: (response) => {
          const blob = new Blob([file.uri], { type: 'image/jpeg' });

          uploadFile(
            {
              presignedUrl: response.presignedUrl,
              file: blob,
              onProgress: (percent) => setUploadProgress(percent),
            },
            {
              onSuccess: () => {
                confirmUpload(
                  {
                    documentType: 'emirates_id',
                    path: response.path,
                  },
                  {
                    onSuccess: (confirmResponse) => {
                      setUploadedImage(file.uri);
                      setError(null);
                    },
                  }
                );
              },
              onError: (err) => {
                setError(t('emiratesId.errors.uploadFailed'));
              },
            }
          );
        },
        onError: (err) => {
          setError(t('emiratesId.errors.uploadFailed'));
        },
      }
    );
  };

  const handleContinue = (): void => {
    if (!uploadedImage) {
      setError(t('emiratesId.errors.uploadFailed'));
      return;
    }

    if (userType === 'customer') {
      navigation.navigate('AgeCheck', { userId });
    } else {
      navigation.navigate('TrainerCertifications', { userId });
    }
  };

  const isLoading = isRequestingUrl || isUploading || isConfirming;

  return (
    <>
      <Screen scroll safeArea contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('emiratesId.title')}</Text>
          <Text style={styles.subtitle}>{t('emiratesId.subtitle')}</Text>
        </View>

        {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

        {!uploadedImage ? (
          <>
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={handlePickImage}
              disabled={isLoading}
              accessible
              accessibilityRole="button"
              accessibilityLabel={t('emiratesId.uploadPrompt')}
              testID="upload-button"
            >
              <Text style={styles.uploadIcon}>📸</Text>
              <Text style={styles.uploadText}>{t('emiratesId.uploadPrompt')}</Text>
              <Text style={styles.uploadFormat}>{t('emiratesId.format')}</Text>
            </TouchableOpacity>

            <View style={styles.tipsContainer}>
              <TouchableOpacity
                style={styles.tipsHeader}
                accessible
                accessibilityRole="button"
                accessibilityLabel={t('emiratesId.tips')}
              >
                <Text style={styles.tipsTitle}>{t('emiratesId.tips')}</Text>
                <Text style={styles.tipsToggle}>▼</Text>
              </TouchableOpacity>

              <View style={styles.tipsList}>
                <Text style={styles.tipItem}>• {t('emiratesId.tip1')}</Text>
                <Text style={styles.tipItem}>• {t('emiratesId.tip2')}</Text>
                <Text style={styles.tipItem}>• {t('emiratesId.tip3')}</Text>
              </View>
            </View>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <View style={styles.progressContainer}>
                <View
                  style={[styles.progressBar, { width: `${uploadProgress}%` }]}
                />
              </View>
            )}

            <Text style={styles.statusText}>{t('emiratesId.statusText')}</Text>
          </>
        ) : (
          <>
            <Image
              source={{ uri: uploadedImage }}
              style={styles.preview}
              accessible
              accessibilityLabel="Uploaded Emirates ID preview"
            />
            <Text style={styles.successText}>{t('emiratesId.success')}</Text>
            <Button
              title={t('common.continue')}
              onPress={handleContinue}
              testID="continue-button"
            />
          </>
        )}
      </Screen>

      <LoadingOverlay visible={isLoading} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
    minHeight: 200,
    justifyContent: 'center',
    marginVertical: spacing.lg,
    backgroundColor: colors.surface,
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  uploadText: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  uploadFormat: {
    ...typography.small,
    color: colors.textSecondary,
  },
  tipsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginVertical: spacing.md,
    overflow: 'hidden',
  },
  tipsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surfaceAlt,
  },
  tipsTitle: {
    ...typography.label,
    color: colors.textPrimary,
  },
  tipsToggle: {
    color: colors.textTertiary,
  },
  tipsList: {
    padding: spacing.md,
  },
  tipItem: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  progressContainer: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginVertical: spacing.md,
    overflow: 'hidden',
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.primary,
  },
  statusText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: spacing.xl,
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: spacing.lg,
  },
  successText: {
    ...typography.bodySemibold,
    color: colors.success,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});
