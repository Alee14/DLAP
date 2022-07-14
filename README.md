# DLAP Bot (Discord.JS Local Audio Player)

A Discord bot that plays local audio tracks. Written in Discord.JS.

[Video Tutorial](https://www.youtube.com/watch?v=7X3FAhYW31I)

If you want to add a feature or there's anything wrong, feel free to make a fork and put a pull request.

# Recommended Software
- Latest version of NodeJS (v18.5.0+)
- Linux (or WSL for Windows users)

# Configuration
Make a new file called `config.json`.
```
{
    "token": "token_here",
    "txtFile": true/false,
    "shuffle": true/false,
    "statusChannel": "channel_id",
    "voiceChannel": "voice_channel_id",
    "clientID": "client_id"
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

Bot Owner Only
--------------
join - Joins voice chat.
play - Resumes music.
play (int) - Input a number for the selection for the audio file.
pause - Pauses music.
next - Goes to next music.
previous - Goes to previous music.
reshuffle - Reshuffles the playlist
leave - Leaves voice chat.
shutdown - Powers off the bot.
```

# Forking
When forking the project, you can make your own version of DLAP or help contribute to the project (See the "Contributing" section).

You need to edit `/commands/about.js` to uncomment the `.addField('Forked by', '[your name] (discord#0000)')` section.

Be sure to replace that with your name.

# Contributing
When contributing, be sure to add yourself to the contributors list in `/commands/about.js`.
