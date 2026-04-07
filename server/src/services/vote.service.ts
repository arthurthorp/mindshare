import { prisma } from "../../prisma/prisma";

export class VoteService {
  async toggle(userId: string, ideaId: string): Promise<boolean> {
    const vote = await prisma.vote.findUnique({
      where: {
        userId_ideaId: {
          userId,
          ideaId,
        },
      },
    });

    if (vote) {
      await prisma.vote.delete({
        where: {
          userId_ideaId: {
            userId,
            ideaId,
          },
        },
      });
      return true;
    }

    await prisma.vote.create({
      data: {
        ideaId,
        userId,
      },
    });

    return true;
  }

  async listByIdea(ideaId: string) {
    return prisma.vote.findMany({
      where: {
        ideaId,
      },
    });
  }

  async countVotes(ideaId: string) {
    return prisma.vote.count({
      where: {
        ideaId,
      },
    });
  }
}
