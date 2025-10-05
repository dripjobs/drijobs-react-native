import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, SquareCheck as CheckSquare, FileText, Plus, Send, UserPlus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FloatingActionMenuProps {
  onNewAppointment?: () => void;
  isVisible?: boolean;
}

export default function FloatingActionMenu({ onNewAppointment, isVisible = true }: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [visibilityAnimation] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.timing(visibilityAnimation, {
      toValue: isVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    
    // Close menu when hiding
    if (!isVisible && isOpen) {
      setIsOpen(false);
      Animated.spring(animation, {
        toValue: 0,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    
    Animated.spring(animation, {
      toValue,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
    
    setIsOpen(!isOpen);
  };

  const getButtonStyle = (index: number) => {
    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -70 * (index + 1)],
    });

    const scale = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return {
      transform: [{ translateY }, { scale }],
    };
  };

  const getRotation = () => {
    const rotate = animation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '45deg'],
    });

    return { transform: [{ rotate }] };
  };

  const menuItems = [
    { 
      icon: Calendar, 
      label: 'Create Appt',
      colors: ['#F59E0B', '#D97706'], 
      action: () => onNewAppointment?.() 
    },
    { 
      icon: CheckSquare, 
      label: 'Create Task',
      colors: ['#8B5CF6', '#A855F7'], 
      action: () => console.log('Create Task') 
    },
    { 
      icon: Send, 
      label: 'Send Request',
      colors: ['#6366F1', '#8B5CF6'], 
      action: () => console.log('Send Request') 
    },
    { 
      icon: FileText, 
      label: 'Create Proposal',
      colors: ['#10B981', '#059669'], 
      action: () => console.log('Create Proposal') 
    },
    { 
      icon: UserPlus, 
      label: 'Create Lead',
      colors: ['#EF4444', '#DC2626'], 
      action: () => console.log('Create Lead') 
    },
  ];

  const containerStyle = {
    opacity: visibilityAnimation,
    transform: [
      {
        scale: visibilityAnimation,
      },
      {
        translateY: visibilityAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {menuItems.map((item, index) => (
        <Animated.View key={index} style={[styles.menuItem, getButtonStyle(index)]}>
          <View style={styles.labelContainer} pointerEvents="none">
            <Text style={styles.labelText}>{item.label}</Text>
          </View>
          <TouchableOpacity
            style={styles.menuItemTouchable}
            onPress={() => {
              item.action();
              toggleMenu();
            }}
          >
            <LinearGradient
              colors={item.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.menuButton}
            >
              <item.icon size={24} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      ))}
      
      <TouchableOpacity style={styles.mainButton} onPress={toggleMenu}>
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mainButtonGradient}
        >
          <Animated.View style={getRotation()}>
            <Plus size={28} color="#FFFFFF" />
          </Animated.View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    alignItems: 'center',
    zIndex: 999,
    elevation: 999,
    overflow: 'visible',
  },
  mainButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  mainButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    position: 'absolute',
    bottom: 0,
    overflow: 'visible',
  },
  menuItemTouchable: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    right: 60,
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flexShrink: 0,
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 0,
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
});