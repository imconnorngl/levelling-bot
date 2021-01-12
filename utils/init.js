const { db, color } = require("../config.json")

const Discord = require("discord.js")
const mongoose = require("mongoose")
const path = require("path")
const fs = require("fs")

const init = async bot => {
    await mongoose.connect(`mongodb+srv://${db.user}:${db.pass}@${db.host}/${db.name}`, { useNewUrlParser: true, useUnifiedTopology: true })

    const accountSchema = new mongoose.Schema({
        id: { type: String, required: true },
        xp: { type: Number, required: true},
        level: { type: Number, required: true},
        messages: { type: Number }
    })

    bot.color = color
    
    bot.db = {
        accounts: mongoose.model("accounts", accountSchema),
    }


    bot.randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

    bot.error = (message, content, dm = false) => {
        const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(content)
            .setThumbnail(`https://statsify.net/img/assets/error.gif`)
        return dm ? message.send({ embed: embed }) : message.channel.send({ embed: embed })
    }

    bot.getAllFiles = (dirPath, arrayOfFiles = []) => {
        const files = fs.readdirSync(dirPath)
        files.forEach((file) => {
            if (fs.statSync(dirPath + "/" + file).isDirectory()) arrayOfFiles = bot.getAllFiles(dirPath + "/" + file, arrayOfFiles);
            else arrayOfFiles.push(path.join(dirPath, "/", file))
        });
        return arrayOfFiles;
    }

    return bot;
}

module.exports = init