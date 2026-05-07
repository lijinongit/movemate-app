import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
  secureTextEntry?: boolean;
  onChangeText?: (text: string) => void;
  testID?: string;
  showPasswordToggle?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  hint,
  containerStyle,
  secureTextEntry: initialSecure = false,
  onChangeText,
  testID,
  showPasswordToggle = false,
  editable = true,
  ...inputProps
}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(initialSecure);
  const isError = !!error;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={styles.label}
          accessible
          accessibilityRole="header"
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          isError && styles.inputContainerError,
          !editable && styles.inputContainerDisabled,
        ]}
        accessible
        accessibilityRole="none"
      >
        <TextInput
          {...inputProps}
          style={[styles.input, inputProps.style]}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          editable={editable}
          placeholderTextColor={colors.placeholder}
          testID={testID}
          accessible
          accessibilityLabel={label}
          accessibilityHint={hint}
        />
        {showPasswordToggle && initialSecure && (
          <TouchableOpacity
            onPress={() => setSecureTextEntry(!secureTextEntry)}
            accessible
            accessibilityRole="button"
            accessibilityLabel={secureTextEntry ? 'Show password' : 'Hide password'}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Text style={styles.toggleText}>{secureTextEntry ? '👁' : '👁‍🗨'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text
          style={styles.error}
          accessible
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
        >
          {error}
        </Text>
      )}
      {hint && !error && (
        <Text style={styles.hint}>{hint}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    minHeight: 48,
  },
  inputContainerError: {
    borderColor: colors.error,
    backgroundColor: '#FFF5F5',
  },
  inputContainerDisabled: {
    backgroundColor: colors.surface,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    padding: 0,
    minHeight: 48,
  },
  toggleText: {
    fontSize: 18,
    marginLeft: spacing.sm,
  },
  error: {
    ...typography.small,
    color: colors.error,
    marginTop: spacing.sm,
  },
  hint: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});
