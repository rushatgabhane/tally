import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { PROBLEMS } from '../data/problems';
import { RATINGS } from '../config/constants';
import {
  subscribeToProgress,
  setUserProgress,
} from '../services/progressService';
import { NavigationProp } from '../types/navigation';

export function AllProblemsScreen({ navigation }: { navigation: NavigationProp }) {
  const { userId } = useAuth();
  const insets = useSafeAreaInsets();
  const [myProgress, setMyProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const isUser1 = userId === 'user1';
    const unsubscribe = subscribeToProgress((user1Prog, user2Prog) => {
      setMyProgress(isUser1 ? user1Prog : user2Prog);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  const handleToggle = async (globalIndex: number) => {
    if (!userId) return;

    // If tapping a completed problem, set progress to that index (uncomplete it and all after)
    // If tapping the next uncompleted problem, complete it
    if (globalIndex < myProgress) {
      // Uncomplete: set progress to this index
      await setUserProgress(userId, globalIndex);
    } else if (globalIndex === myProgress) {
      // Complete: increment progress
      await setUserProgress(userId, globalIndex + 1);
    }
    // Can't complete problems out of order
  };

  const renderProblem = ({ item }: { item: typeof PROBLEMS[0] }) => {
    const isCompleted = item.globalIndex < myProgress;
    const isNext = item.globalIndex === myProgress;

    return (
      <TouchableOpacity
        className={`flex-row items-center px-4 py-3 border-b border-zinc-100 ${
          isCompleted ? 'bg-emerald-50' : ''
        }`}
        onPress={() => handleToggle(item.globalIndex)}
        disabled={!isCompleted && !isNext}
        activeOpacity={0.7}
      >
        <View
          className={`w-6 h-6 rounded-md border-2 justify-center items-center mr-3 ${
            isCompleted
              ? 'bg-zinc-900 border-zinc-900'
              : isNext
              ? 'border-zinc-400 bg-white'
              : 'border-zinc-200 bg-zinc-50'
          }`}
        >
          {isCompleted && (
            <Text className="text-white text-xs font-bold">✓</Text>
          )}
        </View>
        <View className="flex-1">
          <Text
            className={`text-sm ${
              isCompleted
                ? 'text-zinc-400 line-through'
                : isNext
                ? 'text-zinc-900 font-medium'
                : 'text-zinc-400'
            }`}
          >
            {item.name}
          </Text>
        </View>
        <Text className="text-xs text-zinc-400">{item.rating}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#18181b" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-zinc-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-zinc-600">Back</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-zinc-900">All Problems</Text>
        <Text className="text-sm text-zinc-500">{myProgress}/372</Text>
      </View>

      <FlatList
        data={PROBLEMS}
        keyExtractor={(item) => item.globalIndex.toString()}
        renderItem={renderProblem}
        stickyHeaderIndices={RATINGS.map(
          (_, idx) => idx * 31 + idx
        ).filter((_, idx) => idx < RATINGS.length)}
        ListHeaderComponent={null}
        getItemLayout={(_, index) => ({
          length: 52,
          offset: 52 * index,
          index,
        })}
        initialNumToRender={20}
      />
    </View>
  );
}
