import { Controller, Get, Render, Headers, Head, Header, UseGuards, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeController } from '@nestjs/swagger';
import { PostsService } from './posts/posts.service';

import { SessionContainer } from "supertokens-node/recipe/session";
import { AuthGuard } from './auth/auth.guard';
import { Session } from './auth/session/session.decorator';
import Session_ from "supertokens-node/recipe/session";
import UserRoles from "supertokens-node/recipe/userroles";

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly postsService: PostsService
  ) {}

  @Get()
  @Render('index')
  async renderIndex(
    @Headers('processing-time') processingTime: string,
    @Req() req: Request, 
    @Res() res: Response
  ) {
    let session = await Session_.getSession(req, res, { sessionRequired: false })

    let InSession = false;
    let admin = false;

    if (session !== undefined && session.getUserId() !== undefined) {
      InSession = true;
      const response = await UserRoles.getRolesForUser("public", session.getUserId())
      const roles: string[] = response.roles;

      admin = roles.includes("Admin")
    }

    const posts = await this.postsService.getAllPosts();
    return {
      loadtime: processingTime,
      posts: posts,
      InSession: InSession,
      admin: admin
    }
  }

  @Get('about')
  @Render('about')
  async renderAbout(
    @Headers('processing-time') processingTime: string,
    @Req() req: Request, 
    @Res({ passthrough: true }) res: Response
  ) {
    const session = await Session_.getSession(req, res, { sessionRequired: false })

    let InSession = false;

    if (session !== undefined && session.getUserId() !== undefined) {
      InSession = true;
    }

    return {
      loadtime: processingTime,
      InSession: InSession,
    }
  }

  @Get('timetable')
  @Render('timetable')
  async renderTimetable(
    @Headers('processing-time') processingTime: string,
    @Req() req: Request, 
    @Res({ passthrough: true }) res: Response
  ) {
    const session = await Session_.getSession(req, res, { sessionRequired: false })

    let InSession = false;

    if (session !== undefined && session.getUserId() !== undefined) {
      InSession = true;
    }

    return {
      loadtime: processingTime,
      InSession: InSession,
    }
  }

  @UseGuards(new AuthGuard())
  @Get('session')
  async getTest(@Session() session: SessionContainer): Promise<string> {
    return "magic";
  }
}
