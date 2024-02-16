import fs, { readFileSync } from 'node:fs';
import { REST, Routes } from 'discord.js';
const { clientID, token } = JSON.parse(readFileSync('./config.json'));

const commands = [];
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const { default: command } = await import(`./Commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST().setToken(token);

// and deploy your commands!
(async() => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(clientID),
      { body: commands }
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
