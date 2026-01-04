import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  AllProblems: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
