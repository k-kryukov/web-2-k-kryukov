import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { PostsService } from './posts/posts.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { AppGateway } from './app.gateway';
import { SessionCleanupMiddleware } from './session-cleanup.middleware';

@Module({
  imports: [
    PostsModule,
    AuthModule.forRoot({
      // These are the connection details of the app you created on supertokens.com
      connectionURI: process.env.SUPERTOKENS_CONNECTION_URI,
      apiKey: process.env.SUPERTOKENS_API_KEY,
      appInfo: {
        // Learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo
        appName: "...",
        apiDomain: process.env.DOMAIN,
        websiteDomain: process.env.DOMAIN,
        apiBasePath: "/auth",
        websiteBasePath: "/auth"
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PostsModule,
    PostsService,
    PrismaService,
    AppGateway
  ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(SessionCleanupMiddleware).forRoutes(AppController);
    }
}
