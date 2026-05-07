import { useColorScheme } from 'react-native';
import { colors } from '../theme/colors';

export const useColors = (): typeof colors => {
  // For now, always return light colors
  // Dark mode support can be added in Phase 2
  return colors;
};
