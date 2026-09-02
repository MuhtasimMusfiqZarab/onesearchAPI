import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { addGraphqlSwaggerDocumentation } from './graphql.swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('OneSearch API')
    .setDescription(
      'OpenAPI documentation for the OneSearch REST and GraphQL APIs.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('GraphQL', 'Execute all GraphQL queries and mutations')
    .build();
  const document = addGraphqlSwaggerDocumentation(
    SwaggerModule.createDocument(app, config),
  );
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  await app.listen(process.env.PORT || 5000);
}
bootstrap();
