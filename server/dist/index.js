"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./swagger"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const auth_1 = __importDefault(require("./routes/auth"));
const kyc_1 = __importDefault(require("./routes/kyc"));
const admin_1 = __importDefault(require("./routes/admin"));
const errorHandler_1 = require("./middleware/errorHandler");
const seed_1 = require("./seed");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
const uploadsDir = path_1.default.join(__dirname, '..', 'uploads');
console.log('Checking uploads directory at:', uploadsDir);
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir);
    console.log('Uploads folder created at:', uploadsDir);
}
else {
    console.log('Uploads folder exists at:', uploadsDir);
}
// Rate Limiting: limit each IP to 100 requests per 15 minutes
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);
// Middleware setup
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static files from the uploads folder (for accessing uploaded documents)
app.use('/uploads', express_1.default.static('uploads'));
// MongoDB connection
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => {
    console.log('MongoDB connected');
    (0, seed_1.seedAdmin)();
})
    .catch((err) => console.error('MongoDB connection error:', err));
// routes
app.use('/api/auth', auth_1.default);
app.use('/api/kyc', kyc_1.default);
app.use('/api/admin', admin_1.default);
// Swagger API Docs
if (process.env.NODE_ENV !== 'production') {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
}
app.get('/', (req, res) => {
    res.send('API is working');
});
app.use((req, res, next) => {
    const error = new Error('Route not found');
    res.status(404);
    next(error);
});
// Global Error Handling 
app.use(errorHandler_1.errorHandler);
// start the server if not in test mode
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
exports.default = app;
