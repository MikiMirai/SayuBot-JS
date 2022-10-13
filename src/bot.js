require("dotenv").config();

//Import Discord.JS and provide intents to be used by the bot.
const { Client, Intents } = require('discord.js');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})
const PREFIX = "s"; //Bot prefix. TODO: Command to change it for the current server.

//Console log when bot is started.
client.on('ready', () => {
    console.log('The bot is ready!');
})

//Check every sent message.
client.on('message', async (message) => {
    //If author of message is a bot, return and do nothing.
    if (message.author.bot) return;
    //If message starts with the prefix.
    if (message.content.startsWith(PREFIX)) {
        //Split message into command name and it's arguments.
        const [CMD_NAME, ...args] = message.content
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/);

        //Check if command name matches desired command.
        if (CMD_NAME === 'kick') {
            //Check if message author has kick permissions.
            if (!message.member.permissions.has('KICK_MEMBERS')) {
                return message.reply('You do not have permission to kick members.');
            }
            //Check if command has arguments, send warning message and do nothing if not.
            if (args.length === 0) return message.reply('Please provide an user ID.');
            //Search for provided member.
            const member = message.guild.members.cache.get(arg[0]);
            //If member exists try to kick them, then send a success message or catch an error with an error message.
            if (member) {
                member
                    .kick()
                    .then((member) => message.channel.send(`${member} was kicked.`))
                    .catch((err) => message.channel.send('I cannot kick that user :('));
            } else {
                message.channel.send('That member was not found.'); //If member not found send error message.
            }
        } else if (CMD_NAME === 'ban') {
            //Check if message author has ban permissions.
            if (!message.member.permissions.has('BAN_MEMBERS')) {
                return message.reply('You do not have permission to kick members.');
            }
            //Check if command has arguments, send warning message and do nothing if not.
            if (args.length === 0) return message.reply('Please provide an user ID.');

            //Ban with async, await.
            try {
                //Trying to get and ban the member.
                const user = await message.guild.members.ban(arg[0]);
                message.channel.send('User  was banned successfully.')
            } catch (error) {
                //Log the error if there is any and send a fail message to the channel.
                console.log(error);
                message.channel.send('An error occured. Either I do not have permissions or the user was not found.')
            }
        }
    }
});

client.login(process.env.TOKEN);