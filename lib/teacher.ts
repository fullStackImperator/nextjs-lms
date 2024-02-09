
const teacherIds = [
  process.env.NEXT_PUBLIC_TEACHER_ID,
  process.env.NEXT_PUBLIC_TEACHER_ID2,
  process.env.NEXT_PUBLIC_TEACHER_ID3,
  process.env.NEXT_PUBLIC_TEACHER_ID4,
]

// export const isTeacher = (userId?:string | null) => {
//     return (
//         teacherIds.includes(userId)
//         // userId === process.env.NEXT_PUBLIC_TEACHER_ID ||
//         // userId === process.env.NEXT_PUBLIC_TEACHER_ID2 ||
//         // userId === process.env.NEXT_PUBLIC_TEACHER_ID3 ||
//         // userId === process.env.NEXT_PUBLIC_TEACHER_ID4
//     )
// }

export const isTeacher = (userId: string | null | undefined): boolean => {
  if (userId === null || userId === undefined) {
    return false // If userId is null or undefined, it's not a teacher
  }
  return teacherIds.includes(userId)
}