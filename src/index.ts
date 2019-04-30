/*
* discord-logger-bot
* Copyright (C) 2019  Piyush Bhangale
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* 
  This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.

* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import { CommandClient, Message, PrivateChannel, TextChannel, GuildChannel } from "eris";
import * as util from "util";
import chalk from "chalk";
import config from "../config";
import { db } from "./utils/mongodb";
import { GuildInterface } from "./interfaces/GuildInterface";
import { Db } from "mongodb";
import { GuildDBInterface } from "./interfaces/GuildDBInterface";

const bot = new CommandClient(config.token, {}, {
    description: config.description,
    prefix: config.preifx,
    owner: config.owner
});

bot.on("ready", () => {
    console.log(chalk.blue(`[ BOT ] Logged In as ${bot.user.username} - ${bot.user.id}`));
});

let setCommand = bot.registerCommand("set", (msg: Message) => {
    bot.createMessage(msg.channel.id, {
        embed: {
            title: "List Of Sub-Commands To Set Logging Channel",
            color: 7731560,
            description: "`set vclog` , `set msglog` , `set userlog`",
            footer: {
                text: `${bot.user.username}#${bot.user.discriminator}`
            }
        }
    });
}, {
        description: "See How can We Set The Logs!",
        usage: ""
    });

setCommand.registerSubcommand("vclog", async (msg: Message): Promise<any> => {
    let guild = (msg.channel as TextChannel).guild;
    if (!guild) return bot.createMessage(msg.channel.id, "This Command can Only be Used In A Guild!")
    let channel: string;
    let shouldSet = true;
    if ((msg.channelMentions as Array<string>).length <= 0) shouldSet = false;
    channel = (msg.channelMentions as Array<string>)[0];
    if (shouldSet) {
        let gChannel = await guild.channels.get(channel);
        if (!gChannel) return bot.createMessage(msg.channel.id, "Channel Couldnt be Found!");
    }

    switch (shouldSet) {
        case true:
            db.findOneAndUpdate({ serverID: guild.id }, { logging: { voiceLog: channel } }, { upsert: true, new: true, setDefaultsOnInsert: true }, function (err: any) {
                if (err) return console.log(chalk.red(err.stack))
                else msg.channel.createMessage(`<#${channel}> has been successfully set for 🔊 Voice Logs`);
            });
            break;

        case false:
            db.findOneAndUpdate({ serverID: guild.id }, { logging: { voiceLog: undefined } }, { upsert: true, new: true, setDefaultsOnInsert: true }, function (err: any) {
                if (err) return console.log(chalk.red(err.stack));
                msg.channel.createMessage(`Succesfully removed channel for 🔊 Voice Logs`);
            });
    }
});

bot.registerCommand("config", (msg: Message) => {
    let guild = (msg.channel as TextChannel).guild;
    if (!guild) return bot.createMessage(msg.channel.id, "This Command can Only be Used In A Guild!")
    db.findOne({ serverID: guild.id }, async (err, file) => {
        if (err) return console.log(chalk.red(err.stack));
        if (!file || file === null) return bot.createMessage(msg.channel.id, "Configuration Not Found!")
        console.log(typeof file);
        console.log(file)
        return bot.createMessage(msg.channel.id, {
            embed: {
                title: `Configuration For **${guild.name}**`,
                fields: [
                    {
                        name: "VC Logs",
                        value: `<#${(file as GuildDBInterface).logging.voiceLog}>`
                    }
                ]
            }
        })
    });
});

process.on("unhandledRejection", (err: any) => {
    console.log(`${chalk.bgRed("[UNHANDLED-REJECTION]")} ${chalk.red(err.stack)}`);
})

bot.connect();