const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json");
const { HLTV } = require("hltv");

const version = "0.1.0";

client.on("ready", () => {
    console.log("Bot is up and ready");
    console.log("Version: " + version);
});

client.on("message", message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot)
        return;

    const args = message.content
        .slice(config.prefix.length)
        .trim()
        .split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "team" && args.length === 1) {
        HLTV.getTeam({ id: args[0] }).then(res => {
            console.log(res);

            let teamURL =
                `https://www.hltv.org/team/${res.id}/` +
                res.name.toLowerCase().replace(" ", "-");

            let playerText = "";
            if (res.players.length > 0)
                playerText = res.players.map(p => p.name).join("\n");
            else playerText = "No members now.";

            let upcomingEventsText = "";
            if (res.events.length > 0)
                upcomingEventsText = res.events.map(e => e.name).join("\n");
            else upcomingEventsText = "No upcoming events.";

            let recentResultsText = "";
            if (res.recentResults.length > 0)
                recentResultsText = res.recentResults
                    .map(
                        e =>
                            `${e.event.name} | ${res.name} ${e.result} ${
                                e.enemyTeam.name
                            }`
                    )
                    .join("\n");
            else recentResultsText = "No upcoming events.";

            const embed = new Discord.RichEmbed()
                .setColor([0, 174, 134])
                .setTitle(res.name)
                .setURL(teamURL)
                .setThumbnail(res.logo) // Doesn't seem to work with .svg logos
                .addField("Team location", res.location, true)
                .addField("Team rank", res.rank, true)
                .addBlankField()
                .addField("Team members", playerText, true)
                .addField("Upcoming events", upcomingEventsText, true)
                .addBlankField()
                .addField("Recent results", recentResultsText);

            message.channel.send({ embed });
        });
    }
});

client.login(config.token);
