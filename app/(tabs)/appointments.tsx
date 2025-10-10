import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function AppointmentsTab() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main appointments screen
    router.replace('/appointments');
  }, []);

  return null;
}

