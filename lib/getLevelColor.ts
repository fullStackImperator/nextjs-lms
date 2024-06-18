// utils/getLevelColor.ts

export const getLevelColor = (level: number) => {
  const colors = [
    'bg-green-500', // Level 1
    'bg-yellow-500', // Level 2
    'bg-orange-500', // Level 3
    'bg-red-500', // Level 4
    'bg-purple-500', // Level 5
    // Add more colors if you have more levels
  ]
  return colors[level - 1] || 'bg-gray-500' // Default color if level is out of range
}
