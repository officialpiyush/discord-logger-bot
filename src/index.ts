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

import { CommandClient, Message, PrivateChannel, TextChannel, GuildChannel, Guild } from "eris";
import "./utils/eris-additions";
import * as util from "util";
import chalk from "chalk";
import config from "../config";
import { db } from "./utils/mongodb";
import { GuildInterface } from "./interfaces/GuildInterface";
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
        db.findOne({serverID: guild.id} , (err: any, info: GuildDBInterface) => {
            if(err) return console.log(chalk.red(err));
            info.logging.voiceLog = channel;
            info.save((err: any) => {
                if(err) return console.log(chalk.red(err))
            })
        });
            break;

        case false:
        db.findOne({serverID: guild.id} , (err: any, info: GuildDBInterface) => {
            if(err) return console.log(chalk.red(err));
            info.logging.voiceLog = null;
            info.save((err: any) => {
                if(err) return console.log(chalk.red(err))
            })
        });
    }
});

setCommand.registerSubcommand("userlog", async (msg: Message): Promise<any> => {
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
        db.findOne({serverID: guild.id} , (err: any, info: GuildDBInterface) => {
            if(err) return console.log(chalk.red(err));
            info.logging.userLog = channel;
            info.save((err: any) => {
                if(err) return console.log(chalk.red(err))
            })
        });
            break;

        case false:
        db.findOne({serverID: guild.id} , (err: any, info: GuildDBInterface) => {
            if(err) return console.log(chalk.red(err));
            info.logging.userLog = null;
            info.save((err: any) => {
                if(err) return console.log(chalk.red(err))
            })
        });
    }
});

setCommand.registerSubcommand("msglog", async (msg: Message): Promise<any> => {
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
            db.findOne({serverID: guild.id} , (err: any, info: GuildDBInterface) => {
                if(err) return console.log(chalk.red(err));
                info.logging.messageLog = channel;
                info.save((err: any) => {
                    if(err) return console.log(chalk.red(err))
                })
            });
            break;
        
        case false:
        db.findOne({serverID: guild.id} , (err: any, info: GuildDBInterface) => {
            if(err) return console.log(chalk.red(err));
            info.logging.messageLog = null;
            info.save((err: any) => {
                if(err) return console.log(chalk.red(err))
            })
        });
        break;
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

bot.registerCommand("op" , (msg: Message) => {
    if(msg.author.id !== "365644930556755969") return;
    let DBguild = new db({ serverID: (msg.channel as GuildChannel).guild.id, logging: { messageLog: "", voiceLog: "", userLog: "" } });
    DBguild.save().then(() => console.log(chalk.blue(`Created DB Settings For ${chalk.bgBlue((msg.channel as GuildChannel).guild.name)}`)))
});


/* Events */

// Make DB Document For The Guild
bot.on("guildCreate", async (guild: Guild) => {
    let DBguild = new db({ serverID: guild.id, logging: { messageLog: "", voiceLog: "", userLog: "" } });
    DBguild.save().then(() => console.log(`${chalk.blue("Created DB Settings For")} ${chalk.bgBlue(guild.name)}`))
});

// Delete DB Document For Guild
bot.on("guildDelete" , (guild: Guild) => {
    db.deleteOne({serverID: guild.id} , (err: any) => {
        if(err) return console.log(chalk.red(err));
    })
})
process.on("unhandledRejection", (err: any) => {
    console.log(`${chalk.bgRed("[UNHANDLED-REJECTION]")} ${chalk.red(err.stack)}`);
})

bot.connect();