"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = void 0;
const User_1 = __importDefault(require("./models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if an admin user already exists
        const adminExists = yield User_1.default.findOne({ role: 'Admin' });
        if (!adminExists) {
            // Use environment variables if provided, otherwise default values
            const adminName = process.env.ADMIN_NAME;
            const adminEmail = process.env.ADMIN_EMAIL;
            const adminPassword = process.env.ADMIN_PASSWORD;
            // Hash the password
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPassword = yield bcrypt_1.default.hash(adminPassword, salt);
            // Create the admin user
            const adminUser = new User_1.default({
                name: adminName,
                email: adminEmail,
                password: hashedPassword,
                role: 'Admin',
            });
            yield adminUser.save();
            console.log(`Admin user created: ${adminEmail}`);
        }
        else {
            console.log('Admin user already exists');
        }
    }
    catch (error) {
        console.error('Error seeding admin user:', error);
    }
});
exports.seedAdmin = seedAdmin;
