import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const CircularProgress = ({ 
  size = 120, 
  strokeWidth = 6, 
  progress = 0, // 0 to 100
  backgroundColor = '#e0e0e0',
  progressColor = '#2196F3',
  warningColor = '#ff4444'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  
  // Calculate stroke dash offset for clockwise progress starting at 12 o'clock
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  // Determine color based on progress (red when <= 10%)
  const currentColor = progress <= 10 ? warningColor : progressColor;

  return (
    <View style={{ width: size, height: size, position: 'absolute', top: 0, left: 0 }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={currentColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

export default CircularProgress;