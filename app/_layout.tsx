import { NotificationProvider } from '@/contexts/NotificationContext';
import { TabBarProvider } from '@/contexts/TabBarContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <TabBarProvider>
      <NotificationProvider>
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
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </>
        </GestureHandlerRootView>
      </NotificationProvider>
    </TabBarProvider>
  );
}