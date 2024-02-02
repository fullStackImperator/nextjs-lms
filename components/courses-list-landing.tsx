import { Category, Course } from '@prisma/client'
import { CourseCard } from '@/components/course-card'

type CourseWithCategory = Course & {
  category: Category | null
  chapters: { id: string }[]
}

type CoursesListProps = {
  items: CourseWithCategory[]
}

export const CoursesListLanding = ({ items }: CoursesListProps) => {

//   console.log('items: ', items)

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <CourseCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl!}
            chaptersLength={item.chapters.length}
            level={item?.level!}
            category={item?.category?.name!}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          Kein Kurs gefunden
        </div>
      )}
    </div>
  )
}
