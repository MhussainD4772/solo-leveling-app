import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useTaskManager } from '../hooks/useTaskManager'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
  FadeInRight,
  FadeOutLeft,
  Layout,
} from 'react-native-reanimated'

const TaskItem = ({ task, onComplete, onFail }) => {
  const timeLeft = () => {
    const now = new Date()
    const due = new Date(task.dueDate)
    const diff = due.getTime() - now.getTime()
    const minutes = Math.floor(diff / 60000)
    return minutes > 0 ? `${minutes}m left` : 'Expired'
  }

  return (
    <Animated.View
      entering={FadeInRight}
      exiting={FadeOutLeft}
      layout={Layout}
      style={styles.taskItem}
    >
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskDifficulty}>Rank {task.difficulty}</Text>
      </View>
      <Text style={styles.taskDescription}>{task.description}</Text>
      <View style={styles.taskFooter}>
        <Text style={styles.taskReward}>XP: {task.xpReward}</Text>
        <Text style={styles.taskTime}>{timeLeft()}</Text>
      </View>
      <View style={styles.taskActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.completeButton]}
          onPress={() => onComplete(task.id)}
        >
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Complete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.failButton]}
          onPress={() => onFail(task.id)}
        >
          <Ionicons name="close-circle" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Fail</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

const TasksScreen = () => {
  const { tasks, completeTask, failTask } = useTaskManager()

  const handleComplete = (taskId: string) => {
    Alert.alert(
      'Complete Task',
      'Are you sure you want to mark this task as complete?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Complete',
          onPress: () => completeTask(taskId),
        },
      ]
    )
  }

  const handleFail = (taskId: string) => {
    Alert.alert(
      'Fail Task',
      'Are you sure you want to mark this task as failed? You will lose XP.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Fail',
          style: 'destructive',
          onPress: () => failTask(taskId),
        },
      ]
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onComplete={handleComplete}
            onFail={handleFail}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="list" size={48} color="#6366f1" />
            <Text style={styles.emptyText}>No tasks available</Text>
            <Text style={styles.emptySubtext}>
              New tasks will appear throughout the day
            </Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  listContent: {
    padding: 16,
  },
  taskItem: {
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskDifficulty: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskDescription: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 12,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  taskReward: {
    color: '#4ade80',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskTime: {
    color: '#f87171',
    fontSize: 14,
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  completeButton: {
    backgroundColor: '#4ade80',
  },
  failButton: {
    backgroundColor: '#f87171',
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
})

export default TasksScreen 