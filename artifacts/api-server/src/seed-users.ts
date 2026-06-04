import { eq } from "drizzle-orm";
import { db, pool, usersTable, type UserRole } from "@workspace/db";
import { hashPassword } from "./lib/auth";

const defaultPassword = process.env.SEED_USER_PASSWORD ?? "Arosoft@2026";

const seedUsers: Array<{
  name: string;
  email: string;
  role: UserRole;
}> = [
  { name: "Arosoft Super Admin", email: "superadmin@arosoft.local", role: "SUPER_ADMIN" },
  { name: "Arosoft Admin", email: "admin@arosoft.local", role: "ADMIN" },
  { name: "Support Lead", email: "support@arosoft.local", role: "SUPPORT" },
  { name: "Client User", email: "client@arosoft.local", role: "CLIENT" },
  { name: "Student User", email: "student@arosoft.local", role: "STUDENT" },
  { name: "Frontend Developer", email: "frontend@arosoft.local", role: "FRONTEND_DEVELOPER" },
  { name: "Backend Developer", email: "backend@arosoft.local", role: "BACKEND_DEVELOPER" },
  { name: "Fullstack Developer", email: "fullstack@arosoft.local", role: "FULLSTACK_DEVELOPER" },
  { name: "Marketing User", email: "marketing@arosoft.local", role: "MARKETING" },
  { name: "Video Editor", email: "video@arosoft.local", role: "VIDEO_EDITOR" },
  { name: "Finance User", email: "finance@arosoft.local", role: "FINANCE" },
  { name: "Compliance User", email: "compliance@arosoft.local", role: "COMPLIANCE" },
];

async function seed() {
  const passwordHash = await hashPassword(defaultPassword);

  for (const user of seedUsers) {
    const [existingUser] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, user.email))
      .limit(1);

    if (existingUser) {
      await db
        .update(usersTable)
        .set({
          name: user.name,
          role: user.role,
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(usersTable.id, existingUser.id));
      continue;
    }

    await db.insert(usersTable).values({
      ...user,
      passwordHash,
      isActive: true,
    });
  }

  console.log(`Seeded ${seedUsers.length} users. Default password: ${defaultPassword}`);
}

seed()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
