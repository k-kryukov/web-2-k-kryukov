import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PostDto } from './dto/PostDto';
import { CreatePostDto } from './dto/CreatePostDto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async getAllPosts(): Promise<PostDto[]> {
    return this.prisma.posts.findMany();
  }

  async create(createPost: CreatePostDto): Promise<PostDto> {
    const postDto = new PostDto();
    
    postDto.title = createPost.title;
    postDto.content = createPost.content;

    return this.prisma.posts.create({
      data: postDto,
    });
  }

  async deletePost(id: string): Promise<PostDto> {
    return this.prisma.posts.delete({
      where: {
        id: id,
      },
    });
  }
}
