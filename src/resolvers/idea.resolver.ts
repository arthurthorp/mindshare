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
import { CreateIdeaInput, UpdateIdeaInput } from "../dtos/input/idea.input";
import { IdeaService } from "../services/idea.service";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { User } from "@prisma/client";
import { isAuth } from "../middlewares/auth.middleware";
import { UserModel } from "../models/user.model";
import { UserService } from "../services/user.service";
import { CommentModel } from "../models/comment.model";
import { CommentService } from "../services/comment.service";
import { VoteModel } from "../models/vote.model";
import { VoteService } from "../services/vote.service";

@Resolver(() => IdeaModel)
@UseMiddleware(isAuth)
export class IdeaResolver {
  private ideaService = new IdeaService();
  private userService = new UserService();
  private commentService = new CommentService();
  private voteService = new VoteService();

  @Mutation(() => IdeaModel)
  async createIdea(
    @Arg("data", () => CreateIdeaInput) data: CreateIdeaInput,
    @GqlUser() user: User,
  ): Promise<IdeaModel> {
    return this.ideaService.create(data, user.id);
  }

  @Mutation(() => IdeaModel)
  async updateIdea(
    @Arg("data", () => UpdateIdeaInput) data: UpdateIdeaInput,
    @Arg("id", () => String) id: string,
    @GqlUser() user: User,
  ): Promise<IdeaModel> {
    return this.ideaService.update(data, id, user);
  }

  @Mutation(() => Boolean)
  async deleteIdea(
    @Arg("id", () => String) id: string,
    @GqlUser() user: User,
  ): Promise<boolean> {
    await this.ideaService.delete(id, user);

    return true;
  }

  @Query(() => [IdeaModel])
  async listIdeas(): Promise<IdeaModel[]> {
    return this.ideaService.list();
  }

  @FieldResolver(() => UserModel)
  async author(@Root() idea: IdeaModel): Promise<UserModel> {
    return this.userService.findById(idea.authorId);
  }

  @FieldResolver(() => [CommentModel])
  async comments(@Root() idea: IdeaModel): Promise<CommentModel[]> {
    return this.commentService.listByIdea(idea.id);
  }

  @FieldResolver(() => [VoteModel])
  async votes(@Root() idea: IdeaModel): Promise<VoteModel[]> {
    return this.voteService.listByIdea(idea.id);
  }

  @FieldResolver(() => Number)
  async countVotes(@Root() idea: IdeaModel): Promise<Number> {
    return this.voteService.countVotes(idea.id);
  }
}
