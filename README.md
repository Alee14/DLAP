# Project Jul-2020 Discord Bot
A Discord bot that's made for Alee's birthday. Written in Discord.JS.

If there's anything wrong, feel free to make a fork and put a pull request.

# Configuration
Make a new file called `config.json`.
```
{
    "token": "token_here",
    "prefix": "!",
    "voiceChannel": "voice_channel_id",
    "botOwner": "your_user_id_here",
    "statusChannel": "channel_id"
}
```

Add your own audio files using the mp3 file extension to `./music`.

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
