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

    const courses = await db.course.findMany({
        where: {
            userId: userId,
        },
        orderBy: {
            createdAt: "desc",
        }
    })
    
    return (
      <div>
        <div className="p-6">
          {/* <Link href="/teacher/create">
                <Button>
                    New Course
                </Button>
                </Link> */}
          <DataTable columns={columns} data={courses} />
        </div>
      </div>
    )
}
 
export default CoursesPage;