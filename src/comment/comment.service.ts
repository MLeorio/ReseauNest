import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/createCommentDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCommentDto } from './dto/updateCommentDto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createCommentDto: CreateCommentDto) {
    const { postId, content } = createCommentDto;
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post non trouve');
    await this.prisma.comment.create({
      data: {
        content,
        userId,
        postId,
      },
    });

    return { data: 'commentaire creee' };
  }

  async delete(commentId: number, current_user: any, postId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) throw new NotFoundException('Commentaire non trouve');
    if (comment.postId !== postId)
      throw new UnauthorizedException(
        "L'identifiant du post ne correspond pas",
      );
    if (comment.userId !== current_user)
      throw new ForbiddenException('Action interdite');
    await this.prisma.comment.delete({ where: { id: commentId } });
    return { data: 'Commentaire supprimer avec succes' };
  }

  async update(
    commentId: number,
    updateCommentDto: UpdateCommentDto,
    current_user: any,
  ) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) throw new NotFoundException('Commentaire non trouve');
    if (comment.userId !== current_user)
      throw new ForbiddenException('Action interdite');

    await this.prisma.comment.update({
      where: { id: commentId },
      data: { ...updateCommentDto },
    });
    return {
      data : "Comment bien modifier"
    }
  }
}
