const colors = {
  grey: (opacity = 1) => `rgba(109, 125, 154, ${opacity})`,
  blue: (opacity = 1) => `rgba(53, 88, 225, ${opacity})`,
  white: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  black: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  darkModeBlack: (opacity = 1) => `rgba(27, 27, 27, ${opacity})`,
  darkModeBlue: (opacity = 1) => `rgba(146, 156, 241, ${opacity})`,
  orange: (opacity = 1) => `rgba(255, 85, 0, ${opacity})`,
  yellow: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
  red: (opacity = 1) => `rgba(255, 59, 48, ${opacity})`,
  green: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`,
};

export default colors;