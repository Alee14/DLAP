# DLAP Bot (Discord.JS Local Audio Player)

A Discord bot that plays local audio tracks. Written in Discord.JS.

[Video Tutorial](https://www.youtube.com/watch?v=7X3FAhYW31I)

If you want to add a feature or there's anything wrong, feel free to make a fork and put a pull request.

# Configuration
Make a new file called `config.json`.
```
{
    "token": "token_here",
    "botOwner": "your_user_id_here",
    "txtFile": true/false
    "statusChannel": "channel_id",
    "voiceChannel": "voice_channel_id"
    "guildID": "guild_id",
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
help - Displays commands.
ping - Pong!
git - Links to the source repo.
about - Information about the bot.

Bot Owner Only
--------------
join - Joins voice chat.
resume - Resumes music.
pause - Pauses music.
skip - Skips the audio track.
leave - Leaves voice chat.
stop - Stops bot.
```

# Forking
When forking the project, you can make your own version of DLAP or help contribute to the project (See the "Contributing" section).

You need to edit `/commands/about.js` to uncomment the `.addField('Forked by', '[your name] (discord#0000)')` section.

Be sure to replace that with your name.

# Contributing
When contributing, be sure to add yourself to the contributors list in `/commands/about.js`.