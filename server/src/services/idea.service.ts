import { User } from "@prisma/client";
import { prisma } from "../../prisma/prisma";
import { CreateIdeaInput, UpdateIdeaInput } from "../dtos/input/idea.input";

export class IdeaService {
  async create(data: CreateIdeaInput, authorId: string) {
    return prisma.idea.create({
      data: {
        title: data.title,
        description: data.description,
        authorId,
      },
    });
  }

  async delete(id: string, user: User) {
    const idea = await prisma.idea.findUnique({
      where: {
        id: id,
      },
    });

    if (!idea) throw new Error("Idea not found");

    if (user.id !== idea.authorId) throw new Error("Cannot delete this idea");

    return prisma.idea.delete({
      where: {
        id,
      },
    });
  }

  async list() {
    return prisma.idea.findMany();
  }

  async findById(id: string) {
    return prisma.idea.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(data: UpdateIdeaInput, id: string, user: User) {
    const idea = await prisma.idea.findUnique({
      where: {
        id: id,
      },
    });

    if (!idea) throw new Error("Idea not found");

    if (user.id !== idea.authorId) throw new Error("Cannot update this idea");

    return prisma.idea.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        description: data.description,
      },
    });
  }
}
