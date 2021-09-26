"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Тестовое задание')
        .setDescription('Документация REST API')
        .setVersion('1.0.0')
        .addTag('bsmirnov')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('/api/docs', app, document);
    await app.listen(3000, () => {
        console.log('listen on 3000');
    });
}
bootstrap();
//# sourceMappingURL=main.js.map