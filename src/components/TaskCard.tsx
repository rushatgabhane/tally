import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TodayTask } from '../types';

interface TaskCardProps {
  task: TodayTask;
  onToggle: (globalIndex: number, completed: boolean) => void;
  disabled?: boolean;
}

export function TaskCard({ task, onToggle, disabled = false }: TaskCardProps) {
  const handlePress = () => {
    if (!disabled) {
      onToggle(task.globalIndex, !task.isCompleted);
    }
  };

  return (
    <TouchableOpacity
      className={`flex-row items-center bg-white border rounded-xl p-4 mb-2 ${
        task.isCompleted ? 'border-emerald-200 bg-emerald-50' : 'border-zinc-200'
      }`}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        className={`w-6 h-6 rounded-md border-2 justify-center items-center mr-3 ${
          task.isCompleted
            ? 'bg-zinc-900 border-zinc-900'
            : 'border-zinc-300 bg-white'
        }`}
      >
        {task.isCompleted && (
          <Text className="text-white text-xs font-bold">✓</Text>
        )}
      </View>
      <View className="flex-1">
        <Text
          className={`text-base font-medium ${
            task.isCompleted ? 'text-zinc-400 line-through' : 'text-zinc-900'
          }`}
        >
          {task.problem.name}
        </Text>
        <Text className="text-sm text-zinc-500 mt-0.5">
          Rating {task.problem.rating}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
