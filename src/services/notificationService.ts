import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { USERS } from '../config/constants';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Celebration phrases for notifications
const CELEBRATION_PHRASES = [
  'Woohoo!',
  'Amazing!',
  'Nice work!',
  'Crushing it!',
  'On fire!',
  'Boom!',
  'Legendary!',
  'Beast mode!',
  'Unstoppable!',
  'Keep it up!',
];

function getRandomPhrase(): string {
  return CELEBRATION_PHRASES[Math.floor(Math.random() * CELEBRATION_PHRASES.length)];
}

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log('Push notifications only work on physical devices');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification');
    return null;
  }

  // Get Expo push token
  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

  if (!projectId) {
    console.log('No project ID found for push notifications');
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

  // Set up Android notification channel
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  return token;
}

export async function savePushToken(userId: string, token: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, { pushToken: token }, { merge: true });
}

export async function getPartnerPushToken(partnerId: string): Promise<string | null> {
  const partnerRef = doc(db, 'users', partnerId);
  const snapshot = await getDoc(partnerRef);
  return snapshot.data()?.pushToken || null;
}

export async function sendPushNotification(
  expoPushToken: string,
  userName: string,
  problemName: string
): Promise<void> {
  const phrase = getRandomPhrase();

  const message = {
    to: expoPushToken,
    sound: 'default',
    title: `${phrase} ${userName} completed a problem!`,
    body: problemName,
    data: { type: 'problem_completed' },
  };

  try {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

export async function notifyPartnerOfCompletion(
  userId: string,
  partnerId: string,
  problemName: string
): Promise<void> {
  const userName = USERS[userId as keyof typeof USERS]?.name || 'Your partner';
  const partnerToken = await getPartnerPushToken(partnerId);

  if (partnerToken) {
    await sendPushNotification(partnerToken, userName, problemName);
  }
}
