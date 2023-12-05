import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { LoggerCustom } from './services/logger.service';
import * as swaggerUI from 'swagger-ui-express';
import * as YAML from 'yamljs';

const swaggerDocs = YAML.load('./swagger.yaml');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerCustom(),
  });

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(
    '/api-docs',
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocs, { explorer: true }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(4000);
}
bootstrap();
