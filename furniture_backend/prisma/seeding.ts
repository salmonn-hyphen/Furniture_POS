import { PrismaClient } from "../generated/prisma";
import * as bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

function createRandomUser() {
  return {
    phone: faker.phone.number({ style: "international" }),
    password: "",
    randToken: faker.internet.jwt(),
  };
}

export const userData = faker.helpers.multiple(createRandomUser, {
  count: 5,
});

async function main() {
  console.log("Start seeding....");
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash("1234567", salt);

  for (const u of userData) {
    u.password = password;
    await prisma.user.create({
      data: u,
    });
  }
  console.log("Seeding finished");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
