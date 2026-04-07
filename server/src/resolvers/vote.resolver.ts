import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { IdeaModel } from "../models/idea.model";
import { IdeaService } from "../services/idea.service";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { User } from "@prisma/client";
import { isAuth } from "../middlewares/auth.middleware";
import { UserModel } from "../models/user.model";
import { UserService } from "../services/user.service";
import { CommentModel } from "../models/comment.model";

import { VoteModel } from "../models/vote.model";
import { VoteService } from "../services/vote.service";

@Resolver(() => VoteModel)
@UseMiddleware(isAuth)
export class VoteResolver {
  private ideaService = new IdeaService();
  private userService = new UserService();
  private voteService = new VoteService();

  @Mutation(() => Boolean)
  async toogleVote(
    @Arg("ideaId", () => String) ideaId: string,
    @GqlUser() user: User,
  ): Promise<boolean> {
    return this.voteService.toggle(user.id, ideaId);
  }

  @FieldResolver(() => UserModel)
  async user(@Root() vote: VoteModel): Promise<UserModel> {
    return this.userService.findById(vote.userId);
  }

  @FieldResolver(() => IdeaModel)
  async idea(@Root() vote: VoteModel): Promise<IdeaModel> {
    return this.ideaService.findById(vote.ideaId);
  }
}
