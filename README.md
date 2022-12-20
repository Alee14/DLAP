# DLAP Bot (Discord.JS Local Audio Player)

DLAP is a Discord bot that lets you play local audio tracks in your server. With DLAP, you can access your music files, and share your tunes with your friends and community. DLAP offers seamless integration with Discord, so you can enjoy your music without missing a beat.

[Video Tutorial](https://youtu.be/Gvva8LHjOOo) | 
[Support Server](https://discord.gg/EFhRDqG)

If you want to add a feature or there's anything wrong, feel free to make a fork and put a pull request.

## Looking for Maintainers
As you know, I may not keep up the project at times. I will need to form a team in order to implement new features and make this project better. 

If you want to become a maintainer, you must at least know this source code, JavaScript and NodeJS. Also you must join my discord server (Support Server) to communicate with me.

# Recommended Software Requirements
- Latest version of NodeJS (v16.9.0+)
- Linux (or WSL for Windows users)

# Configuration
Make a new file called `config.json`.
```
{
    "token": "token_here",
    "txtFile": true/false,
    "shuffle": true/false,
    "repeat": true/false,
    "statusChannel": "channel_id",
    "voiceChannel": "voice_channel_id",
    "clientID": "client_id",
    "ownerID": "your_user_id",
    "djRole": "role_id",
    "presenceActivity": "activity_here",
    "activityType": [0 (Playing)/1 (Streaming)/2 (Listening)/3 (Watching)/4 (Custom)/5 (Competing)]
}
```

Create the `music` folder.

Add your own audio files to the `music` folder.

Deploy the commands by doing `node deploy-command.js`.

Launch the bot using `node bot.js` in terminal.

# Help Command
```
Public Only
-----------
ping - Pong!
status - Checks what audio file is playing currently.
about - Information about the bot.
list - Lists the available audio tracks.
list (page) - Input a number to change the page of the list.
next vote - Goes to next music by vote.
previous vote - Goes to previous music by vote.

Special Permissions Only
--------------
join - Joins voice chat.
play - Resumes music.
play (int) - Input a number for the selection for the audio file.
pause - Pauses music.
next force - Goes to next music by force.
previous force - Goes to previous music by force.
reshuffle - Reshuffles the playlist.
leave - Leaves voice chat.
shutdown - Powers off the bot.
```

# Forking
When forking the project, you can make your own version of DLAP or help contribute to the project (See the "Contributing" section).

You need to edit `/commands/about.js` to uncomment the `{ name: 'Forked by', value: '[your name] (discord#0000)' }` section.

Be sure to replace that with your name.

# Contributing
When contributing, be sure to add yourself to the contributors list in `/commands/about.js`.

# Credits
ChatGPT: Some code in this codebase used ChatGPT
