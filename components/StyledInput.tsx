import React, { useRef, useState } from 'react';
import {
    Animated,
    StyleSheet,
    TextInput,
    TextInputProps,
    ViewStyle
} from 'react-native';

interface StyledInputProps extends TextInputProps {
  containerStyle?: ViewStyle;
}

export default function StyledInput({
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}: StyledInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const animatedScale = useRef(new Animated.Value(1)).current;
  const animatedBorder = useRef(new Animated.Value(0)).current;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    
    // Animate scale
    Animated.spring(animatedScale, {
      toValue: 1.01,
      useNativeDriver: true,
      friction: 5,
    }).start();

    // Animate border
    Animated.timing(animatedBorder, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();

    if (onFocus) {
      onFocus(e);
    }
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    
    // Animate scale back
    Animated.spring(animatedScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();

    // Animate border back
    Animated.timing(animatedBorder, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    if (onBlur) {
      onBlur(e);
    }
  };

  const borderColor = animatedBorder.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E7EB', '#6366F1'],
  });

  const backgroundColor = animatedBorder.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFFFFF', '#F5F7FF'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        containerStyle,
        {
          transform: [{ scale: animatedScale }],
          borderColor: borderColor,
          backgroundColor: backgroundColor,
          shadowOpacity: isFocused ? 0.15 : 0.05,
        },
      ]}
    >
      <TextInput
        {...props}
        style={[styles.input, style]}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderRadius: 10,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
});
