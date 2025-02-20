"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const serverUrl = process.env.SWAGGER_SERVER_URL;
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Fullstack KYC App API',
            version: '1.0.0',
            description: 'API documentation for the Fullstack KYC application',
        },
        servers: [
            {
                url: serverUrl,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.ts'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
