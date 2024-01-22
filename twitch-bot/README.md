# Twitch-bot
A simple twitch bot who can schedule message or send text messages (other commands may to come)

## Installation :
1 - Clone this repo
```
git clone https://github.com/Ex0D/Nykho-Projects.git
```
2 - Install dependencies (pnpm support)
```
pnpm install
```
3 - Edit .env at the root of the project
```
twitchBotUsername=
twitchBotToken=
```
4 - Running the bot
```
pnpm run start
```

## Commands :
► Prefix command (default "+") :
```
+prefix [prefix]
```

► Schedule command (based on time or activity)
- Time :
```
+schedule add [commandName] time [cronExpression with 5 arguments] [message]
```
- Activity :
```
+schedule add [commandName] activity [numberOfMessages] [message]
```

To delete an schedule command :
```
+schedule del [commandName]
```

► Text commands

- Add custom text commands :
```
+txt add [commandName] [message]
```
- Remove custom text commands :
```
+txt del [commandName]
```
- Edit custom text commands :
```
+txt edit [commandName] [message]
```