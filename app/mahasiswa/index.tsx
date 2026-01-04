import React, { useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fonts } from '../../constants/theme';
import { ScrollView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const Calendar = (props: any) => <MaterialCommunityIcons name="calendar" {...props} />;
const BookOpen = (props: any) => <MaterialCommunityIcons name="book-open-page-variant" {...props} />;
const ClipboardList = (props: any) => <MaterialCommunityIcons name="clipboard-list" {...props} />;
const TrendingUp = (props: any) => <MaterialCommunityIcons name="trending-up" {...props} />;
const Award = (props: any) => <MaterialCommunityIcons name="trophy" {...props} />;
const Bell = (props: any) => <MaterialCommunityIcons name="bell" {...props} />;
const Settings = (props: any) => <MaterialCommunityIcons name="cog" {...props} />;
const ChevronRight = (props: any) => <MaterialCommunityIcons name="chevron-right" {...props} />;
const Users = (props: any) => <MaterialCommunityIcons name="account-multiple" {...props} />;
const Clock = (props: any) => <MaterialCommunityIcons name="clock" {...props} />;
const CheckCircle = (props: any) => <MaterialCommunityIcons name="check-circle" {...props} />;

export default function ElegantDashboard() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [currentTime, setCurrentTime] = React.useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Apply landing-page font on web by setting document body fontFamily
  useEffect(() => {
    if (typeof window !== 'undefined' && 'document' in window) {
      const prev = (document.body && (document.body.style as any).fontFamily) || '';
      (document.body.style as any).fontFamily = Fonts?.sans || 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      return () => {
        (document.body.style as any).fontFamily = prev;
      };
    }
    return;
  }, []);

  const theme = {
    bg: isDarkMode ? '#0A0E1A' : '#F8FAFB',
    card: isDarkMode ? '#141824' : '#FFFFFF',
    accent: isDarkMode ? '#1F2937' : '#F3F4F6',
    text: isDarkMode ? '#F9FAFB' : '#0F172A',
    subtext: isDarkMode ? '#9CA3AF' : '#64748B',
    border: isDarkMode ? '#1F2937' : '#E5E7EB',
    primary: '#6366F1',
    success: '#10B981',
    warning: '#F59E0B',
  };

  const stats = [
    { label: 'IPK', value: '3.82', icon: TrendingUp, color: theme.primary, change: '+0.12' },
    { label: 'SKS', value: '114', icon: BookOpen, color: '#06B6D4', change: '+6' },
    { label: 'Tugas', value: '4', icon: ClipboardList, color: theme.warning, change: '-2' },
    { label: 'Kehadiran', value: '96%', icon: CheckCircle, color: theme.success, change: '+3%' },
  ];

  const todaySchedule = [
    { time: '08:00 - 09:40', course: 'Pemrograman Web', room: 'Lab 401', lecturer: 'Dr. Ahmad S.' },
    { time: '10:00 - 11:40', course: 'Basis Data', room: 'Ruang 302', lecturer: 'Prof. Sarah W.' },
    { time: '13:00 - 14:40', course: 'Jaringan Komputer', room: 'Lab 403', lecturer: 'M. Rizki, M.Kom' },
  ];

  const upcomingTasks = [
    { title: 'UAS Pemrograman Web', due: '3 hari lagi', course: 'Pemrograman Web', priority: 'high' },
    { title: 'Tugas Basis Data', due: '5 hari lagi', course: 'Basis Data', priority: 'medium' },
    { title: 'Laporan Jaringan', due: '1 minggu lagi', course: 'Jaringan Komputer', priority: 'low' },
  ];

  const quickActions = [
    { label: 'Jadwal', icon: Calendar, color: '#6366F1' },
    { label: 'KHS', icon: Award, color: '#06B6D4' },
    { label: 'Mata Kuliah', icon: BookOpen, color: '#8B5CF6' },
    { label: 'Tugas', icon: ClipboardList, color: '#F59E0B' },
  ];

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: theme.bg }}
    >
      {/* Header */}
      <div style={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
          : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
        padding: '32px 24px 80px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          filter: 'blur(60px)'
        }} />
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          position: 'relative',
          zIndex: 1,
          marginBottom: '24px'
        }}>
          <div>
            <div style={{ 
              color: 'rgba(255,255,255,0.8)', 
              fontSize: '14px',
              marginBottom: '4px',
              fontWeight: '500'
            }}>
              {currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <h1 style={{ 
              color: '#FFFFFF', 
              fontSize: '28px',
              fontWeight: '700',
              margin: '0 0 8px 0'
            }}>
              Selamat Datang, Ahmad
            </h1>
            <div style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.2)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#FFFFFF',
              fontWeight: '600',
              backdropFilter: 'blur(10px)'
            }}>
              Teknik Informatika • Semester 5
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => toggleTheme()}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ color: '#FFFFFF' }}>{isDarkMode ? '☀️' : '🌙'}</div>
            </button>
            <button style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}>
              <Bell size={20} color="#FFFFFF" />
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#EF4444'
              }} />
            </button>
          </div>
        </div>

        {/* Stats Cards - Overlapping */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
          position: 'relative',
          zIndex: 2,
          marginTop: '32px'
        }}>
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} style={{
                background: theme.card,
                borderRadius: '16px',
                padding: '20px',
                border: `1px solid ${theme.border}`,
                boxShadow: isDarkMode 
                  ? '0 4px 6px rgba(0,0,0,0.3)'
                  : '0 4px 6px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = isDarkMode 
                  ? '0 12px 24px rgba(0,0,0,0.4)'
                  : '0 12px 24px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = isDarkMode 
                  ? '0 4px 6px rgba(0,0,0,0.3)'
                  : '0 4px 6px rgba(0,0,0,0.05)';
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: `${stat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={20} color={stat.color} />
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: stat.change.startsWith('+') ? theme.success : theme.warning,
                    fontWeight: '600'
                  }}>
                    {stat.change}
                  </span>
                </div>
                <div style={{ color: theme.text, fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>
                  {stat.value}
                </div>
                <div style={{ color: theme.subtext, fontSize: '13px', fontWeight: '500' }}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px', marginTop: '-40px', position: 'relative', zIndex: 1 }}>
        
        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '24px'
        }}>
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button key={idx} style={{
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: isDarkMode 
                  ? '0 2px 4px rgba(0,0,0,0.2)'
                  : '0 2px 4px rgba(0,0,0,0.04)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.borderColor = action.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = theme.border;
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `${action.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={24} color={action.color} />
                </div>
                <span style={{ color: theme.text, fontSize: '14px', fontWeight: '600' }}>
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '24px' }}>
          
          {/* Today's Schedule */}
          <div style={{
            background: theme.card,
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${theme.border}`,
            boxShadow: isDarkMode 
              ? '0 4px 6px rgba(0,0,0,0.2)'
              : '0 4px 6px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: theme.text, fontSize: '18px', fontWeight: '700', margin: 0 }}>
                Jadwal Hari Ini
              </h2>
              <button style={{
                color: theme.primary,
                fontSize: '14px',
                fontWeight: '600',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                Lihat Semua <ChevronRight size={16} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {todaySchedule.map((item, idx) => (
                <div key={idx} style={{
                  background: theme.accent,
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  gap: '16px',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  border: `1px solid ${theme.border}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.primary;
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.transform = 'translateX(0)';
                }}>
                  <div style={{
                    width: '4px',
                    borderRadius: '2px',
                    background: idx === 0 ? theme.success : theme.primary,
                    flexShrink: 0
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: theme.text, fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
                      {item.course}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: theme.subtext }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} /> {item.time}
                      </span>
                      <span>•</span>
                      <span>{item.room}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: theme.subtext, marginTop: '4px' }}>
                      {item.lecturer}
                    </div>
                  </div>
                  {idx === 0 && (
                    <div style={{
                      background: theme.success,
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      height: 'fit-content'
                    }}>
                      Berlangsung
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div style={{
            background: theme.card,
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${theme.border}`,
            boxShadow: isDarkMode 
              ? '0 4px 6px rgba(0,0,0,0.2)'
              : '0 4px 6px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: theme.text, fontSize: '18px', fontWeight: '700', margin: 0 }}>
                Tugas Mendatang
              </h2>
              <button style={{
                color: theme.primary,
                fontSize: '14px',
                fontWeight: '600',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                Lihat Semua <ChevronRight size={16} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcomingTasks.map((task, idx) => {
                const priorityColor = task.priority === 'high' ? '#EF4444' : task.priority === 'medium' ? theme.warning : theme.success;
                return (
                  <div key={idx} style={{
                    background: theme.accent,
                    borderRadius: '12px',
                    padding: '16px',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    border: `1px solid ${theme.border}`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = priorityColor;
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.border;
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ color: theme.text, fontSize: '15px', fontWeight: '600', flex: 1 }}>
                        {task.title}
                      </div>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: priorityColor,
                        marginTop: '6px'
                      }} />
                    </div>
                    <div style={{ fontSize: '13px', color: theme.subtext, marginBottom: '4px' }}>
                      {task.course}
                    </div>
                    <div style={{ fontSize: '12px', color: priorityColor, fontWeight: '600' }}>
                      ⏰ {task.due}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Achievement Banner */}
        <div style={{
          background: `linear-gradient(135deg, ${theme.primary} 0%, #8B5CF6 100%)`,
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            filter: 'blur(40px)'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>
              🎉 Pencapaian Semester Ini
            </div>
            <div style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>
              IPK Meningkat 0.12 Poin!
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
              Pertahankan prestasi ini hingga akhir semester
            </div>
          </div>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            position: 'relative',
            zIndex: 1
          }}>
            🏆
          </div>
        </div>
      </div>
    </ScrollView>
  );
}