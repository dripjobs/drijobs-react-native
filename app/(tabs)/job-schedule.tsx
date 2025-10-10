import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function JobScheduleTab() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main job-schedule screen
    router.replace('/job-schedule');
  }, []);

  return null;
}

