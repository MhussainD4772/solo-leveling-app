import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { generateTask, shouldGenerateTask } from '../utils/taskGenerator'
import * as Notifications from 'expo-notifications'

export const useTaskManager = () => {
  const { player, tasks, notifications, addTask, completeTask, failTask } = useGameStore()

  useEffect(() => {
    const checkAndGenerateTask = () => {
      if (
        notifications.enabled &&
        shouldGenerateTask(notifications.lastTaskTime, player.activeHours)
      ) {
        const newTask = generateTask('daily', player.activeHours)
        addTask(newTask)

        // Schedule notification
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'New Task Available!',
            body: `${newTask.title}\n${newTask.description}\nXP Reward: ${newTask.xpReward}`,
          },
          trigger: {
            date: newTask.dueDate,
          },
        })
      }
    }

    // Check for tasks every minute
    const interval = setInterval(checkAndGenerateTask, 60000)
    checkAndGenerateTask() // Initial check

    return () => clearInterval(interval)
  }, [player.activeHours, notifications.enabled, notifications.lastTaskTime])

  useEffect(() => {
    const checkTaskDeadlines = () => {
      const now = new Date()
      tasks.forEach((task) => {
        if (!task.completed && !task.failed && task.dueDate < now) {
          failTask(task.id)
        }
      })
    }

    // Check task deadlines every minute
    const interval = setInterval(checkTaskDeadlines, 60000)
    checkTaskDeadlines() // Initial check

    return () => clearInterval(interval)
  }, [tasks])

  return {
    tasks,
    completeTask,
    failTask,
  }
} 