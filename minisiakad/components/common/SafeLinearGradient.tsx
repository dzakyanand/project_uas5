import React from 'react';
import { Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SafeLinearGradientProps {
  colors: string[];
  style?: any;
  children?: React.ReactNode;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

const SafeLinearGradient: React.FC<SafeLinearGradientProps> = ({ 
  colors, 
  style, 
  children,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 }
}) => {
  // Di web, kadang linear gradient bermasalah
  if (Platform.OS === 'web') {
    return (
      <div style={{
        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
        ...style
      }}>
        {children}
      </div>
    );
  }

  return (
    <LinearGradient
      colors={colors}
      style={style}
      start={start}
      end={end}
    >
      {children}
    </LinearGradient>
  );
};

export default SafeLinearGradient;