import { prisma } from "../../prisma/prisma";
import { CreateUserInput } from "../dtos/input/user.input";

export class UserService {
  async createUser(data: CreateUserInput) {
    const findUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (findUser) throw new Error("User already registered");

    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
      },
    });
  }

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
