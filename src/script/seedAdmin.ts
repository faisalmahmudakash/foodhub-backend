import { Role } from "../../prisma/generated/prisma/enums";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
  try {
    const adminData = {
      name: "faisal admin",
      email: "faisal@gmail.com",
      password: "admin123",
      role: Role.ADMIM,
      phone: "0123546",
    };

    const existEmail = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existEmail) {
      throw new Error("Email are alrady Exists");
    }

    //upload data
    const signUpAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:3000",
        },
        body: JSON.stringify(adminData),
      },
    );

    console.log(signUpAdmin);

    if (signUpAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
    }
  } catch (error: any) {
    console.log(error);
  }
}

seedAdmin();
