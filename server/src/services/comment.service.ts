import { prisma } from "../../prisma/prisma";
import { CreateCommentInput } from "../dtos/input/comment.input";

export class CommentService {
  async create(ideaId: string, authorId: string, data: CreateCommentInput) {
    const findIdea = await prisma.idea.findUnique({
      where: {
        id: ideaId,
      },
    });

    if (!findIdea) throw new Error("Idea no found");

    return prisma.comment.create({
      data: {
        ideaId,
        authorId,
        content: data.content,
      },
    });
  }

  async listByIdea(ideaId: string) {
    return prisma.comment.findMany({
      where: {
        ideaId,
      },
    });
  }
}
