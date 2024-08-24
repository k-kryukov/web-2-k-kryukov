import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { WsAuthGuard } from './auth/ws.guard';
import { PostsService } from './posts/posts.service';
import { CreatePostDto } from './posts/dto/CreatePostDto';

@WebSocketGateway({
  cors: {
    origin: process.env.DOMAIN,
    credentials: true,
  },
})
export class AppGateway {
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('AppGateway');
  constructor(
    private postsService: PostsService
  ) {}

  @SubscribeMessage('createPost')
  @UseGuards(new WsAuthGuard())
  async handleCreatePost(@MessageBody() payload: {title: string, content: string}, @ConnectedSocket() client: Socket): Promise<void> {
    this.logger.log(`createPost: ${payload}`);

    await this.postsService.create(payload as CreatePostDto)

    const newposts = await this.postsService.getAllPosts();

    this.server.emit('PostsUpdate', newposts);
  }

  @SubscribeMessage('deletePost')
  @UseGuards(new WsAuthGuard())
  async handleDeletePost(@MessageBody() id: string, @ConnectedSocket() client: Socket): Promise<void> {
    try {
      this.logger.log(`deletePost: ${id}`);

      await this.postsService.deletePost(id)

      const newposts = await this.postsService.getAllPosts();

      this.server.emit('PostsUpdate', newposts);
    } catch {}
  }
}