import bcrypt from "bcryptjs";
import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const plainPassword = process.env.ADMIN_PASSWORD ?? "admin";

  const existing = await prisma.admin.findUnique({ where: { username } });
  if (existing) {
    console.log(`Admin "${username}" already exists. Skipping.`);
    return;
  }

  const hashed = await bcrypt.hash(plainPassword, 12);
  const admin = await prisma.admin.create({
    data: { username, password: hashed },
  });

  console.log(`✅ Admin created: ${admin.username} (id: ${admin.id})`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
