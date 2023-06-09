import {PrismaClient, Role, User, Module} from "../../types/generated/client";
const db = new PrismaClient();

type UserType = Omit<User, "id">
type ModuleType = Omit<Module, "id" | "teacherId">

async function createUser(user: UserType) {
    return db.user.create({
        data: user,
    });
}

async function createModule(module: ModuleType, teacherId: number) {
    return db.module.create({
        data: {
            ...module,
            teacherId,
        },
    });
}

async function addModuleToUser(userId: number, moduleId: number) {
    return db.user.update({
        where: {
            id: userId,
        },
        data: {
            modules: {
                connect: {
                    id: moduleId,
                },
            },
        },
    });
}

const users: UserType[] = [
    {
        name: "Student 1",
        email: "student1@test.com",
        password: "$2y$10$rWCMp9DU4A36O5KmHgDKLOwDxH45S.zzAItxHZFV1M4QmY0t4xc66",
        role: Role.STUDENT,
    },
    {
        name: "Student 2",
        email: "student2@test.com",
        password: "$2y$10$rWCMp9DU4A36O5KmHgDKLOwDxH45S.zzAItxHZFV1M4QmY0t4xc66",
        role: Role.STUDENT,
    },
    {
        name: "Teacher 1",
        email: "teacher1@test.com",
        password: "$2y$10$rWCMp9DU4A36O5KmHgDKLOwDxH45S.zzAItxHZFV1M4QmY0t4xc66",
        role: Role.TEACHER,
    },
];

const teachers = users.filter((user) => user.role === Role.TEACHER);
const students = users.filter((user) => user.role === Role.STUDENT);

const modules: ModuleType[] = [
    {
        name: "Module 1",
        description: "Module 1 description",
    },
    {
        name: "Module 2",
        description: "Module 2 description",
    },
    {
        name: "Module 3",
        description: "Module 3 description",
    },
    {
        name: "Module 4",
        description: "Module 4 description",
    },
];

async function seed() {
    const createdStudents = await Promise.all(
        students.map((student) => createUser(student))
    );
    const createdTeachers = await Promise.all(
        teachers.map((teacher) => createUser(teacher))
    );
    const createdModules = await Promise.all(
        modules.map((module) => createModule(module, createdTeachers[0].id))
    );

    await addModuleToUser(createdStudents[0].id, createdModules[0].id);
    await addModuleToUser(createdStudents[0].id, createdModules[1].id);
    await addModuleToUser(createdStudents[0].id, createdModules[2].id);
    await addModuleToUser(createdStudents[0].id, createdModules[3].id);

    await addModuleToUser(createdStudents[1].id, createdModules[0].id);
    await addModuleToUser(createdStudents[1].id, createdModules[1].id);
    await addModuleToUser(createdStudents[1].id, createdModules[2].id);
    await addModuleToUser(createdStudents[1].id, createdModules[3].id);
}

seed()
    .then(async () => {
        await db.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await db.$disconnect();
        process.exit(1);
    });
