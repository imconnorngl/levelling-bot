const Discord = require("discord.js");

module.exports = {
    name: 'xp',
    aliases: ["experience"],
    usage: 'xp <@user | user id>',
    description: 'Outputs the xp for a given user.',

    run: async (message, args, bot) => {
        var account = await bot.db.accounts.findOne({ id: message.author.id })
        message.channel.send(`Your xp is \`${account.xp}\``)
    }
}