import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { colors } from '../../constants/colors';

type State = { hasError: boolean; error?: Error | null; errorInfo?: string };

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    this.setState({ error, errorInfo: info?.componentStack });
    // Also log to console so devtools show the error
    console.error('Unhandled error caught by ErrorBoundary:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children as React.ReactElement;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Terjadi kesalahan</Text>
          <Text style={styles.message}>
            Aplikasi mengalami error saat memuat. Silakan muat ulang.
          </Text>
          <Text style={styles.heading}>Error:</Text>
          <Text style={styles.stack}>{this.state.error?.toString()}</Text>
          {this.state.errorInfo ? (
            <>
              <Text style={styles.heading}>Stack:</Text>
              <Text style={styles.stack}>{this.state.errorInfo}</Text>
            </>
          ) : null}
          <View style={styles.buttonContainer}>
            <Button title="Muat Ulang" onPress={() => {
              // Try a full reload
              if (typeof window !== 'undefined' && (window as any).location) {
                (window as any).location.reload();
              }
            }} color={colors.primary[600]} />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  card: {
    width: '100%',
    maxWidth: 800,
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  message: {
    color: colors.text.secondary,
    marginBottom: 12,
  },
  heading: {
    marginTop: 8,
    fontWeight: '600',
    color: colors.text.primary,
  },
  stack: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 16,
  },
});

export default ErrorBoundary;
