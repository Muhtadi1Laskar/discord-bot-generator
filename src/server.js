import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from "path";
import app from "./app.js";
import { connectDB } from './config/db.js';
import { moderateMessage } from './services/moderation.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    moderateMessage("1457300353157566727", "this is a message").then(res => console.log(res));
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}\n`);
    });
});