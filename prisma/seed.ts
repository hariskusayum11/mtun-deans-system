import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  console.log("Starting database seeding...");

  // 1. Clean up: Delete existing data (order matters due to foreign keys)
  await prisma.document.deleteMany();
  await prisma.minute.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.industryActivity.deleteMany();
  await prisma.company.deleteMany();
  await prisma.researchProject.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.facility.deleteMany();
  await prisma.user.deleteMany();
  await prisma.university.deleteMany();
  console.log("Cleaned up existing data.");

  const hashedPassword = await bcrypt.hash("password123", 10);

  // 2. Create Universities
  const unimap = await prisma.university.create({
    data: {
      name: "Universiti Malaysia Perlis",
      short_code: "UniMAP",
      website: "https://www.unimap.edu.my",
      logo_url: "https://www.unimap.edu.my/images/logo.png",
    },
  });
  console.log(`Created university: ${unimap.name}`);

  const uthm = await prisma.university.create({
    data: {
      name: "Universiti Tun Hussein Onn Malaysia",
      short_code: "UTHM",
      website: "https://www.uthm.edu.my",
      logo_url: "https://www.uthm.edu.my/images/logo.png",
    },
  });
  console.log(`Created university: ${uthm.name}`);

  const ump = await prisma.university.create({
    data: {
      name: "Universiti Malaysia Pahang Al-Sultan Abdullah",
      short_code: "UMPSA", // Updated short code
      website: "https://www.umpsa.edu.my",
      logo_url: "https://www.umpsa.edu.my/images/logo.png",
    },
  });
  console.log(`Created university: ${ump.name}`);

  const utem = await prisma.university.create({
    data: {
      name: "Universiti Teknikal Malaysia Melaka",
      short_code: "UTeM",
      website: "https://www.utem.edu.my",
      logo_url: "https://www.utem.edu.my/images/logo.png",
    },
  });
  console.log(`Created university: ${utem.name}`);

  // 3. Create Users
  // Super Admin
  await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "admin@test.com", // Changed email
      password_hash: hashedPassword,
      role: Role.super_admin,
      university_id: unimap.id, // Link Super Admin to UniMAP for now, as per schema
    },
  });
  console.log("Created Super Admin user.");

  // Dean (Test University - UniMAP)
  await prisma.user.create({
    data: {
      name: "Test Dean",
      email: "dean@test.com", // Specified email
      password_hash: hashedPassword,
      role: Role.dean,
      university: {
        connect: {
          id: unimap.id,
        },
      },
    },
  });
  console.log("Created Dean (Test University) user.");

  // Staff/Data Entry (Test University - UniMAP)
  await prisma.user.create({
    data: {
      name: "Test Staff",
      email: "staff@test.com", // Specified email
      password_hash: hashedPassword,
      role: Role.data_entry,
      university: {
        connect: {
          id: unimap.id,
        },
      },
    },
  });
  console.log("Created Staff/Data Entry (Test University) user.");

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
