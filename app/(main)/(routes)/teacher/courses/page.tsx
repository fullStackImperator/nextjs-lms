// import { Button } from "@/components/ui/button";
// import Link from "next/link";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";




const CoursesPage = async () => {
    const {userId} = auth()

    if (!userId) {
        return redirect("/")
    }

    // // find courses of the teacher !
    // const courses = await db.course.findMany({
    //     where: {
    //         userId: userId,
    //     },
    //     orderBy: {
    //         createdAt: "desc",
    //     }
    // })
    

// const enrolledUsers = await db.purchase.findMany({
//   where: {
//     courseId: YOUR_COURSE_ID, // Replace with the actual course ID you're interested in
//   },
//   select: {
//     userId: true,
//   },
// })



    const coursesWithEnrolledStudents = await db.course.findMany({
      where: {
        userId: userId,
      },
      include: {
        purchases: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Assuming coursesWithEnrolledStudents is an array of Course objects
    const tableData = coursesWithEnrolledStudents.map((course) => ({
      id: course.id,
      title: course.title,
      enrolledStudents: course.purchases.length,
      isPublished: course.isPublished,
    }))

    return (
      <div>
        <div className="p-6">
          {/* <Link href="/teacher/create">
                <Button>
                    New Course
                </Button>
                </Link> */}
          <DataTable columns={columns} data={tableData} />
        </div>
      </div>
    )
}
 
export default CoursesPage;