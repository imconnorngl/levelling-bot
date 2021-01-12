const getExpForLevel = level => ({ 0: 5, 1: 10, 2: 20, 3: 35 }[level % 100]) || 50
const getLevel = exp => {
    var prestiges = Math.floor(exp / 4870);
    var level = prestiges * 100;
    var remainingExp = exp - (prestiges * 4870);

    for (let i = 0; i < 4; ++i) {
        var expForNextLevel = getExpForLevel(i)
        if (remainingExp < expForNextLevel) break;
        level++
        remainingExp -= expForNextLevel
    }

    return Math.floor(level + (remainingExp / 50))
}

const xpGenerator = async (bot, user) => {
    var account = await bot.db.accounts.findOne({ id: user.id })
    if (!account) await new bot.db.accounts({ id: user.id, level: 0, xp: 0, messages: 1 }, { useFindAndModify: false }).save()
    else await bot.db.accounts.findOneAndUpdate({ id: user.id }, { $inc: { messages: 1 } }, { useFindAndModify: false })

    const now = Date.now();

    if (!bot.cooldowns.has(user.id)) {
        bot.cooldowns.set(user.id, now);
        setTimeout(() => bot.cooldowns.delete(user.id), 15000);
    } else {
        const expirationTime = bot.cooldowns.get(user.id) + 15000;
        if (now < expirationTime) return;
        bot.cooldowns.set(user.id, now);
        setTimeout(() => bot.cooldowns.delete(user.id), 15000);
    }

    const xp = account.xp + bot.randomInt(10, 15)
    const level = getLevel(xp)

    await bot.db.accounts.findOneAndUpdate({ id: user.id }, { xp, level }, { useFindAndModify: false })
}

module.exports = xpGenerator
