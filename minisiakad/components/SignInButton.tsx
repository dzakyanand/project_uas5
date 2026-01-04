import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import { useRouter } from 'expo-router';

interface SignInButtonProps {
  style?: any;
  textStyle?: any;
  onPress?: () => void;
}

export const SignInButton: React.FC<SignInButtonProps> = ({ 
  style, 
  textStyle,
  onPress 
}) => {
  const router = useRouter();

  const handlePress = (event: GestureResponderEvent) => {
    if (onPress) {
      onPress();
    } else {
      router.push('/login');
    }
  };

  return (
    <TouchableOpacity 
      style={style}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={textStyle}>Sign In</Text>
    </TouchableOpacity>
  );
};

export default SignInButton;
