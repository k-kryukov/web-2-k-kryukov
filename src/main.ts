import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { resolve } from 'path';
import * as hbs from 'hbs';
import { TimingInterceptor } from './timing.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import supertokens from 'supertokens-node';
import { SupertokensExceptionFilter } from './auth/auth.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, config);

  app.enableCors({
    origin: [process.env.DOMAIN],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  app.useStaticAssets(resolve('./src/public'));
  app.setBaseViewsDir(resolve('./src/views'));
  hbs.registerPartials(resolve('./src/views/partials'));
  app.setViewEngine('hbs');

  hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
  });

  app.useGlobalInterceptors(new TimingInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new SupertokensExceptionFilter());

  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
