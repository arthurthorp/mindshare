import { prisma } from "../../prisma/prisma";
import { CreateIdeaInput, UpdateIdeaInput } from "../dtos/input/idea.input";

export class IdeaService {
  async createIdea(data: CreateIdeaInput, authorId: string) {
    return prisma.idea.create({
      data: {
        title: data.title,
        description: data.description,
        authorId,
      },
    });
  }

  async updateIdea(data: UpdateIdeaInput, id: string) {
    const idea = await prisma.idea.findUnique({
      where: {
        id: id,
      },
    });

    if (!idea) throw new Error("Idea not found");

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
