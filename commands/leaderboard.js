const Discord = require("discord.js");

module.exports = {
    name: 'leaderboard',
    aliases: ["lb"],
    usage: 'leaderboard',
    description: 'Outputs the leaderboard for the guild.',

    run: async (message, args, bot) => {
        var users = await bot.db.accounts.find()
        var page = 1
        var leaderboardString = "";

        if (!isNaN(args[0])) {
            page = args[0]
            if (args[1]) chosenMode = args[1]
            else chosenMode = "level"
        } else {
            chosenMode = args[0]
            if (!isNaN(args[1])) page = args[1]
        }

        const modes = [["messages", "msgs", "msg"], ["xp", "experience"], ["level", "lvl"]]
        
        var mode = modes.find(aliase => aliase.includes(chosenMode ? chosenMode.toLowerCase() : mode))
        if (!mode) mode = "level"
        else mode = mode[0]

        users.sort((userA, userB) => userB[mode] - userA[mode])
        var cutUsers = users.slice((20*page - 20), page*20)
        if (cutUsers.length == 0) return bot.error(message, "Sorry, that page does not exist.")
        cutUsers.forEach((user, index) => leaderboardString += `**#${(20*page - 20) + ++index}** <@${user.id}> - ${user[mode]}\n`)

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Leveling Bot - ${{"messages": "Messages", "xp": "Experience", "level": "Level"}[mode]}`)
            .setDescription(leaderboardString)
            .setColor(bot.color)
            .setFooter(`Page: ${page}/${Math.ceil(users.length/20)} | Users: ${users.length.toLocaleString()}`)
        message.channel.send(embed)
    }
}