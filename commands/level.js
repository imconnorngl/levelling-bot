const Discord = require("discord.js");

module.exports = {
    name: 'level',
    aliases: ["lvl"],
    usage: 'level <@user | user id>',
    description: 'Outputs the level for a given user.',

    run: async (message, args, bot) => {
        var account = await bot.db.accounts.findOne({ id: message.author.id }) || {}
        message.channel.send(`Your level is \`${account.level || 0}\``)
    }
}
