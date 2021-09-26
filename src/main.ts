import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Тестовое задание')
        .setDescription('Документация REST API')
        .setVersion('1.0.0')
        .addTag('bsmirnov')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);

    await app.listen(3000, ()=> {
        console.log('listen on 3000');
    });
}

bootstrap();
