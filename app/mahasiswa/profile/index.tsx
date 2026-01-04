import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  ActivityIndicator,
  PanResponder,
  Dimensions,
  Switch,
  GestureResponderEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, ActionSheetIOS } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useAuth } from '../../../contexts/AuthContext';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { useAppColors } from '../../../hooks/use-app-colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nama: user?.nama || '',
    email: user?.email || '',
    noHp: user?.noHp || '',
    alamat: user?.alamat || '',
    jenisKelamin: (user as any)?.jenisKelamin || '',
    aktifKampus: (user as any)?.aktifKampus ?? true,
    setujuSyarat: (user as any)?.setujuSyarat ?? false,
  });

  // Camera & Image states
  const cameraRef = useRef<any>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [CameraComponent, setCameraComponent] = useState<any>(null);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  
  // Crop states
  const [showCrop, setShowCrop] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [cropRegion, setCropRegion] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const scaleRef = useRef(1);
  const [rotation, setRotation] = useState(0);
  const [lastDistance, setLastDistance] = useState(0);
  const panResponder = useRef<any>(null);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Initialize PanResponder once
  useEffect(() => {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setLastDistance(0);
      },
      onPanResponderMove: (evt, gestureState) => {
        const touches = (evt as any).touches;
        
        // Pinch-to-zoom with two fingers
        if (touches && touches.length === 2) {
          const dx = touches[0].pageX - touches[1].pageX;
          const dy = touches[0].pageY - touches[1].pageY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (lastDistance > 0) {
            const scaleFactor = distance / lastDistance;
            const newScale = Math.max(0.5, Math.min(3, scaleRef.current * scaleFactor));
            setScale(newScale);
            scaleRef.current = newScale;
          }
          setLastDistance(distance);
        } else if (touches && touches.length === 1) {
          // Single finger drag
          const nx = offsetRef.current.x + gestureState.dx;
          const ny = offsetRef.current.y + gestureState.dy;
          setOffset({ x: nx, y: ny });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        offsetRef.current = { x: offsetRef.current.x + gestureState.dx, y: offsetRef.current.y + gestureState.dy };
        setLastDistance(0);
      },
      onPanResponderTerminate: (evt, gestureState) => {
        offsetRef.current = { x: offsetRef.current.x + gestureState.dx, y: offsetRef.current.y + gestureState.dy };
        setLastDistance(0);
      },
    });
  }, [lastDistance]);

  const handleSave = async () => {
    try {
      await updateUser(formData);
      setIsEditing(false);
      Alert.alert('Sukses', 'Profil berhasil diperbarui');
    } catch (error) {
      Alert.alert('Error', 'Gagal memperbarui profil');
    }
  };

  const colors = useAppColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface.secondary,
    },
    header: {
      paddingTop: 12,
      paddingBottom: 12,
      paddingHorizontal: 16,
      backgroundColor: 'transparent',
    },
    backButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary[600],
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    profileSection: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    profileImageWrapper: { position: 'relative', flexShrink: 0 },
    profileImageRing: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    profileImageContent: { width: '100%', height: '100%', borderRadius: 37 },
    profileImagePlaceholder: { width: '100%', height: '100%', borderRadius: 37, backgroundColor: colors.primary[100], justifyContent: 'center', alignItems: 'center' },
    editPhotoButton: {
      position: 'absolute',
      bottom: -2,
      right: -2,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primary[500],
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.surface.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 3,
    },
    profileTextContent: { flex: 1 },
    profileName: { fontSize: 18, fontWeight: '700', color: colors.text.primary, marginBottom: 2 },
    profileNim: { fontSize: 13, color: colors.text.secondary, marginBottom: 6 },
    profileBadge: { flexDirection: 'row', gap: 8 },
    profileBadgeItem: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: colors.primary[100], borderRadius: 12 },
    profileBadgeText: { fontSize: 11, color: colors.primary[700], fontWeight: '600' },
    contentSection: { padding: 16, paddingTop: 8 },
    card: { backgroundColor: colors.surface.card, borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3, borderWidth: 1, borderColor: colors.surface.tertiary },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: colors.primary[900] },
    editIconButton: { padding: 4 },
    form: { gap: 16 },
    infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    infoItem: { width: '48%', backgroundColor: colors.surface.secondary, padding: 14, borderRadius: 12 },
    infoItemFull: { width: '100%' },
    infoItemHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
    infoLabel: { fontSize: 12, color: colors.text.secondary, fontWeight: '500' },
    infoValue: { fontSize: 15, color: colors.text.primary, fontWeight: '600' },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    statCard: { width: '48%', backgroundColor: colors.surface.secondary, padding: 16, borderRadius: 16, alignItems: 'center' },
    statIconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    statValue: { fontSize: 24, fontWeight: 'bold', marginBottom: 4, color: colors.text.primary },
    statLabel: { fontSize: 12, color: colors.text.secondary, textAlign: 'center' },
    menuList: { gap: 0 },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.surface.tertiary },
    menuItemNoBorder: { borderBottomWidth: 0 },
    menuIconContainer: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface.secondary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    menuIconDanger: { backgroundColor: colors.error[50] },
    menuContent: { flex: 1 },
    menuTitle: { fontSize: 16, color: colors.text.primary, fontWeight: '600', marginBottom: 2 },
    menuTitleDanger: { color: colors.error[500] },
    menuSubtitle: { fontSize: 13, color: colors.text.secondary },
    menuSubtitleDanger: { color: colors.error[400] },
    footerSpace: { height: 40 },
    // Camera Modal
    cameraContainer: { flex: 1, backgroundColor: '#000' },
    camera: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
    loadingText: { color: '#fff', marginTop: 12, fontSize: 16 },
    cameraOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    closeButton: { position: 'absolute', top: 50, right: 20, width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    cameraControls: { position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' },
    captureButtonOuter: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
    captureButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
    captureButtonInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', borderWidth: 3, borderColor: '#000' },
    // Crop Modal
    cropContainer: { flex: 1, backgroundColor: '#1a1a1a' },
    cropHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 20, backgroundColor: 'rgba(0,0,0,0.8)' },
    cropHeaderButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
    cropHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
    cropImageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' },
    cropImage: { width: '100%', height: '100%' },
    cropOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
    cropCircle: { width: SCREEN_WIDTH * 0.75, height: SCREEN_WIDTH * 0.75, borderRadius: SCREEN_WIDTH * 0.375, borderWidth: 2, borderColor: '#fff', backgroundColor: 'transparent', shadowColor: '#fff', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 10 },
    cropFooter: { paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 32, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
    cropInstructions: { fontSize: 14, color: '#fff', fontWeight: '600', marginBottom: 4, textAlign: 'center' },
    cropSubInstructions: { fontSize: 12, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 12 },
    cropControlsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 },
    cropControlButton: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    cropControlButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
    gridContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-around', alignItems: 'stretch' },
    gridRow: { flex: 1, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.15)' },
    gridCell: { flex: 1, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.15)' },
  });

  const InfoItem = ({ icon, label, value, fullWidth = false }: any) => (
    <View style={[styles.infoItem, fullWidth && styles.infoItemFull]}>
      <View style={styles.infoItemHeader}>
        <Icon name={icon} size={16} color={colors.neutral[400]} />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue} numberOfLines={2}>{value}</Text>
    </View>
  );

  const AcademicStat = ({ icon, label, value, color }: any) => (
    <View style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '15' }]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const MenuItem = ({ icon, title, subtitle, onPress, danger = false, noBorder = false }: any) => (
    <TouchableOpacity 
      style={[styles.menuItem, noBorder && styles.menuItemNoBorder]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIconContainer, danger && styles.menuIconDanger]}>
        <Icon name={icon} size={22} color={danger ? colors.error[500] : colors.neutral[600]} />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuTitle, danger && styles.menuTitleDanger]}>{title}</Text>
        <Text style={[styles.menuSubtitle, danger && styles.menuSubtitleDanger]}>{subtitle}</Text>
      </View>
      <Icon name="chevron-right" size={20} color={colors.neutral[300]} />
    </TouchableOpacity>
  );


  const handleEditPhoto = () => {
    if (!user) return router.push('/login');

    if (Platform.OS === 'web') {
      webActionSheet().then((choice) => {
        if (choice === 'camera') openCamera();
        else if (choice === 'gallery') pickImage();
        else if (choice === 'remove') removePhoto();
      });
      return;
    }

    if (Platform.OS === 'ios' && ActionSheetIOS) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Ambil Gambar', 'Ambil dari Galeri', 'Hapus Foto', 'Batal'],
          cancelButtonIndex: 3,
          destructiveButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) openCamera();
          else if (buttonIndex === 1) pickImage();
          else if (buttonIndex === 2) removePhoto();
        }
      );
      return;
    }

    Alert.alert('Edit Foto Profil', 'Pilih tindakan', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus Foto', style: 'destructive', onPress: () => removePhoto() },
      { text: 'Ambil dari Galeri', onPress: () => pickImage() },
      { text: 'Ambil Gambar', onPress: () => openCamera() },
    ]);
  };

  const openCamera = async () => {
    if (!user) return router.push('/login');
    
    if (Platform.OS === 'web') {
      // Prefer an in-page camera capture on web for direct camera experience
      const uri = await webCameraCapture({ facingMode: 'environment' });
      if (uri) {
        setImageToCrop(uri);
        setShowCrop(true);
      }
      return;
    }

    try {
      setCameraLoading(true);
      const { Camera } = await import('expo-camera');

      const { status } = await Camera.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Izin Ditolak', 'Aplikasi memerlukan izin kamera.');
        setCameraLoading(false);
        return;
      }

      setCameraComponent(() => Camera);
      setShowCamera(true);
      setCameraLoading(false);
    } catch (err) {
      console.error('openCamera error', err);
      setCameraLoading(false);
      Alert.alert('Error', 'Kamera tidak tersedia. Silakan gunakan galeri.');
    }
  };

  // Immediate camera capture (opens native camera UI and saves directly)
  const takeImmediateFromCamera = async () => {
    if (!user) return router.push('/login');
    try {
      const ImagePicker = await import('expo-image-picker');

      // Request camera + media library permissions explicitly
      const camPerm = await ImagePicker.requestCameraPermissionsAsync?.() ?? { status: 'granted' };
      const libPerm = await ImagePicker.requestMediaLibraryPermissionsAsync?.() ?? { status: 'granted' };

      if (camPerm.status !== 'granted') {
        Alert.alert('Izin Ditolak', 'Aplikasi memerlukan izin kamera untuk mengambil foto.');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      // Debug log: lihat struktur hasil jika bermasalah
      console.log('launchCameraAsync result:', result);
      try { Alert.alert('DEBUG', JSON.stringify(Object.keys(result)).slice(0,200)); } catch(e){}

      // Robust uri extraction for various SDK versions
      let uri: string | null = null;
      if ((result as any)?.assets && (result as any).assets.length > 0) {
        uri = (result as any).assets[0].uri;
      } else if ((result as any).uri) {
        uri = (result as any).uri;
      } else if ('cancelled' in result && !(result as any).cancelled && (result as any).uri) {
        uri = (result as any).uri;
      }

      if (uri) {
        await updateUser({ foto: uri });
        Alert.alert('Sukses', 'Foto profil berhasil diperbarui');
      } else {
        console.log('No URI returned from launchCameraAsync, result:', result);
        // Jika tidak ada URI, kemungkinan sistem menampilkan chooser/galeri.
        // Buka fallback camera embedded untuk memastikan capture langsung.
        try {
          openCamera();
        } catch (e) {
          console.error('fallback openCamera error', e);
        }
      }
    } catch (err) {
      console.error('takeImmediateFromCamera error', err);
      Alert.alert('Error', 'Gagal membuka kamera');
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      if (photo?.uri) {
        setShowCamera(false);
        setImageToCrop(photo.uri);
        setShowCrop(true);
      }
    } catch (err) {
      console.error('takePicture error', err);
      Alert.alert('Error', 'Gagal mengambil gambar');
    }
  };

  const pickImage = async () => {
    try {
      if (Platform.OS === 'web') {
        const uri = await webFilePicker({ capture: false });
        if (uri) {
          setImageToCrop(uri);
          setShowCrop(true);
        }
        return;
      }

      const ImagePicker = await import('expo-image-picker');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Izin Ditolak', 'Aplikasi memerlukan izin untuk mengakses galeri.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      const uri = 'cancelled' in result 
        ? (result.cancelled ? null : (result as any).uri) 
        : (result as any).assets?.[0]?.uri;

      if (uri) {
        setImageToCrop(uri);
        setShowCrop(true);
      }
    } catch (err) {
      console.error('pickImage error', err);
      Alert.alert('Error', 'Gagal memilih foto');
    }
  };

  const removePhoto = async () => {
    try {
      await updateUser({ foto: undefined });
      Alert.alert('Sukses', 'Foto profil berhasil dihapus');
    } catch (err) {
      console.error('removePhoto error', err);
      Alert.alert('Error', 'Gagal menghapus foto');
    }
  };

  const webActionSheet = () => {
    return new Promise<'camera' | 'gallery' | 'remove' | 'cancel'>((resolve) => {
      try {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 16px;
        `;

        const sheet = document.createElement('div');
        sheet.style.cssText = `
          width: 100%;
          max-width: 400px;
          background: #fff;
          border-radius: 16px;
          padding: 8px;
          box-shadow: 0 -4px 24px rgba(0,0,0,0.2);
        `;

        const btn = (text: string, value: 'camera' | 'gallery' | 'remove' | 'cancel', danger = false) => {
          const b = document.createElement('button');
          b.textContent = text;
          b.style.cssText = `
            width: 100%;
            padding: 16px;
            margin: 4px 0;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            background: ${danger ? '#fee2e2' : value === 'cancel' ? '#f3f4f6' : colors.primary[500]};
            color: ${danger ? '#b91c1c' : value === 'cancel' ? '#374151' : '#fff'};
            transition: all 0.2s;
          `;
          b.onmouseover = () => b.style.opacity = '0.8';
          b.onmouseout = () => b.style.opacity = '1';
          b.onclick = () => {
            document.body.removeChild(overlay);
            resolve(value);
          };
          return b;
        };

        sheet.appendChild(btn('Ambil Gambar', 'camera'));
        sheet.appendChild(btn('Ambil dari Galeri', 'gallery'));
        sheet.appendChild(btn('Hapus Foto', 'remove', true));
        sheet.appendChild(btn('Batal', 'cancel'));

        overlay.appendChild(sheet);
        document.body.appendChild(overlay);
        
        overlay.onclick = (e) => {
          if (e.target === overlay) {
            document.body.removeChild(overlay);
            resolve('cancel');
          }
        };
      } catch (e) {
        console.error('webActionSheet error', e);
        resolve('cancel');
      }
    });
  };

  const webFilePicker = (opts: { capture?: boolean | 'environment' }) => {
    return new Promise<string | null>((resolve) => {
      try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        if (opts?.capture) input.setAttribute('capture', String(opts.capture));
        input.style.display = 'none';
        document.body.appendChild(input);
        
        input.onchange = () => {
          const file = input.files?.[0];
          if (!file) {
            document.body.removeChild(input);
            resolve(null);
            return;
          }
          
          const reader = new FileReader();
          reader.onload = () => {
            document.body.removeChild(input);
            resolve(reader.result as string);
          };
          reader.onerror = () => {
            document.body.removeChild(input);
            resolve(null);
          };
          reader.readAsDataURL(file);
        };
        
        input.click();
      } catch (e) {
        console.error('webFilePicker error', e);
        resolve(null);
      }
    });
  };

  const webCameraCapture = (opts: { facingMode?: 'environment' | 'user' } = {}) => {
    return new Promise<string | null>(async (resolve) => {
      try {
        if (!navigator || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          resolve(null);
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: opts.facingMode || 'environment' } });

        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 16px;
        `;

        const container = document.createElement('div');
        container.style.cssText = `
          width: 100%;
          max-width: 420px;
          background: #000;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
        `;

        const video = document.createElement('video');
        video.autoplay = true;
        video.playsInline = true;
        video.style.cssText = `
          width: 100%;
          height: auto;
          background: #000;
        `;
        video.srcObject = stream;

        const controls = document.createElement('div');
        controls.style.cssText = `
          width: 100%;
          padding: 12px;
          display: flex;
          gap: 8px;
          justify-content: center;
          background: #050505;
        `;

        const btn = (text: string, onClick: () => void, danger = false) => {
          const b = document.createElement('button');
          b.textContent = text;
          b.style.cssText = `
            padding: 10px 14px;
            border-radius: 8px;
            border: none;
            background: ${danger ? '#ef4444' : '#fff'};
            color: ${danger ? '#fff' : '#000'};
            font-weight: 600;
            cursor: pointer;
          `;
          b.onclick = onClick;
          return b;
        };

        const capture = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            cleanup();
            resolve(dataUrl);
          } catch (e) {
            console.error('webCameraCapture capture error', e);
            cleanup();
            resolve(null);
          }
        };

        const cleanup = () => {
          try {
            stream.getTracks().forEach((t: any) => t.stop());
          } catch (e) {}
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        };

        controls.appendChild(btn('Batal', () => { cleanup(); resolve(null); }));
        controls.appendChild(btn('Ambil Foto', capture));

        container.appendChild(video);
        container.appendChild(controls);
        overlay.appendChild(container);
        document.body.appendChild(overlay);

        // In some browsers video may not be ready immediately
        video.onloadedmetadata = () => {
          try { video.play(); } catch (e) {}
        };

      } catch (e) {
        console.error('webCameraCapture error', e);
        resolve(null);
      }
    });
  };

  const handleCropSave = async () => {
    if (!imageToCrop) return;
    try {
      // Perfect square crop from circle center
      const circleSize = SCREEN_WIDTH * 0.75; // as used in styles.cropCircle
      const contW = containerSize.width || SCREEN_WIDTH;
      const contH = containerSize.height || SCREEN_WIDTH;
      const imgW = imageSize.width || contW;
      const imgH = imageSize.height || contH;

      // ratio of image natural -> displayed (contain)
      const fitRatio = Math.min(contW / imgW, contH / imgH) * scaleRef.current;
      const displayedW = imgW * fitRatio;
      const displayedH = imgH * fitRatio;

      // top-left of displayed image inside container (centered)
      const imgLeft = (contW - displayedW) / 2 + offsetRef.current.x;
      const imgTop = (contH - displayedH) / 2 + offsetRef.current.y;

      // center of crop circle in container coords
      const cropCenterX = contW / 2;
      const cropCenterY = contH / 2;

      // crop square size in displayed pixels (matching circle size)
      const cropDisplaySize = circleSize;

      // convert to image natural pixels - ensure perfect square
      const cropXOnImage = Math.max(0, Math.round((cropCenterX - imgLeft - cropDisplaySize / 2) / fitRatio));
      const cropYOnImage = Math.max(0, Math.round((cropCenterY - imgTop - cropDisplaySize / 2) / fitRatio));
      const cropWOnImage = Math.round(Math.min(imgW, cropDisplaySize / fitRatio));
      const cropHOnImage = Math.round(Math.min(imgH, cropDisplaySize / fitRatio));

      // Ensure perfect square for circular profile
      const squareSize = Math.min(cropWOnImage, cropHOnImage);
      const finalCrop = {
        originX: cropXOnImage,
        originY: cropYOnImage,
        width: squareSize,
        height: squareSize,
      };

      if (Platform.OS === 'web') {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.src = imageToCrop as string;

        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(
            img,
            finalCrop.originX, finalCrop.originY, finalCrop.width, finalCrop.height,
            0, 0, 400, 400
          );

          const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
          await updateUser({ foto: croppedDataUrl });
        }
      } else {
        try {
          const ImageManipulator = await import('expo-image-manipulator');
          const manipResult = await ImageManipulator.manipulateAsync(
            imageToCrop,
            [
              { crop: { originX: finalCrop.originX, originY: finalCrop.originY, width: finalCrop.width, height: finalCrop.height } },
              { resize: { width: 400, height: 400 } },
            ],
            { compress: 0.95, format: ImageManipulator.SaveFormat.JPEG }
          );

          await updateUser({ foto: manipResult.uri });
        } catch (err) {
          await updateUser({ foto: imageToCrop });
        }
      }

      setShowCrop(false);
      setImageToCrop(null);
      Alert.alert('Sukses', 'Foto profil berhasil diperbarui');
    } catch (err) {
      console.error('handleCropSave error', err);
      Alert.alert('Error', 'Gagal menyimpan foto');
    }
  };

  const renderCameraModal = () => {
    if (!CameraComponent) return null;

    return (
      <Modal visible={showCamera} animationType="slide" onRequestClose={() => setShowCamera(false)}>
        <View style={styles.cameraContainer}>
          {cameraLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Membuka kamera...</Text>
            </View>
          ) : (
            <>
              <CameraComponent
                ref={cameraRef}
                style={styles.camera}
                type={CameraComponent.Constants?.Type?.back}
              />
              
              <View style={styles.cameraOverlay}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowCamera(false)}
                >
                  <Icon name="close" size={28} color="#fff" />
                </TouchableOpacity>

                <View style={styles.cameraControls}>
                  <View style={styles.captureButtonOuter}>
                    <TouchableOpacity
                      style={styles.captureButton}
                      onPress={takePicture}
                    >
                      <View style={styles.captureButtonInner} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
      </Modal>
    );
  };

  const renderCropModal = () => {
    if (!imageToCrop) return null;

    return (
      <Modal visible={showCrop} animationType="slide" onRequestClose={() => setShowCrop(false)}>
        <View style={styles.cropContainer}>
          <View style={styles.cropHeader}>
            <TouchableOpacity
              style={styles.cropHeaderButton}
              onPress={() => {
                setShowCrop(false);
                setImageToCrop(null);
              }}
            >
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.cropHeaderTitle}>Atur Foto Profil</Text>
            <TouchableOpacity
              style={styles.cropHeaderButton}
              onPress={handleCropSave}
            >
              <Icon name="check" size={24} color={colors.primary[400]} />
            </TouchableOpacity>
          </View>

          <View style={styles.cropImageContainer} onLayout={(ev) => {
              const { width, height } = ev.nativeEvent.layout;
              setContainerSize({ width, height });
            }}>
            <View
              style={{ width: '100%', height: '100%', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}
              {...(panResponder.current ? panResponder.current.panHandlers : {})}
            >
              <Image
                source={{ uri: imageToCrop }}
                style={[styles.cropImage, { transform: [{ translateX: offset.x }, { translateY: offset.y }, { scale }, { rotate: `${rotation}deg` }] }]}
                resizeMode="contain"
                onLoad={(e) => {
                if (Platform.OS === 'web') {
                  try {
                    const anyE = e as any;
                    const native = anyE?.nativeEvent;
                    if (native && (native.width || native.height)) {
                      setImageSize({ width: native.width || 0, height: native.height || 0 });
                      return;
                    }

                    const target = anyE?.target;
                    if (target && target.naturalWidth) {
                      setImageSize({ width: target.naturalWidth, height: target.naturalHeight });
                      return;
                    }

                    const tmp = new window.Image();
                    tmp.src = imageToCrop as string;
                    tmp.onload = () => {
                      setImageSize({ width: tmp.naturalWidth || 0, height: tmp.naturalHeight || 0 });
                    };
                  } catch (ex) {
                    console.error('crop image onLoad web error', ex);
                  }
                } else {
                  Image.getSize(imageToCrop as string, (width, height) => {
                    setImageSize({ width, height });
                  }, (err) => {
                    console.error('Image.getSize error', err);
                  });
                }
                }}
              />
            </View>
            
            <View style={styles.cropOverlay}>
              {/* Grid Lines */}
              <View style={styles.gridContainer}>
                {[0, 1, 2].map((row) => (
                  <View key={`row-${row}`} style={styles.gridRow}>
                    {[0, 1, 2].map((col) => (
                      <View key={`cell-${row}-${col}`} style={styles.gridCell} />
                    ))}
                  </View>
                ))}
              </View>
              {/* Circular Guide */}
              <View style={styles.cropCircle} />
            </View>
          </View>

          <View style={styles.cropFooter}>
            <Text style={styles.cropInstructions}>
              Posisikan wajah Anda di dalam lingkaran
            </Text>
            <Text style={styles.cropSubInstructions}>
              Drag untuk pindah • Pinch untuk zoom • Gunakan tombol
            </Text>

            <View style={styles.cropControlsContainer}>
              <TouchableOpacity 
                onPress={() => {
                  const s = Math.max(0.5, scale - 0.2);
                  setScale(s); 
                  scaleRef.current = s;
                }} 
                style={styles.cropControlButton}
              >
                <Text style={styles.cropControlButtonText}>🔍 −</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => {
                  setRotation((rotation + 90) % 360);
                }} 
                style={styles.cropControlButton}
              >
                <Text style={styles.cropControlButtonText}>🔄 Putar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => {
                  setOffset({ x: 0, y: 0 }); 
                  offsetRef.current = { x: 0, y: 0 };
                  setScale(1); 
                  scaleRef.current = 1;
                  setRotation(0);
                }} 
                style={styles.cropControlButton}
              >
                <Text style={styles.cropControlButtonText}>🔄 Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => {
                  const s = Math.min(3, scale + 0.2);
                  setScale(s); 
                  scaleRef.current = s;
                }} 
                style={styles.cropControlButton}
              >
                <Text style={styles.cropControlButtonText}>🔍 +</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Compact Header */}
        <View style={[styles.header, { backgroundColor: colors.surface.primary, borderBottomWidth: 1, borderBottomColor: colors.surface.tertiary }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Icon name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={[styles.card, { marginHorizontal: 0, marginBottom: 0, padding: 0 }]}>
            <View style={styles.profileSection}>
              <View style={styles.profileImageWrapper}>
                <View style={styles.profileImageRing}>
                  {user?.foto ? (
                    <Image source={{ uri: user.foto }} style={styles.profileImageContent} />
                  ) : (
                    <View style={styles.profileImagePlaceholder}>
                      <Icon name="account" size={40} color={colors.primary[300]} />
                    </View>
                  )}
                </View>
                
                <TouchableOpacity 
                  style={styles.editPhotoButton} 
                  onPress={handleEditPhoto}
                  activeOpacity={0.8}
                >
                  <Icon name="camera" size={14} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.profileTextContent}>
                <Text style={styles.profileName} numberOfLines={1}>{user?.nama || 'Nama Pengguna'}</Text>
                <Text style={styles.profileNim}>{user?.nim || '-'}</Text>
                <View style={styles.profileBadge}>
                  <View style={styles.profileBadgeItem}>
                    <Text style={styles.profileBadgeText}>Mahasiswa</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Personal Information Card */}
        <View style={styles.contentSection}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Icon name="account-circle" size={24} color={colors.primary[600]} />
                <Text style={styles.cardTitle}>Informasi Pribadi</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setIsEditing(!isEditing)}
                style={styles.editIconButton}
              >
                <Icon 
                  name={isEditing ? "close-circle" : "pencil"} 
                  size={22} 
                  color={isEditing ? colors.error[500] : colors.primary[600]} 
                />
              </TouchableOpacity>
            </View>

            {isEditing ? (
              <View style={styles.form}>
                <Input
                  label="Nama Lengkap"
                  value={formData.nama}
                  onChangeText={(text) => setFormData({ ...formData, nama: (text || '').toUpperCase() })}
                  placeholder="Masukkan nama lengkap"
                />
                <Input
                  label="Email"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  placeholder="Masukkan email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Input
                  label="Nomor HP"
                  value={formData.noHp}
                  onChangeText={(text) => {
                    const digits = (text || '').replace(/\D+/g, '');
                    setFormData({ ...formData, noHp: digits });
                  }}
                  placeholder="Masukkan nomor HP"
                  keyboardType="phone-pad"
                />
                <TouchableOpacity onPress={() => setShowGenderPicker(true)} activeOpacity={0.8} style={{ marginVertical: 8 }}>
                  <View style={{ borderWidth: 1, borderColor: colors.border.DEFAULT, padding: 12, borderRadius: 8, backgroundColor: colors.surface.card }}>
                    <Text style={{ color: formData.jenisKelamin ? colors.text.primary : colors.text.secondary }}>{formData.jenisKelamin || 'Pilih Jenis Kelamin'}</Text>
                  </View>
                </TouchableOpacity>

                <Modal visible={showGenderPicker} transparent animationType="fade" onRequestClose={() => setShowGenderPicker(false)}>
                  <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 }}>
                    <View style={{ backgroundColor: colors.surface.card, borderRadius: 12, overflow: 'hidden' }}>
                      {['Laki-laki', 'Perempuan', 'Lainnya'].map((g) => (
                        <TouchableOpacity key={g} onPress={() => { setFormData({ ...formData, jenisKelamin: g }); setShowGenderPicker(false); }} style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border.DEFAULT }}>
                          <Text style={{ fontSize: 16, color: colors.text.primary }}>{g}</Text>
                        </TouchableOpacity>
                      ))}
                      <TouchableOpacity onPress={() => setShowGenderPicker(false)} style={{ padding: 14 }}>
                        <Text style={{ textAlign: 'center', color: colors.text.secondary }}>Batal</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 }}>
                  <Text style={{ fontSize: 14, color: colors.text.primary }}>Aktif di Kampus</Text>
                  <Switch
                    value={!!formData.aktifKampus}
                    onValueChange={(v) => setFormData({ ...formData, aktifKampus: v })}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setFormData({ ...formData, setujuSyarat: !formData.setujuSyarat })}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}
                >
                  <Icon name={formData.setujuSyarat ? 'checkbox-marked' : 'checkbox-blank-outline'} size={20} color={formData.setujuSyarat ? colors.primary[600] : colors.text.secondary} />
                  <Text style={{ color: colors.text.primary }}>Saya menyetujui syarat penggunaan</Text>
                </TouchableOpacity>
                <Input
                  label="Alamat"
                  value={formData.alamat}
                  onChangeText={(text) => setFormData({ ...formData, alamat: text })}
                  placeholder="Masukkan alamat lengkap"
                  multiline
                  numberOfLines={3}
                />
                <Button title="Simpan Perubahan" onPress={handleSave} />
              </View>
            ) : (
              <View style={styles.infoGrid}>
                <InfoItem 
                  icon="card-account-details" 
                  label="NIM" 
                  value={user?.nim || '-'} 
                />
                <InfoItem 
                  icon="school" 
                  label="Program Studi" 
                  value={user?.prodi || '-'} 
                />
                <InfoItem 
                  icon="calendar-clock" 
                  label="Angkatan" 
                  value={user?.angkatan?.toString() || '-'} 
                />
                <InfoItem 
                  icon="book-open-page-variant" 
                  label="Semester" 
                  value={user?.semester?.toString() || ''} 
                />
                <InfoItem 
                  icon="email" 
                  label="Email" 
                  value={user?.email || '-'} 
                  fullWidth 
                />
                <InfoItem 
                  icon="phone" 
                  label="No. HP" 
                  value={user?.noHp || '-'} 
                  fullWidth 
                />
                <InfoItem 
                  icon="map-marker" 
                  label="Alamat" 
                  value={user?.alamat || '-'} 
                  fullWidth 
                />
              </View>
            )}
          </View>

          {/* Academic Stats Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Icon name="chart-line" size={24} color={colors.primary[600]} />
                <Text style={styles.cardTitle}>Informasi Akademik</Text>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <AcademicStat icon="trophy" label="IPK" value="3.75" color="#10B981" />
              <AcademicStat icon="book-multiple" label="Total SKS" value="120" color="#3B82F6" />
              <AcademicStat icon="calendar-check" label="Semester" value="5" color="#8B5CF6" />
              <AcademicStat icon="check-circle" label="Status" value="Aktif" color="#F59E0B" />
            </View>
          </View>

          {/* Settings Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Icon name="cog" size={24} color={colors.primary[600]} />
                <Text style={styles.cardTitle}>Pengaturan</Text>
              </View>
            </View>

            <View style={styles.menuList}>
              <MenuItem 
                icon="lock-outline" 
                title="Ubah Password" 
                subtitle="Ganti password akun Anda"
                onPress={() => Alert.alert('Info', 'Fitur ubah password')}
              />
              <MenuItem 
                icon="bell-outline" 
                title="Notifikasi" 
                subtitle="Atur preferensi notifikasi"
                onPress={() => Alert.alert('Info', 'Fitur notifikasi')}
              />
              <MenuItem 
                icon="palette-outline" 
                title="Tema Aplikasi" 
                subtitle="Ubah tampilan aplikasi"
                onPress={() => Alert.alert('Info', 'Fitur tema')}
              />
              <MenuItem
                icon="exit-to-app"
                title="Logout"
                subtitle={loggingOut ? 'Keluar...' : 'Keluar dari akun Anda'}
                onPress={() => {
                  if (loggingOut) return;
                  setShowLogoutConfirm(true);
                }}
                danger
                noBorder
              />
            </View>
          </View>
        </View>

        <View style={styles.footerSpace} />
      </ScrollView>

      {renderCameraModal()}
      {renderCropModal()}
      <Modal visible={showLogoutConfirm} transparent animationType="fade" onRequestClose={() => setShowLogoutConfirm(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ width: '100%', maxWidth: 360, backgroundColor: colors.surface.card, borderRadius: 12, overflow: 'hidden', padding: 18 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8, color: colors.text.primary }}>Logout</Text>
            <Text style={{ color: colors.text.secondary, marginBottom: 16 }}>Anda yakin ingin keluar dari akun?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              <TouchableOpacity onPress={() => setShowLogoutConfirm(false)} style={{ paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 }}>
                <Text style={{ color: colors.text.secondary }}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  try {
                    setLoggingOut(true);
                    await logout();
                    setShowLogoutConfirm(false);
                    router.replace('/login');
                  } catch (e) {
                    console.error('logout error', e);
                    Alert.alert('Error', 'Gagal logout. Silakan coba lagi.');
                  } finally {
                    setLoggingOut(false);
                  }
                }}
                style={{ paddingHorizontal: 14, paddingVertical: 10, backgroundColor: colors.error[500], borderRadius: 8 }}
              >
                {loggingOut ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Logout</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

 