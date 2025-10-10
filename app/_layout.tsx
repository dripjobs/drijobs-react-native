import GlobalCallOverlay from '@/components/GlobalCallOverlay';
import OfflineIndicator from '@/components/OfflineIndicator';
import SyncStatusBadge from '@/components/SyncStatusBadge';
import { AppSettingsProvider } from '@/contexts/AppSettingsContext';
import { CallProvider } from '@/contexts/CallContext';
import { NetworkProvider } from '@/contexts/NetworkContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { TabBarProvider } from '@/contexts/TabBarContext';
import { UserRoleProvider } from '@/contexts/UserRoleContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <NetworkProvider>
      <UserRoleProvider>
        <AppSettingsProvider>
          <TabBarProvider>
            <NotificationProvider>
              <CallProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <>
                    <Stack screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                      <Stack.Screen name="email" options={{ headerShown: false }} />
                      <Stack.Screen name="appointments" options={{ headerShown: false }} />
                      <Stack.Screen name="proposals" options={{ headerShown: false }} />
                      <Stack.Screen name="proposal-builder" options={{ headerShown: false }} />
                      <Stack.Screen name="recurring-jobs" options={{ headerShown: false }} />
                      <Stack.Screen name="account-settings" options={{ headerShown: false }} />
                      <Stack.Screen name="booking-forms" options={{ headerShown: false }} />
                      <Stack.Screen name="booking-form-editor" options={{ headerShown: false }} />
                      <Stack.Screen name="drips" options={{ headerShown: false }} />
                      <Stack.Screen name="automations" options={{ headerShown: false }} />
                      <Stack.Screen name="website" options={{ headerShown: false }} />
                      <Stack.Screen name="website-settings" options={{ headerShown: false }} />
                      <Stack.Screen name="metrics" options={{ headerShown: false }} />
                      <Stack.Screen name="quickbooks-oauth-callback" options={{ headerShown: false }} />
                      <Stack.Screen name="call-history" options={{ headerShown: false }} />
                      <Stack.Screen name="+not-found" />
                    </Stack>
                    <StatusBar style="auto" />
                    <OfflineIndicator />
                    <SyncStatusBadge />
                  </>
                  <GlobalCallOverlay />
                </GestureHandlerRootView>
              </CallProvider>
            </NotificationProvider>
          </TabBarProvider>
        </AppSettingsProvider>
      </UserRoleProvider>
    </NetworkProvider>
  );
}