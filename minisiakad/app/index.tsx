import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

type MCIconName = React.ComponentProps<typeof Icon>['name'];

const { width, height } = Dimensions.get('window');

// Responsive design helper
const isMobile = width < 768;
const isTablet = width >= 768 && width < 1024;
const isDesktop = width >= 1024;

const getRespValue = (mobileVal: number, tabletVal: number, desktopVal: number) => {
  if (isMobile) return mobileVal;
  if (isTablet) return tabletVal;
  return desktopVal;
};

const statsData: { value: string; label: string; icon: MCIconName }[] = [
  { value: '25,000+', label: 'Active Students', icon: 'account-group' as MCIconName },
  { value: '1,200+', label: 'Faculty Members', icon: 'school' as MCIconName },
  { value: '85+', label: 'Study Programs', icon: 'book-open-variant' as MCIconName },
  { value: 'A', label: 'Accreditation', icon: 'trophy' as MCIconName },
];

const featuresData: { icon: MCIconName; title: string; desc: string }[] = [
  { icon: 'calendar-clock' as MCIconName, title: 'Smart Scheduling', desc: 'AI-powered class scheduling with conflict detection and automatic optimization' },
  { icon: 'file-document' as MCIconName, title: 'Digital Transcript', desc: 'Real-time academic records with comprehensive performance analytics' },
  { icon: 'bell-ring' as MCIconName, title: 'Smart Notifications', desc: 'Personalized alerts for important academic updates and deadlines' },
  { icon: 'chart-line' as MCIconName, title: 'Performance Analytics', desc: 'Comprehensive dashboard with detailed academic insights and trends' },
  { icon: 'message-text' as MCIconName, title: 'Integrated Messaging', desc: 'Seamless communication platform for students and faculty' },
  { icon: 'cog' as MCIconName, title: 'Customizable Interface', desc: 'Personalized experience tailored to individual preferences' },
];

const testimonialsData = [
  { 
    name: 'Prof. Dr. Ahmad Wijaya', 
    role: 'University Rector', 
    text: 'This system has completely transformed our academic management processes. The efficiency improvements are remarkable, with a documented 300% increase in administrative productivity.',
    initial: 'AW'
  },
  { 
    name: 'Dr. Sarah Chen', 
    role: 'Faculty of Engineering', 
    text: 'The intuitive grading interface and real-time synchronization capabilities have revolutionized how we manage student assessments. It is a game-changer for academic administration.',
    initial: 'SC'
  },
  { 
    name: 'Michael Anderson', 
    role: '4th Year Computer Science', 
    text: 'Having everything from course schedules to academic transcripts in one unified platform has significantly improved my time management and academic performance tracking.',
    initial: 'MA'
  },
];

type QuickLinkRoute = '/schedule' | '/transcript' | '/courses' | '/community';

const quickLinksData: { icon: MCIconName; label: string; route: QuickLinkRoute }[] = [
  { icon: 'calendar-text' as MCIconName, label: 'Schedule', route: '/schedule' },
  { icon: 'file-document' as MCIconName, label: 'Transcript', route: '/transcript' },
  { icon: 'book-open' as MCIconName, label: 'Courses', route: '/courses' },
  { icon: 'account-group' as MCIconName, label: 'Community', route: '/community' },
];

