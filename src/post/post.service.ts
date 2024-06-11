import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/createPostDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePostDto } from './dto/updatePostDto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.post.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async create(createPostDto: CreatePostDto, userId: any) {
    const { title, body } = createPostDto;
    await this.prisma.post.create({ data: { title, body, userId } });
    return { data: 'Post created !' };
  }

  async delete(postId: number, userId: any) {
    // Verifier si la publication existe
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post non trouve');

    // Verifier si l'utilisateur connecte est le proprietaire du post
    if (post.userId !== userId)
      throw new ForbiddenException('Action interdite');
    await this.prisma.post.delete({ where: { id: postId } });
    return { data: 'Post efface' };
  }

  async update(postId: number, userId: any, postDto: UpdatePostDto) {
    // Verifier si la publication existe
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post non trouve');

    // Verifier si l'utilisateur connecte est le proprietaire du post
    if (post.userId !== userId)
      throw new ForbiddenException('Action interdite');
    await this.prisma.post.update({
      where: { id: postId },
      data: { ...postDto },
    });
    return {
      data: 'Post mise a jour',
    };
  }
}
