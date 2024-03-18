'use client'

import { Category } from '@prisma/client'
import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
  FcCommandLine,
  FcFactory,
} from 'react-icons/fc'
import { IconType } from 'react-icons'
import { CategoryItem } from '../(routes)/_components/category-item'

interface CategoriesProps {
  categories: Category[]
}

const iconMap: Record<Category['name'], IconType> = {
  Musik: FcMusic,
  Photographie: FcOldTimeCamera,
  Workshop: FcFactory,
  Programmieren: FcCommandLine,
  Film: FcFilmReel,
  '3D Drucken': FcEngineering,
}

export const Categories = ({ categories }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          label={category.name}
          icon={iconMap[category.name]}
          value={category.id}
        />
      ))}
    </div>
  )
}
