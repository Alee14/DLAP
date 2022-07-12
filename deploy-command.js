import fs, { readFileSync } from 'node:fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
// import config from './config.json' assert {type: 'json'}
const { clientID, token } = JSON.parse(readFileSync('./config.json'));

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const { default: command } = await import(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationCommands(clientID), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