export default function LandingPage() {
  const router = useRouter();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { isDarkMode, toggleTheme } = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Navigation handler
  const navigateToLogin = () => {
    console.log('Navigating to login...');
    setTimeout(() => {
      router.push('/login');
    }, 100);
  };
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // Feature cards animation
  const featureAnims = useRef(
    featuresData.map(() => ({
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
    }))
  ).current;

  // Stats animation
  const statsAnims = useRef(
    statsData.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Initial entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Stats counter animation
    statsAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 1000,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonialsData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [-100, 0],
    extrapolate: 'clamp',
  });

  const heroScale = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const heroOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleFeaturePress = (index: number) => {
    Animated.sequence([
      Animated.timing(featureAnims[index].scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(featureAnims[index].scale, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={isDarkMode ? {...styles.container, ...styles.containerDark} : styles.container}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={isDarkMode ? "#0a0e27" : "#FFFFFF"} 
      />
      
      {/* Floating Header */}
      <Animated.View style={[
        isDarkMode ? {...styles.floatingHeader, ...styles.floatingHeaderDark} : styles.floatingHeader,
        {
          opacity: headerOpacity,
          transform: [{ translateY: headerTranslateY }]
        }
      ]}>
        <View style={styles.floatingHeaderContent}>
          <View style={styles.floatingHeaderLeft}>
            <View style={styles.headerIcon}>
              <Icon name="school" size={24} color="#FFFFFF" />
            </View>
            <Text style={isDarkMode ? {...styles.floatingHeaderTitle, ...styles.floatingHeaderTitleDark} : styles.floatingHeaderTitle}>DZ University</Text>
          </View>
          <View style={styles.floatingHeaderRight}>
            <TouchableOpacity 
              style={styles.themeToggleButton}
              onPress={() => toggleTheme()}
              activeOpacity={0.7}
            >
              <Icon 
                name={isDarkMode ? 'white-balance-sunny' : 'moon-waning-crescent'} 
                size={20} 
                color={isDarkMode ? '#fbbf24' : '#667eea'} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.floatingLoginButton}
              onPress={navigateToLogin}
              activeOpacity={0.6}
            >
              <Text style={styles.floatingLoginText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section - Modern Card Design */}
        <View style={isDarkMode ? {...styles.heroSection, ...styles.heroSectionDark} : styles.heroSection}>
          <View style={styles.heroGrid}>
            {/* Left Column - Content */}
            <View style={styles.heroLeft}>
              <Animated.View style={[
                styles.heroTextBlock,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}>
                <View style={isDarkMode ? {...styles.heroBadgeNew, ...styles.heroBadgeNewDark} : styles.heroBadgeNew}>
                  <Icon name="lightning-bolt" size={14} color={isDarkMode ? "#60a5fa" : "#667eea"} />
                  <Text style={isDarkMode ? {...styles.heroBadgeTextNew, ...styles.heroBadgeTextNewDark} : styles.heroBadgeTextNew}>Transforming Education Since 1978</Text>
                </View>

                <Text style={isDarkMode ? {...styles.heroTitleNew, ...styles.heroTitleNewDark} : styles.heroTitleNew}>
                  Next-Generation{'\n'}
                  <Text style={isDarkMode ? {...styles.gradientText, ...styles.gradientTextDark} : styles.gradientText}>Academic Platform</Text>
                </Text>

                <Text style={isDarkMode ? {...styles.heroDescNew, ...styles.heroDescNewDark} : styles.heroDescNew}>
                  Streamline academic management with real-time analytics, intelligent scheduling, and seamless communication between students and faculty.
                </Text>

                <View style={styles.statsGridHorizontal}>
                  {statsData.map((stat, index) => (
                    <Animated.View 
                      key={index}
                      style={[
                        styles.statItemHorizontal,
                        {
                          opacity: statsAnims[index],
                          transform: [{
                            translateY: statsAnims[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: [15, 0],
                            })
                          }]
                        }
                      ]}
                    >
                      <View style={styles.statIconBox}>
                        <Icon name={stat.icon} size={20} color="#667eea" />
                      </View>
                      <View style={styles.statTextBlock}>
                        <Text style={styles.statValueNew}>{stat.value}</Text>
                        <Text style={styles.statLabelNew}>{stat.label}</Text>
                      </View>
                    </Animated.View>
                  ))}
                </View>

                <Animated.View style={[
                  styles.heroButtonsNew,
                  { opacity: fadeAnim }
                ]}>
                  <TouchableOpacity 
                    style={styles.primaryButtonNew}
                    onPress={() => {
                      setTimeout(() => {
                        router.push('/login');
                      }, 100);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.primaryButtonTextNew}>Student Access</Text>
                    <Icon name="arrow-right" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.secondaryButtonNew}
                    onPress={() => {
                      setTimeout(() => {
                        router.push('/login');
                      }, 100);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.secondaryButtonTextNew}>Faculty Portal</Text>
                  </TouchableOpacity>
                </Animated.View>
              </Animated.View>
            </View>

            {/* Right Column - Visual Card */}
            <View style={styles.heroRight}>
              <Animated.View style={[
                styles.heroCard,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }]
                }
              ]}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.heroCardGradient}
                >
                  <View style={styles.cardPattern1} />
                  <View style={styles.cardPattern2} />
                  
                  <View style={styles.heroCardContent}>
                    <View style={styles.logoCircleNew}>
                      <Icon name="school" size={56} color="#FFFFFF" />
                    </View>
                    
                    <Text style={styles.universityNameNew}>DZ University</Text>
                    <Text style={styles.universitySubtitleNew}>Academic Management System</Text>
                    
                    <View style={styles.featureBullets}>
                      <View style={styles.bulletItem}>
                        <Icon name="check-circle" size={16} color="#FFFFFF" />
                        <Text style={styles.bulletText}>Real-time Data Sync</Text>
                      </View>
                      <View style={styles.bulletItem}>
                        <Icon name="check-circle" size={16} color="#FFFFFF" />
                        <Text style={styles.bulletText}>Smart Analytics</Text>
                      </View>
                      <View style={styles.bulletItem}>
                        <Icon name="check-circle" size={16} color="#FFFFFF" />
                        <Text style={styles.bulletText}>Secure Access</Text>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </Animated.View>
            </View>
          </View>
        </View>

        {/* Quick Access */}
        <View style={isDarkMode ? {...styles.quickAccessSection, ...styles.quickAccessSectionDark} : styles.quickAccessSection}>
          <View style={styles.quickLinksGrid}>
            {quickLinksData.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={isDarkMode ? {...styles.quickLink, ...styles.quickLinkDark} : styles.quickLink}
                activeOpacity={0.7}
                onPress={() => {
                  setTimeout(() => {
                    router.push(link.route as any);
                  }, 100);
                }}
              >
                <View style={styles.quickLinkIconContainer}>
                  <Icon name={link.icon} size={28} color={isDarkMode ? "#FFFFFF" : "#334155"} />
                </View>
                <Text style={isDarkMode ? {...styles.quickLinkLabel, ...styles.quickLinkLabelDark} : styles.quickLinkLabel}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Features Section - Card Grid */}
        <View style={isDarkMode ? {...styles.featuresSectionNew, ...styles.featuresSectionNewDark} : styles.featuresSectionNew}>
          <View style={styles.sectionHeaderNew}>
            <View style={isDarkMode ? {...styles.sectionBadge, ...styles.sectionBadgeDark} : styles.sectionBadge}>
              <Icon name={'sparkles' as MCIconName} size={16} color={isDarkMode ? "#60a5fa" : "#667eea"} />
              <Text style={isDarkMode ? {...styles.sectionBadgeText, ...styles.sectionBadgeTextDark} : styles.sectionBadgeText}>CAPABILITIES</Text>
            </View>
            <Text style={isDarkMode ? {...styles.sectionTitle, ...styles.sectionTitleDark} : styles.sectionTitle}>Powerful Features</Text>
            <Text style={isDarkMode ? {...styles.sectionSubtitle, ...styles.sectionSubtitleDark} : styles.sectionSubtitle}>Everything you need in one integrated platform</Text>
          </View>

          <View style={styles.featureCardsGrid}>
            {featuresData.map((feature, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.featureCardNew,
                  {
                    transform: [{ scale: featureAnims[index].scale }],
                    opacity: featureAnims[index].opacity,
                  }
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleFeaturePress(index)}
                  style={isDarkMode ? {...styles.featureCardTouchable, ...styles.featureCardTouchableDark} : styles.featureCardTouchable}
                >
                  <View style={isDarkMode ? {...styles.featureIconNew, ...styles.featureIconNewDark} : styles.featureIconNew}>
                    <Icon name={feature.icon} size={28} color={isDarkMode ? "#60a5fa" : "#667eea"} />
                  </View>
                  
                  <Text style={isDarkMode ? {...styles.featureTitleNew, ...styles.featureTitleNewDark} : styles.featureTitleNew}>{feature.title}</Text>
                  <Text style={isDarkMode ? {...styles.featureDescNew, ...styles.featureDescNewDark} : styles.featureDescNew}>{feature.desc}</Text>
                  
                  <View style={styles.featureArrow}>
                    <Icon name="arrow-top-right" size={18} color={isDarkMode ? "#60a5fa" : "#667eea"} />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Testimonials - Slider Style */}
        <LinearGradient
          colors={isDarkMode ? ['#0f172a', '#0a0e27'] : ['#f8fafc', '#f1f5f9']}
          style={styles.testimonialSectionNew}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.sectionHeaderNew}>
            <View style={isDarkMode ? {...styles.sectionBadge, ...styles.sectionBadgeDark} : styles.sectionBadge}>
              <Icon name={'chat-quote' as MCIconName} size={16} color={isDarkMode ? "#60a5fa" : "#667eea"} />
              <Text style={isDarkMode ? {...styles.sectionBadgeText, ...styles.sectionBadgeTextDark} : styles.sectionBadgeText}>SUCCESS STORIES</Text>
            </View>
            <Text style={isDarkMode ? {...styles.sectionTitle, ...styles.sectionTitleDark} : styles.sectionTitle}>Voices of Success</Text>
            <Text style={isDarkMode ? {...styles.sectionSubtitle, ...styles.sectionSubtitleDark} : styles.sectionSubtitle}>Hear from our community members</Text>
          </View>

          <View style={styles.testimonialCardsWrapper}>
            <View style={isDarkMode ? {...styles.testimonialCardNew, ...styles.testimonialCardNewDark} : styles.testimonialCardNew}>
              <View style={styles.testimonialHeader}>
                <View style={styles.testimonialAvatarNew}>
                  <Text style={styles.avatarTextNew}>
                    {testimonialsData[activeTestimonial].initial}
                  </Text>
                </View>
                <View style={styles.testimonialHeaderRight}>
                  <Text style={isDarkMode ? {...styles.testimonialNameNew, ...styles.testimonialNameNewDark} : styles.testimonialNameNew}>
                    {testimonialsData[activeTestimonial].name}
                  </Text>
                  <Text style={isDarkMode ? {...styles.testimonialRoleNew, ...styles.testimonialRoleNewDark} : styles.testimonialRoleNew}>
                    {testimonialsData[activeTestimonial].role}
                  </Text>
                </View>
              </View>

              <View style={styles.starsContainerNew}>
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="star" size={16} color="#fbbf24" />
                ))}
              </View>

              <Text style={isDarkMode ? {...styles.testimonialTextNew, ...styles.testimonialTextNewDark} : styles.testimonialTextNew}>
                "{testimonialsData[activeTestimonial].text}"
              </Text>
            </View>

            {/* Navigation Dots */}
            <View style={styles.testimonialDotsNew}>
              {testimonialsData.map((_, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setActiveTestimonial(idx)}
                  activeOpacity={0.7}
                  style={[
                    styles.dotNew,
                    activeTestimonial === idx && styles.activeDotNew
                  ]}
                />
              ))}
            </View>
          </View>
        </LinearGradient>

        {/* CTA Section - Modern Split Layout */}
        <View style={isDarkMode ? {...styles.ctaSectionNew, ...styles.ctaSectionNewDark} : styles.ctaSectionNew}>
          <View style={styles.ctaInnerNew}>
            {/* Left Content */}
            <View style={styles.ctaLeftNew}>
              <View style={styles.ctaIconNew}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.ctaIconGradient}
                >
                  <Icon name="rocket" size={40} color="#FFFFFF" />
                </LinearGradient>
              </View>
              <Text style={isDarkMode ? {...styles.ctaTitleNew, ...styles.ctaTitleNewDark} : styles.ctaTitleNew}>Ready to Transform?</Text>
              <Text style={isDarkMode ? {...styles.ctaDescNew, ...styles.ctaDescNewDark} : styles.ctaDescNew}>
                Join thousands of institutions using our platform to streamline academic management and enhance student experience.
              </Text>
            </View>

            {/* Right Buttons */}
            <View style={styles.ctaButtonsNew}>
              <TouchableOpacity 
                style={styles.ctaPrimaryNew}
                onPress={() => {
                  setTimeout(() => {
                    router.push('/login');
                  }, 100);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.ctaButtonInner}>
                  <Icon name="account-school" size={20} color="#667eea" />
                  <View style={styles.ctaButtonText}>
                    <Text style={styles.ctaButtonLabel}>Student Portal</Text>
                    <Text style={styles.ctaButtonDesc}>Access courses & grades</Text>
                  </View>
                </View>
                <Icon name="arrow-right" size={20} color="#667eea" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.ctaSecondaryNew}
                onPress={() => {
                  setTimeout(() => {
                    router.push('/login');
                  }, 100);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.ctaButtonInner}>
                  <Icon name="account-tie" size={20} color="#FFFFFF" />
                  <View style={styles.ctaButtonText}>
                    <Text style={styles.ctaButtonLabelAlt}>Faculty Portal</Text>
                    <Text style={styles.ctaButtonDescAlt}>Manage courses & students</Text>
                  </View>
                </View>
                <Icon name="arrow-right" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer - Modern Design */}
        <LinearGradient
          colors={['#0f172a', '#1a1f3a']}
          style={styles.footerNew}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.footerContentNew}>
            {/* Top Section - Brand & Newsletter */}
            <View style={styles.footerTopSection}>
              <View style={styles.footerBrandSectionNew}>
                <View style={styles.footerLogoCircle}>
                  <Icon name="school" size={32} color="#667eea" />
                </View>
                <View style={styles.footerBrandText}>
                  <Text style={styles.footerBrandNameNew}>DZ University</Text>
                  <Text style={styles.footerBrandDescNew}>Academic Information System</Text>
                </View>
              </View>

              <View style={styles.footerNewsletterBox}>
                <Text style={styles.footerNewsletterTitle}>Stay Updated</Text>
                <Text style={styles.footerNewsletterDesc}>Get latest news and updates</Text>
                <View style={styles.footerNewsletterForm}>
                  <View style={styles.footerInputContainer}>
                    <Icon name="email-outline" size={16} color="#667eea" />
                    <Text style={styles.footerInputPlaceholder}>your@email.com</Text>
                  </View>
                  <TouchableOpacity style={styles.footerSubscribeButton}>
                    <Icon name="send" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Middle Section - Links Grid */}
            <View style={styles.footerLinksGrid}>
              <View style={styles.footerLinkGroup}>
                <Text style={styles.footerGroupTitle}>Product</Text>
                <Text style={styles.footerLinkItem}>Features</Text>
                <Text style={styles.footerLinkItem}>Pricing</Text>
                <Text style={styles.footerLinkItem}>Security</Text>
                <Text style={styles.footerLinkItem}>Updates</Text>
              </View>

              <View style={styles.footerLinkGroup}>
                <Text style={styles.footerGroupTitle}>Company</Text>
                <Text style={styles.footerLinkItem}>About Us</Text>
                <Text style={styles.footerLinkItem}>Blog</Text>
                <Text style={styles.footerLinkItem}>Careers</Text>
                <Text style={styles.footerLinkItem}>Contact</Text>
              </View>

              <View style={styles.footerLinkGroup}>
                <Text style={styles.footerGroupTitle}>Resources</Text>
                <Text style={styles.footerLinkItem}>Documentation</Text>
                <Text style={styles.footerLinkItem}>API Reference</Text>
                <Text style={styles.footerLinkItem}>Support</Text>
                <Text style={styles.footerLinkItem}>Community</Text>
              </View>

              <View style={styles.footerLinkGroup}>
                <Text style={styles.footerGroupTitle}>Connect</Text>
                <View style={styles.footerSocialLinks}>
                  <TouchableOpacity style={styles.footerSocialIcon}>
                    <Icon name="facebook" size={18} color="#667eea" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerSocialIcon}>
                    <Icon name="twitter" size={18} color="#667eea" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerSocialIcon}>
                    <Icon name="linkedin" size={18} color="#667eea" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerSocialIcon}>
                    <Icon name="instagram" size={18} color="#667eea" />
                  </TouchableOpacity>
                </View>
                <View style={styles.footerContactInfo}>
                  <View style={styles.footerContactItem}>
                    <Icon name="phone" size={14} color="#60a5fa" />
                    <Text style={styles.footerContactText}>+62 21 1234 5678</Text>
                  </View>
                  <View style={styles.footerContactItem}>
                    <Icon name="email" size={14} color="#60a5fa" />
                    <Text style={styles.footerContactText}>info@dzuniversity.ac.id</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Bottom Section - Copyright & Links */}
            <View style={styles.footerBottomSectionNew}>
              <View style={styles.footerBottomDivider} />
              <View style={styles.footerBottomContent}>
                <Text style={styles.footerCopyrightNew}>
                  © 2024 DZ University. All rights reserved.
                </Text>
                <View style={styles.footerLegalLinks}>
                  <Text style={styles.footerLegalLink}>Privacy Policy</Text>
                  <Text style={styles.footerLegalDot}>•</Text>
                  <Text style={styles.footerLegalLink}>Terms of Service</Text>
                  <Text style={styles.footerLegalDot}>•</Text>
                  <Text style={styles.footerLegalLink}>Cookie Policy</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#0a0e27',
  },
  scrollView: {
    flex: 1,
  },
  
  // Floating Header
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  floatingHeaderDark: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
  },
  floatingHeaderContent: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  floatingHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  floatingHeaderTitleDark: {
    color: '#FFFFFF',
  },
  floatingLoginButton: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  floatingLoginText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  floatingHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeToggleButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(102, 126, 234, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  
  // Hero Section - New Modern Design
  heroSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: isMobile ? 40 : 60,
    paddingHorizontal: isMobile ? 16 : 24,
  },
  heroSectionDark: {
    backgroundColor: '#0a0e27',
  },
  heroGrid: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? 32 : 48,
    alignItems: isMobile ? 'center' : 'center',
  },
  heroLeft: {
    flex: 1,
    width: isMobile ? '100%' : 'auto',
  },
  heroRight: {
    flex: 1,
    width: isMobile ? '100%' : 'auto',
  },
  heroTextBlock: {
    gap: 24,
  },
  heroBadgeNew: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  heroBadgeNewDark: {
    backgroundColor: 'rgba(102, 126, 234, 0.15)',
  },
  heroBadgeTextNew: {
    fontSize: isMobile ? 11 : 12,
    fontWeight: '600',
    color: '#334155',
    letterSpacing: 0.5,
  },
  heroBadgeTextNewDark: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  heroTitleNew: {
    fontSize: isMobile ? 28 : 40,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: isMobile ? 36 : 50,
  },
  heroTitleNewDark: {
    color: '#FFFFFF',
  },
  gradientText: {
    color: '#667eea',
  },
  gradientTextDark: {
    color: '#60a5fa',
  },
  heroDescNew: {
    fontSize: isMobile ? 14 : 16,
    color: '#64748b',
    lineHeight: isMobile ? 22 : 26,
  },
  heroDescNewDark: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statsGridHorizontal: {
    gap: isMobile ? 12 : 16,
  },
  statItemHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isMobile ? 10 : 14,
    backgroundColor: '#f8fafc',
    paddingVertical: isMobile ? 12 : 14,
    paddingHorizontal: isMobile ? 12 : 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statIconBox: {
    width: isMobile ? 36 : 40,
    height: isMobile ? 36 : 40,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  statTextBlock: {
    flex: 1,
  },
  statValueNew: {
    fontSize: isMobile ? 14 : 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  statLabelNew: {
    fontSize: isMobile ? 11 : 12,
    color: '#64748b',
  },
  heroButtonsNew: {
    gap: isMobile ? 10 : 12,
    marginTop: 8,
    flexDirection: isMobile ? 'column' : 'row',
  },
  primaryButtonNew: {
    backgroundColor: '#667eea',
    paddingVertical: isMobile ? 14 : 16,
    paddingHorizontal: isMobile ? 20 : 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 5,
  },
  primaryButtonTextNew: {
    fontSize: isMobile ? 14 : 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButtonNew: {
    backgroundColor: '#FFFFFF',
    paddingVertical: isMobile ? 14 : 16,
    paddingHorizontal: isMobile ? 20 : 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonTextNew: {
    fontSize: isMobile ? 14 : 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  heroCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 10,
    width: isMobile ? '100%' : 'auto',
  },
  heroCardGradient: {
    paddingVertical: isMobile ? 30 : 40,
    paddingHorizontal: isMobile ? 24 : 32,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  cardPattern1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: isMobile ? 150 : 200,
    height: isMobile ? 150 : 200,
    borderRadius: isMobile ? 75 : 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardPattern2: {
    position: 'absolute',
    bottom: isMobile ? -80 : -100,
    left: -50,
    width: isMobile ? 200 : 250,
    height: isMobile ? 200 : 250,
    borderRadius: isMobile ? 100 : 125,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  heroCardContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoCircleNew: {
    width: isMobile ? 64 : 80,
    height: isMobile ? 64 : 80,
    borderRadius: isMobile ? 32 : 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isMobile ? 16 : 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  universityNameNew: {
    fontSize: isMobile ? 20 : 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  universitySubtitleNew: {
    fontSize: isMobile ? 12 : 14,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: isMobile ? 16 : 24,
  },
  featureBullets: {
    gap: isMobile ? 10 : 12,
    width: '100%',
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isMobile ? 8 : 10,
    paddingHorizontal: 12,
  },
  bulletText: {
    fontSize: isMobile ? 12 : 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  
  // Features Section - New Design
  featuresSectionNew: {
    paddingVertical: isMobile ? 40 : 60,
    paddingHorizontal: isMobile ? 16 : 24,
    backgroundColor: '#FFFFFF',
  },
  featuresSectionNewDark: {
    backgroundColor: '#0a0e27',
  },
  sectionHeaderNew: {
    marginBottom: isMobile ? 30 : 40,
    alignItems: 'center',
  },
  featureCardsGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isMobile ? 12 : 16,
    justifyContent: 'center',
  },
  featureCardNew: {
    width: isMobile ? '100%' : '48%',
    minWidth: isMobile ? 'auto' : 160,
  },
  featureCardTouchable: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: isMobile ? 16 : 24,
    paddingTop: isMobile ? 20 : 32,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: '100%',
  },
  featureCardTouchableDark: {
    backgroundColor: '#1a1f3a',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureIconNew: {
    width: isMobile ? 40 : 48,
    height: isMobile ? 40 : 48,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isMobile ? 12 : 16,
  },
  featureIconNewDark: {
    backgroundColor: 'rgba(102, 126, 234, 0.15)',
  },
  featureTitleNew: {
    fontSize: isMobile ? 14 : 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  featureTitleNewDark: {
    color: '#FFFFFF',
  },
  featureDescNew: {
    fontSize: isMobile ? 12 : 13,
    color: '#64748b',
    lineHeight: isMobile ? 16 : 18,
    marginBottom: 16,
    flex: 1,
  },
  featureDescNewDark: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  featureArrow: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Testimonials - New Design
  testimonialSectionNew: {
    paddingVertical: isMobile ? 40 : 60,
    paddingHorizontal: isMobile ? 16 : 24,
    backgroundColor: '#f8fafc',
  },
  testimonialSectionNewDark: {
    backgroundColor: '#0f172a',
  },
  testimonialCardsWrapper: {
    gap: isMobile ? 24 : 32,
  },
  testimonialCardNew: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: isMobile ? 24 : 32,
    paddingHorizontal: isMobile ? 20 : 28,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  testimonialCardNewDark: {
    backgroundColor: '#1a1f3a',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isMobile ? 12 : 16,
    marginBottom: 20,
  },
  testimonialAvatarNew: {
    width: isMobile ? 48 : 56,
    height: isMobile ? 48 : 56,
    borderRadius: isMobile ? 24 : 28,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTextNew: {
    fontSize: isMobile ? 16 : 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  testimonialHeaderRight: {
    flex: 1,
  },
  testimonialNameNew: {
    fontSize: isMobile ? 14 : 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  testimonialNameNewDark: {
    color: '#FFFFFF',
  },
  testimonialRoleNew: {
    fontSize: isMobile ? 12 : 13,
    color: '#64748b',
  },
  testimonialRoleNewDark: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  starsContainerNew: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 16,
  },
  testimonialTextNew: {
    fontSize: isMobile ? 13 : 15,
    color: '#334155',
    lineHeight: isMobile ? 20 : 24,
    fontStyle: 'italic',
  },
  testimonialTextNewDark: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  testimonialDotsNew: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  dotNew: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cbd5e1',
  },
  activeDotNew: {
    backgroundColor: '#667eea',
    width: 24,
  },
  
  // CTA Section - New Design
  ctaSectionNew: {
    paddingVertical: isMobile ? 40 : 60,
    paddingHorizontal: isMobile ? 16 : 24,
    backgroundColor: '#f8fafc',
  },
  ctaSectionNewDark: {
    backgroundColor: '#0f172a',
  },
  ctaInnerNew: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? 32 : 48,
    alignItems: isMobile ? 'center' : 'center',
  },
  ctaLeftNew: {
    flex: 1,
    gap: 20,
    width: isMobile ? '100%' : 'auto',
    alignItems: isMobile ? 'center' : 'flex-start',
  },
  ctaTitleNew: {
    fontSize: isMobile ? 24 : 32,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: isMobile ? 'center' : 'left',
  },
  ctaTitleNewDark: {
    color: '#FFFFFF',
  },
  ctaDescNew: {
    fontSize: isMobile ? 14 : 15,
    color: '#64748b',
    lineHeight: 24,
    textAlign: isMobile ? 'center' : 'left',
  },
  ctaDescNewDark: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  ctaIconNew: {
    width: 64,
    height: 64,
    borderRadius: 16,
    overflow: 'hidden',
  },
  ctaIconGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaButtonsNew: {
    flex: isMobile ? 0 : 1,
    gap: isMobile ? 10 : 12,
    width: isMobile ? '100%' : 'auto',
    flexDirection: isMobile ? 'column' : 'column',
  },
  ctaPrimaryNew: {
    backgroundColor: '#667eea',
    paddingVertical: isMobile ? 12 : 16,
    paddingHorizontal: isMobile ? 16 : 20,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaSecondaryNew: {
    backgroundColor: '#0f172a',
    paddingVertical: isMobile ? 12 : 16,
    paddingHorizontal: isMobile ? 16 : 20,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isMobile ? 10 : 12,
    flex: 1,
  },
  ctaButtonText: {
    gap: 4,
  },
  ctaButtonLabel: {
    fontSize: isMobile ? 13 : 15,
    fontWeight: '700',
    color: '#667eea',
  },
  ctaButtonDesc: {
    fontSize: isMobile ? 11 : 12,
    color: '#64748b',
  },
  ctaButtonLabelAlt: {
    fontSize: isMobile ? 13 : 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ctaButtonDescAlt: {
    fontSize: isMobile ? 11 : 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  
  // Quick Access
  quickAccessSection: {
    padding: isMobile ? 16 : 24,
    backgroundColor: '#f8fafc',
  },
  quickAccessSectionDark: {
    backgroundColor: '#0f172a',
  },
  quickLinksGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: isMobile ? 8 : 12,
  },
  quickLink: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: isMobile ? 14 : 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickLinkDark: {
    backgroundColor: '#1a1f3a',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickLinkIconContainer: {
    marginBottom: isMobile ? 8 : 12,
  },
  quickLinkLabel: {
    fontSize: isMobile ? 11 : 12,
    color: '#334155',
    fontWeight: '600',
    textAlign: 'center',
  },
  quickLinkLabelDark: {
    color: '#FFFFFF',
  },
  
  // Features Section
  featuresSection: {
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  sectionHeader: {
    marginBottom: 32,
    alignItems: 'center',
  },
  sectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionBadgeText: {
    fontSize: isMobile ? 10 : 11,
    fontWeight: '600',
    color: '#334155',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: isMobile ? 22 : 28,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: isMobile ? 13 : 15,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: isMobile ? 10 : 20,
  },
  sectionBadgeDark: {
    backgroundColor: 'rgba(102, 126, 234, 0.15)',
  },
  sectionBadgeTextDark: {
    color: '#60a5fa',
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  sectionSubtitleDark: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  // Testimonials
  testimonialSection: {
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  // CTA Section
  ctaSection: {
    padding: 40,
    position: 'relative',
    overflow: 'hidden',
  },
  
  // Footer - New Modern Design
  footerNew: {
    paddingVertical: isMobile ? 40 : 60,
    paddingHorizontal: isMobile ? 16 : 24,
  },
  footerContentNew: {
    gap: isMobile ? 30 : 40,
  },
  footerTopSection: {
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: isMobile ? 'flex-start' : 'space-between',
    alignItems: isMobile ? 'flex-start' : 'flex-start',
    gap: isMobile ? 24 : 40,
    paddingBottom: isMobile ? 30 : 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerBrandSectionNew: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: isMobile ? '100%' : 'auto',
  },
  footerLogoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(102, 126, 234, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  footerBrandText: {
    gap: 4,
  },
  footerBrandNameNew: {
    fontSize: isMobile ? 16 : 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footerBrandDescNew: {
    fontSize: isMobile ? 12 : 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  footerNewsletterBox: {
    flex: 1,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 16,
    padding: isMobile ? 16 : 20,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.2)',
    gap: 12,
    width: isMobile ? '100%' : 'auto',
  },
  footerNewsletterTitle: {
    fontSize: isMobile ? 14 : 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footerNewsletterDesc: {
    fontSize: isMobile ? 12 : 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  footerNewsletterForm: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? 10 : 8,
    alignItems: 'stretch',
  },
  footerInputContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: isMobile ? 12 : 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerInputPlaceholder: {
    fontSize: isMobile ? 12 : 13,
    color: 'rgba(255, 255, 255, 0.5)',
    flex: 1,
  },
  footerSubscribeButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 16,
    paddingVertical: isMobile ? 12 : 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLinksGrid: {
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    gap: isMobile ? 20 : 32,
  },
  footerLinkGroup: {
    flex: 1,
    gap: 14,
  },
  footerGroupTitle: {
    fontSize: isMobile ? 13 : 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  footerLinkItem: {
    fontSize: isMobile ? 12 : 13,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 20,
  },
  footerSocialLinks: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  footerSocialIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(102, 126, 234, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.2)',
  },
  footerContactInfo: {
    gap: 10,
    marginTop: 14,
  },
  footerContactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerContactText: {
    fontSize: isMobile ? 11 : 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  footerBottomSectionNew: {
    gap: 16,
  },
  footerBottomDivider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerBottomContent: {
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: isMobile ? 'center' : 'space-between',
    alignItems: isMobile ? 'center' : 'center',
    paddingTop: 16,
    gap: isMobile ? 12 : 0,
  },
  footerCopyrightNew: {
    fontSize: isMobile ? 12 : 13,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: isMobile ? 'center' : 'left',
  },
  footerLegalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: isMobile ? 'center' : 'flex-start',
    flexWrap: 'wrap',
  },
  footerLegalLink: {
    fontSize: isMobile ? 11 : 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  footerLegalDot: {
    fontSize: isMobile ? 11 : 12,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  
  // Footer
  footer: {
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
});
