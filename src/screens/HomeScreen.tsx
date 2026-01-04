import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTodayTasks } from '../hooks/useTodayTasks';
import { TaskCard } from '../components/TaskCard';
import {
  markProblemComplete,
  markProblemIncomplete,
} from '../services/progressService';
import { notifyPartnerOfCompletion } from '../services/notificationService';
import { formatDisplayDate, getTodayDateString, getDaysSinceStart } from '../utils/dateUtils';
import { TOTAL_PROBLEMS } from '../config/constants';
import { getProblem } from '../data/problems';
import { NavigationProp } from '../types/navigation';

export function HomeScreen({ navigation }: { navigation: NavigationProp }) {
  const { userId, partnerId, userName, partnerName, logout } = useAuth();
  const { myTasks, myProgress, partnerProgress, loading } =
    useTodayTasks(userId);
  const [refreshing, setRefreshing] = React.useState(false);
  const insets = useSafeAreaInsets();

  const today = getTodayDateString();
  const dayNumber = getDaysSinceStart(today);

  const handleToggleTask = async (globalIndex: number, completed: boolean) => {
    if (!userId || !partnerId) return;

    try {
      if (completed) {
        await markProblemComplete(userId, globalIndex);

        // Send notification to partner
        const problem = getProblem(globalIndex);
        if (problem) {
          await notifyPartnerOfCompletion(userId, partnerId, problem.name);
        }
      } else {
        await markProblemIncomplete(userId, globalIndex);
      }
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#18181b" />
      </View>
    );
  }

  const completedToday = myTasks.filter((t) => t.isCompleted).length;
  const allDoneToday = completedToday === myTasks.length && myTasks.length > 0;

  return (
    <View className="flex-1 bg-zinc-50" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="flex-row justify-between items-start mb-6">
          <View>
            <Text className="text-2xl font-bold text-zinc-900">
              Hi, {userName}
            </Text>
            <Text className="text-sm text-zinc-500 mt-1">
              {formatDisplayDate(today)}
            </Text>
            <View className="bg-zinc-900 rounded-full px-3 py-1 mt-2 self-start">
              <Text className="text-xs text-white font-medium">
                Day {dayNumber}
              </Text>
            </View>
          </View>
          <View className="items-end">
            <TouchableOpacity
              onPress={logout}
              className="border border-zinc-200 rounded-lg px-3 py-2 mb-2"
            >
              <Text className="text-zinc-600 text-sm">Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('AllProblems')}
              className="bg-zinc-900 rounded-lg px-3 py-2"
            >
              <Text className="text-white text-sm">All Problems</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Your Tasks */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-zinc-900 mb-3">
            Your Tasks
          </Text>
          {myTasks.length === 0 ? (
            <View className="bg-white border border-zinc-200 rounded-xl p-6 items-center">
              <Text className="text-zinc-500">
                All done! You've completed everything.
              </Text>
            </View>
          ) : (
            <>
              {allDoneToday && (
                <View className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-3">
                  <Text className="text-emerald-700 text-sm font-medium text-center">
                    Great job! All tasks completed today!
                  </Text>
                </View>
              )}
              {myTasks.map((task) => (
                <TaskCard
                  key={task.globalIndex}
                  task={task}
                  onToggle={handleToggleTask}
                />
              ))}
            </>
          )}
        </View>

        {/* Overall Progress */}
        <View>
          <Text className="text-lg font-semibold text-zinc-900 mb-3">
            Overall Progress
          </Text>
          <View className="flex-row">
            <View className="flex-1 bg-white border border-zinc-200 rounded-xl p-4 items-center mr-2">
              <Text className="text-sm text-zinc-500 mb-1">You</Text>
              <Text className="text-2xl font-bold text-zinc-900">
                {myProgress}
              </Text>
              <Text className="text-xs text-zinc-400">/ {TOTAL_PROBLEMS}</Text>
            </View>
            <View className="flex-1 bg-white border border-zinc-200 rounded-xl p-4 items-center ml-2">
              <Text className="text-sm text-zinc-500 mb-1">{partnerName}</Text>
              <Text className="text-2xl font-bold text-zinc-900">
                {partnerProgress}
              </Text>
              <Text className="text-xs text-zinc-400">/ {TOTAL_PROBLEMS}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
