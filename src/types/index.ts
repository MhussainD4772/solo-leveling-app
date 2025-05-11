export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S'

export interface Task {
  id: string
  title: string
  description: string
  xpReward: number
  difficulty: 'E' | 'D' | 'C' | 'B' | 'A' | 'S'
  category: 'daily' | 'weekly' | 'special'
  timeLimit: number // in minutes
  penalty: number // XP penalty for failure
  completed: boolean
  failed: boolean
  dueDate: Date
  createdAt: Date
}

export interface Skill {
  id: string
  name: string
  description: string
  level: number
  maxLevel: number
  unlocked: boolean
  requiredRank: Rank
  xpCost: number
  effects: {
    type: string
    value: number
  }[]
}

export interface Player {
  name: string // character name
  avatar: string // profile picture URL or local asset
  level: number
  exp: number
  totalExp: number
  rank: Rank
  streak: number
  lastLoginDate: string
  activeHours: {
    start: string // HH:mm format
    end: string // HH:mm format
  }
  skills: Skill[]
  stats: {
    tasksCompleted: number
    tasksFailed: number
    totalXpEarned: number
    totalXpLost: number
    currentStreak: number
    longestStreak: number
  }
}

export interface GameState {
  player: Player
  tasks: Task[]
  notifications: {
    enabled: boolean
    lastTaskTime: Date | null
  }
} 