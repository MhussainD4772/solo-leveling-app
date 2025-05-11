import { Task, Rank } from '../types'

const taskTemplates = {
  daily: [
    {
      title: 'Morning Exercise',
      description: 'Complete a 30-minute workout session',
      xpReward: 50,
      difficulty: 'E' as Rank,
      timeLimit: 30,
      penalty: 25,
    },
    {
      title: 'Reading Challenge',
      description: 'Read for 20 minutes',
      xpReward: 40,
      difficulty: 'E' as Rank,
      timeLimit: 20,
      penalty: 20,
    },
    {
      title: 'Meditation',
      description: 'Meditate for 15 minutes',
      xpReward: 30,
      difficulty: 'E' as Rank,
      timeLimit: 15,
      penalty: 15,
    },
  ],
  weekly: [
    {
      title: 'Project Milestone',
      description: 'Complete a significant milestone in your current project',
      xpReward: 200,
      difficulty: 'C' as Rank,
      timeLimit: 120,
      penalty: 100,
    },
    {
      title: 'Skill Development',
      description: 'Learn a new skill or improve an existing one',
      xpReward: 150,
      difficulty: 'D' as Rank,
      timeLimit: 60,
      penalty: 75,
    },
  ],
  special: [
    {
      title: 'Elite Challenge',
      description: 'Complete a complex task that pushes your limits',
      xpReward: 500,
      difficulty: 'A' as Rank,
      timeLimit: 180,
      penalty: 250,
    },
  ],
}

export const generateTask = (
  category: 'daily' | 'weekly' | 'special',
  activeHours: { start: string; end: string }
): Omit<Task, 'id' | 'completed' | 'failed' | 'createdAt' | 'dueDate'> => {
  const templates = taskTemplates[category]
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)]

  // Calculate a random time within active hours
  const [startHour, startMinute] = activeHours.start.split(':').map(Number)
  const [endHour, endMinute] = activeHours.end.split(':').map(Number)
  
  const startTime = startHour * 60 + startMinute
  const endTime = endHour * 60 + endMinute
  const randomMinutes = Math.floor(Math.random() * (endTime - startTime))
  
  const dueDate = new Date()
  dueDate.setHours(startHour, startMinute + randomMinutes, 0, 0)

  return {
    ...randomTemplate,
    dueDate,
  }
}

export const shouldGenerateTask = (
  lastTaskTime: Date | null,
  activeHours: { start: string; end: string }
): boolean => {
  if (!lastTaskTime) return true

  const now = new Date()
  const [startHour, startMinute] = activeHours.start.split(':').map(Number)
  const [endHour, endMinute] = activeHours.end.split(':').map(Number)

  const currentTime = now.getHours() * 60 + now.getMinutes()
  const startTime = startHour * 60 + startMinute
  const endTime = endHour * 60 + endMinute

  // Check if current time is within active hours
  if (currentTime < startTime || currentTime > endTime) return false

  // Generate a new task if it's been more than 2 hours since the last task
  const hoursSinceLastTask = (now.getTime() - lastTaskTime.getTime()) / (1000 * 60 * 60)
  return hoursSinceLastTask >= 2
} 