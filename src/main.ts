import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";



async function bootstrap() {
 
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials:true,
  })
  await app.listen(process.env.SERVER_PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
