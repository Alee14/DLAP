# DLMP3 Bot (Discord Local MP3)
A Discord bot that plays local mp3 audio tracks. Written in Discord.JS.

[Video Tutorial](https://www.youtube.com/watch?v=7X3FAhYW31I)

(Originally for Alee's birthday)

If there's anything wrong, feel free to make a fork and put a pull request.

# Configuration
Make a new file called `config.json`.
```
{
    "token": "token_here",
    "prefix": "dl:",
    "botOwner": "your_user_id_here",
    "statusChannel": "channel_id",
    "voiceChannel": "voice_channel_id"
}
```

Add your own audio files using the mp3 file extension to the `music` folder.

Launch the bot using `node bot.js` in terminal.

# Help Command
```
Public Only
-----------
help - Displays commands.
ping - Pong!
git - Links to the source repo.
about - About the bot.

Bot Owner Only
--------------
join - Joins voice chat.
skip - Skips the audio track.
leave - Leaves voice chat.
stop - Stops bot.
```
