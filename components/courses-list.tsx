import { Category, Course } from '@prisma/client'
import { CourseCard } from '@/components/course-card'

type CourseWithProgressWithCategory = Course & {
  categories: Category[] | null
  chapters: { id: string }[]
  progress: number | null
}

type CoursesListProps = {
  items: CourseWithProgressWithCategory[]
}

export const CoursesList = ({ items }: CoursesListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {items.map((item) => (
          <CourseCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl!}
            chaptersLength={item.chapters.length}
            level={item.level!}
            progress={item.progress}
            categories={(item.categories || []).map((category) => category.name)}
            prerequisites={item?.prerequisites!}
            vorkenntnisse={item?.vorkenntnisse!}
            kompetenzen={item?.kompetenzen!}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          Kein Projekt gefunden
        </div>
      )}
    </div>
  )
}
