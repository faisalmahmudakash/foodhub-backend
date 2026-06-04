import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT;

async function main() {
  try {
    await prisma.$connect();
    console.log("Server is Connected");

    app.listen(PORT, () => {
      console.log("port is  connected", PORT);
    });
  } catch (error) {
    console.log("Somthing Wrong");
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
