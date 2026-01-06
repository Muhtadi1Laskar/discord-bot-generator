import { Client, GatewayIntentBits } from "discord.js";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from "path";;
import { makeAPICall } from "./apiCall.js";

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

    const content = message.content.toLowerCase();
    const requestBody = {
        guildId: message.guildId,
        authorId: message.author.id,
        authorName: message.author.globalName,
        messageContent: content,
        messageId: message.id
    };

    const responseFromBackend = await makeAPICall(requestBody);
    
    console.log(responseFromBackend);
});

const deleteAction = async (message, response) => {
    const { authorName, authorId, reason, messageId } = response;
    await message.delete(messageId);

    switch (reason) {
        case "bannedWords":
            await message.channel.send(`${authorName}, your message was removed because it contained banned word`)
            break;

        case "warn":
            await message.channel.send(`${authorName}, your message was removed because it contained banned word`)
            break;
        default:
            break;
    }
}

client.login(process.env.DISCORD_TOKEN);