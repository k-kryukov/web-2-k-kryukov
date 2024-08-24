import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/CreatePostDto';
import { PostsModule } from './posts.module';
import { SessionContainer, SessionClaimValidator } from "supertokens-node/recipe/session";
import { AuthGuard } from 'src/auth/auth.guard';
import UserRoles from "supertokens-node/recipe/userroles";

@Controller('api/posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
  ) {}
  
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'All posts got'})
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get()
  async getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @ApiBasicAuth()
  @ApiOperation({ summary: 'Create a post' })
  @ApiResponse({ status: 200, description: 'Post created'})
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Post()
  @UseGuards(new AuthGuard({
    overrideGlobalClaimValidators: async (globalValidators: SessionClaimValidator[]) => ([
      ...globalValidators,
      UserRoles.UserRoleClaim.validators.includes("Admin")
    ])
  }))
  async createPost(@Body() createPost: CreatePostDto): Promise<PostsModule> {
    return this.postsService.create(createPost);
  }

  @ApiBasicAuth()
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 200, description: 'Post deleted'})
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Delete(':id')
  @UseGuards(new AuthGuard({
    overrideGlobalClaimValidators: async (globalValidators: SessionClaimValidator[]) => ([
      ...globalValidators,
      UserRoles.UserRoleClaim.validators.includes("Admin")
    ])
  }))
  async deletePost(@Param('id') id: string): Promise<PostsModule> {
    return this.postsService.deletePost(id);
  }
}
