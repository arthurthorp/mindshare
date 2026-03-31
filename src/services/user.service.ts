import { prisma } from "../../prisma/prisma";

export class UserService {
  async findUser(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}
