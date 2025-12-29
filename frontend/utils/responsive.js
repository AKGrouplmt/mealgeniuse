import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Guideline sizes
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Scale functions
export const scale = (size) => (width / guidelineBaseWidth) * size;
export const verticalScale = (size) => (height / guidelineBaseHeight) * size;
export const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

// Device detection
export const isSmallDevice = width < 375;
export const isLargeDevice = width > 414;
export const isTablet = width > 768;

// Font sizes
export const fonts = {
  h1: moderateScale(32),
  h2: moderateScale(28),
  h3: moderateScale(24),
  h4: moderateScale(20),
  h5: moderateScale(18),
  body: moderateScale(16),
  caption: moderateScale(14),
  small: moderateScale(12),
  tiny: moderateScale(10),
};

// Spacing
export const spacing = {
  xs: verticalScale(4),
  sm: verticalScale(8),
  md: verticalScale(16),
  lg: verticalScale(24),
  xl: verticalScale(32),
  xxl: verticalScale(40),
};

// Platform
export const platformPadding = Platform.OS === 'ios' ? verticalScale(44) : verticalScale(24);

// Dimensions
export { width, height };