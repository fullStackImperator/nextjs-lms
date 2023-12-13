const {PrismaClient} = require('@prisma/client')

const database = new PrismaClient()

async function main() {
    try {
        await database.category.createMany({
            data: [
                {name: "Programmieren"},
                {name: "Musik"},
                {name: "Photographie"},
                {name: "3D Drucken"},
                {name: "Film"},
                {name: "Workshop"},
            ]
        })

        console.log("Success")
    } catch (error) {
        console.log("Error seeding the database categories", error)
    } finally {
        await database.$disconnect()
    }
}

main()