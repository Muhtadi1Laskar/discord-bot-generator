import { Client, GatewayIntentBits } from "discord.js";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from "path";

const MESSAGES = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;

    const rules = ["toxic", "spam", "scam"];
    const content = message.content.toLowerCase();

    const hasBadWords = rules.some(word => content.includes(word.toLowerCase()));

    if (hasBadWords) {
        try {
            await message.delete();
            await message.channel.send(`${message.author}, your message was removed`);
            console.log(`Deleted message in ${message.guild.name} ${message.guild.id}`);
        } catch (error) {
            console.error("Failed to delete message: ", e);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);