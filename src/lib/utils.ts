import { Update } from '@/types/Types'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calculateLongestStreak = (updates: Update[]): number => {
  if (updates.length === 0) return 0
  const sortedUpdates = updates.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

  let maxStreak = 1
  let currentStreak = 1

  for (let i = 1; i < sortedUpdates.length; i++) {
    const prevDate = new Date(sortedUpdates[i - 1].created_at).setHours(0, 0, 0, 0)
    const currDate = new Date(sortedUpdates[i].created_at).setHours(0, 0, 0, 0)
    const diffTime = currDate - prevDate
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      continue
    }
    if (diffDays === 1) {
      currentStreak++
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak
      }
    } else if (diffDays > 1) {
      currentStreak = 1
    }
  }

  return maxStreak
}
