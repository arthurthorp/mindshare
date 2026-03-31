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
import { CreateCommentInput } from "../dtos/input/comment.input";

@Resolver(() => CommentModel)
@UseMiddleware(isAuth)
export class CommentResolver {
  private ideaService = new IdeaService();
  private userService = new UserService();
  private commentService = new CommentService();

  @Mutation(() => CommentModel)
  async createComment(
    @Arg("data", () => CreateCommentInput) data: CreateCommentInput,
    @Arg("ideaId", () => String) ideaId: string,
    @GqlUser() user: User,
  ): Promise<CommentModel> {
    return this.commentService.create(ideaId, user.id, data);
  }

  @FieldResolver(() => UserModel)
  async author(@Root() idea: IdeaModel): Promise<UserModel> {
    return this.userService.findById(idea.authorId);
  }

  @FieldResolver(() => IdeaModel)
  async idea(@Root() comment: CommentModel): Promise<IdeaModel> {
    return this.ideaService.findById(comment.ideaId);
  }
}
