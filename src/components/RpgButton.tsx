// src/components/RpgButton.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

type Variant = 'primary' | 'secondary' | 'danger';

interface RpgButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle;
}

export const RpgButton: React.FC<RpgButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}) => {
  const backgroundColor =
    variant === 'primary'
      ? '#8B5CF6' // roxo principal
      : variant === 'secondary'
      ? '#374151' // cinza escuro
      : '#B91C1C'; // danger (vermelho escuro)

  const borderColor =
    variant === 'primary'
      ? '#A855F7'
      : variant === 'secondary'
      ? '#4B5563'
      : '#DC2626';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor, borderColor, opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#F9FAFB',
    fontWeight: '600',
  },
});