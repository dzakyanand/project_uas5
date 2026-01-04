import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'Mini SIAKAD',
  showBack = false,
  rightComponent 
}) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary[500]} barStyle="light-content" />
      <View style={styles.content}>
        {showBack ? (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🎓</Text>
          </View>
        )}
        
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        
        <View style={styles.rightContainer}>
          {rightComponent}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary[500],
    paddingTop: StatusBar.currentHeight,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logo: {
    fontSize: 20,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  rightContainer: {
    marginLeft: 'auto',
  },
});

export default Header;