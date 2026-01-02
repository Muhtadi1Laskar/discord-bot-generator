import express from 'express';

const app = express();

// app.use(express.cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    const authURL = `https://discord.com/api/oauth2/authorize?client_id=1456671312008319194&permissions=76800&scope=bot`;

    res.send(`
        <h2>🔒 Custom Moderator Bot</h2>
        <a href="${authURL}" target="_blank">
        ➕ Add Bot to Your Server
        </a>
        <p>Then come back here to set your rules.</p>
        <form action="/set-rules" method="post">
        <input name="guildId" placeholder="Your Server ID" required />
        <input name="bannedWords" placeholder="Banned words (comma-separated)" required />
        <input name="bannedDomains" placeholder="Banned domains (comma-separated)" />
        <button type="submit">Save Rules</button>
        </form>
    `);
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});