import { create } from 'zustand'
import { GameState, Player, Task, Rank } from '../types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createJSONStorage, persist } from 'zustand/middleware'

const calculateRank = (level: number): Rank => {
  if (level >= 50) return 'S'
  if (level >= 40) return 'A'
  if (level >= 30) return 'B'
  if (level >= 20) return 'C'
  if (level >= 10) return 'D'
  return 'E'
}

const initialPlayer: Player = {
  name: 'Shadow Monarch',
  avatar: require('../../assets/shadow-monarch.png'),
  level: 1,
  exp: 0,
  totalExp: 0,
  rank: 'E',
  streak: 0,
  lastLoginDate: new Date().toISOString().split('T')[0],
  activeHours: {
    start: '09:00',
    end: '22:00',
  },
  skills: [],
  stats: {
    tasksCompleted: 0,
    tasksFailed: 0,
    totalXpEarned: 0,
    totalXpLost: 0,
    currentStreak: 0,
    longestStreak: 0,
  },
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      player: initialPlayer,
      tasks: [],
      notifications: {
        enabled: true,
        lastTaskTime: null,
      },

      // Actions
      addTask: (task: Omit<Task, 'id' | 'completed' | 'failed' | 'createdAt'>) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: Math.random().toString(36).substr(2, 9),
              completed: false,
              failed: false,
              createdAt: new Date(),
            },
          ],
        })),

      completeTask: (taskId: string) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId)
          if (!task || task.completed || task.failed) return state

          const newExp = state.player.exp + task.xpReward
          const expToNextLevel = state.player.level * 100
          const shouldLevelUp = newExp >= expToNextLevel

          return {
            tasks: state.tasks.map((t) =>
              t.id === taskId ? { ...t, completed: true } : t
            ),
            player: {
              ...state.player,
              exp: shouldLevelUp ? newExp - expToNextLevel : newExp,
              level: shouldLevelUp ? state.player.level + 1 : state.player.level,
              totalExp: state.player.totalExp + task.xpReward,
              rank: calculateRank(shouldLevelUp ? state.player.level + 1 : state.player.level),
              stats: {
                ...state.player.stats,
                tasksCompleted: state.player.stats.tasksCompleted + 1,
                totalXpEarned: state.player.stats.totalXpEarned + task.xpReward,
              },
            },
          }
        }),

      failTask: (taskId: string) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId)
          if (!task || task.completed || task.failed) return state

          const newExp = Math.max(0, state.player.exp - task.penalty)

          return {
            tasks: state.tasks.map((t) =>
              t.id === taskId ? { ...t, failed: true } : t
            ),
            player: {
              ...state.player,
              exp: newExp,
              stats: {
                ...state.player.stats,
                tasksFailed: state.player.stats.tasksFailed + 1,
                totalXpLost: state.player.stats.totalXpLost + task.penalty,
              },
            },
          }
        }),

      updateActiveHours: (start: string, end: string) =>
        set((state) => ({
          player: {
            ...state.player,
            activeHours: { start, end },
          },
        })),

      checkDailyStreak: () =>
        set((state) => {
          const today = new Date().toISOString().split('T')[0]
          const lastLogin = new Date(state.player.lastLoginDate)
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          
          const isConsecutiveDay = lastLogin.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]
          const newStreak = isConsecutiveDay ? state.player.streak + 1 : 1
          
          return {
            player: {
              ...state.player,
              streak: newStreak,
              lastLoginDate: today,
              stats: {
                ...state.player.stats,
                currentStreak: newStreak,
                longestStreak: Math.max(newStreak, state.player.stats.longestStreak),
              },
            },
          }
        }),
    }),
    {
      name: 'solo-leveling-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
) 