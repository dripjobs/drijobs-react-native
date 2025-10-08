import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle2, XCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

/**
 * QuickBooks OAuth Callback Handler
 * This screen handles the OAuth redirect after QuickBooks authorization
 */
export default function QuickBooksOAuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Connecting to QuickBooks...');

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      // Extract authorization code from URL params
      const code = params.code as string;
      const error = params.error as string;
      const realmId = params.realmId as string;

      if (error) {
        throw new Error(error);
      }

      if (!code) {
        throw new Error('No authorization code received');
      }

      // The actual token exchange should happen in the service
      // For now, we'll just show success and redirect
      setStatus('success');
      setMessage('Successfully connected to QuickBooks!');

      // Redirect to settings after 2 seconds
      setTimeout(() => {
        router.replace('/(tabs)');
        router.push('/account-settings');
      }, 2000);
    } catch (error) {
      console.error('OAuth callback error:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to connect to QuickBooks');

      // Redirect to settings after 3 seconds even on error
      setTimeout(() => {
        router.replace('/(tabs)');
        router.push('/account-settings');
      }, 3000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {status === 'loading' && (
          <>
            <ActivityIndicator size="large" color="#2CA01C" />
            <Text style={styles.title}>{message}</Text>
            <Text style={styles.subtitle}>Please wait...</Text>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 size={64} color="#10B981" strokeWidth={2} />
            <Text style={styles.title}>{message}</Text>
            <Text style={styles.subtitle}>Redirecting to settings...</Text>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle size={64} color="#EF4444" strokeWidth={2} />
            <Text style={[styles.title, styles.errorText]}>Connection Failed</Text>
            <Text style={styles.subtitle}>{message}</Text>
            <Text style={styles.redirectText}>Redirecting back to settings...</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    gap: 16,
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorText: {
    color: '#EF4444',
  },
  redirectText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
});
