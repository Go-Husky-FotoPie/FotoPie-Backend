import "dotenv/config";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import { SentryExceptionFilter } from "./common/helpers/sentry-exception-filter.helper";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Cors
  app.enableCors({
    origin: true,
    methods: "GET,HEAD,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix("api");

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('FotoPie Swagger API Document')
    .setDescription('This is the API document for FotoPie')
    .setVersion('1.0')
    .addTag('FotoPie')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Sentry
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
   });
   const { httpAdapter } = app.get(HttpAdapterHost);
   app.useGlobalFilters(new SentryExceptionFilter(httpAdapter));

  //Listening port
  await app.listen(app.get(ConfigService).get("port"));
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
