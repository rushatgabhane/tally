import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(email.trim().toLowerCase(), password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-8">
          <View className="mb-12">
            <Text className="text-4xl font-bold text-zinc-900 text-center">
              Tally
            </Text>
            <Text className="text-base text-zinc-500 text-center mt-2">
              Track your coding progress
            </Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-zinc-700 mb-2">Email</Text>
              <TextInput
                className="bg-white border border-zinc-200 rounded-lg px-4 py-3 text-base text-zinc-900"
                placeholder="Enter your email"
                placeholderTextColor="#a1a1aa"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <View className="mt-4">
              <Text className="text-sm font-medium text-zinc-700 mb-2">Password</Text>
              <TextInput
                className="bg-white border border-zinc-200 rounded-lg px-4 py-3 text-base text-zinc-900"
                placeholder="Enter your password"
                placeholderTextColor="#a1a1aa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
            </View>

            {error ? (
              <Text className="text-red-500 text-sm text-center mt-2">{error}</Text>
            ) : null}

            <TouchableOpacity
              className={`bg-zinc-900 rounded-lg py-4 items-center mt-6 ${loading ? 'opacity-70' : ''}`}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-base font-semibold">Sign In</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
