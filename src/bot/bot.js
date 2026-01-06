import { Client, GatewayIntentBits } from "discord.js";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from "path";
import { connectDB } from "../config/db.js";
import { getRules } from "./dataOperations.js";

const MESSAGES = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`\n Logged in as ${client.user.tag}!\n`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;

    if (!/[a-zA-Z0-9]/.test(message.content)) {
        return;
    }

    // const { bannedWords, actions } = await getRules(message.guild.id);
    const content = message.content.toLowerCase();

    const requestBody = {
        guildId: message.guildId,
        authorId: message.author.id,
        authorName: message.author.globalName,
        messageContent: content
    };

    // const hasBadWords = bannedWords.some(word => content.includes(word.toLowerCase()));
    // const { delete: shouldDelete, warnUser } = actions;

    // if (hasBadWords) {
    //     try {
    //         if (shouldDelete) {
    //             await message.delete();
    //             await message.channel.send(`${message.author}, your message was removed`);
    //             console.log(`\nDeleted message in ${message.guild.name} ${message.guild.id}\n`);
    //         }

    //         if (warnUser) {
    //             await message.channel.send("Follow the rules cunt");

    //         }
    //     } catch (error) {
    //         console.error("Failed to delete message: ", e);
    //     }
    // }
});

connectDB().then(() => {
    client.login(process.env.DISCORD_TOKEN);
});