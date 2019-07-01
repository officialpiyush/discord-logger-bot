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
import * as fs from "fs";
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
            db.findOne({ serverID: guild.id }, (err: any, info: GuildDBInterface) => {
                if (err) return console.log(chalk.red(err));
                info.logging.voiceLog = channel;
                info.save((err: any) => {
                    if (err) {
                        bot.createMessage(msg.channel.id, `An Error Occured \`\`\`${err.message}\`\`\``);
                        return console.log(chalk.red(err));
                    }
                    else {
                        return bot.createMessage(msg.channel.id, `<#${channel}> has been successfully set for 🔊 Voice Logs`)
                    }
                })
            });
            break;

        case false:
            db.findOne({ serverID: guild.id }, (err: any, info: GuildDBInterface) => {
                if (err) return console.log(chalk.red(err));
                info.logging.voiceLog = null;
                info.save((err: any) => {
                    if (err) { 
                        bot.createMessage(msg.channel.id , `An Error Occured \`\`\`${err.message}\`\`\``);
                        return console.log(chalk.red(err));
                    }
                    else {
                        return bot.createMessage(msg.channel.id , `Channel For 🔊 Voice Logs has been cleared.`)
                    }
                })
            });
    }
}, {
        description: "Set a voice logging channel, leave blank to delete the channel from config",
        usage: "<channel> | null"
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
            db.findOne({ serverID: guild.id }, (err: any, info: GuildDBInterface) => {
                if (err) {
                    bot.createMessage(msg.channel.id, `An Error Occured \`\`\`${err.message}\`\`\``);
                    return console.log(chalk.red(err));
                }
                info.logging.userLog = channel;
                info.save((err: any) => {
                    if (err) {
                        bot.createMessage(msg.channel.id, `An Error Occured \`\`\`${err.message}\`\`\``);
                        return console.log(chalk.red(err));
                    }
                    else {
                        return bot.createMessage(msg.channel.id, `<#${channel}> has been successfully set for 👤 User Logs`)
                    }
                })
            });
            break;

        case false:
            db.findOne({ serverID: guild.id }, (err: any, info: GuildDBInterface) => {
                if (err) {
                    bot.createMessage(msg.channel.id, `An Error Occured \`\`\`${err.message}\`\`\``);
                    return console.log(chalk.red(err));
                }
                info.logging.userLog = null;
                info.save((err: any) => {
                    if (err) { 
                        bot.createMessage(msg.channel.id , `An Error Occured \`\`\`${err.message}\`\`\``);
                        return console.log(chalk.red(err));
                    }
                    else {
                        return bot.createMessage(msg.channel.id , `Channel For 👤 User Logs has been cleared.`)
                    }
                })
            });
    }
}, {
        description: "Set a user logging channel, leave blank to delete the channel from config",
        usage: "<channel> | null"
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
            db.findOne({ serverID: guild.id }, (err: any, info: GuildDBInterface) => {
                if (err) {
                    bot.createMessage(msg.channel.id, `An Error Occured \`\`\`${err.message}\`\`\``);
                    return console.log(chalk.red(err));
                }
                info.logging.messageLog = channel;
                info.save((err: any) => {
                    if (err) {
                        bot.createMessage(msg.channel.id, `An Error Occured \`\`\`${err.message}\`\`\``);
                        return console.log(chalk.red(err));
                    }
                    else {
                        return bot.createMessage(msg.channel.id, `<#${channel}> has been successfully set for 💬 Message Logs`)
                    }
                })
            });
            break;

        case false:
            db.findOne({ serverID: guild.id }, (err: any, info: GuildDBInterface) => {
                if (err) {
                    bot.createMessage(msg.channel.id, `An Error Occured \`\`\`${err.message}\`\`\``);
                    return console.log(chalk.red(err));
                }
                info.logging.messageLog = null;
                info.save((err: any) => {
                    if (err) {
                        bot.createMessage(msg.channel.id, `An Error Occured \`\`\`${err.message}\`\`\``);
                        return console.log(chalk.red(err));
                    }
                    else {
                        return bot.createMessage(msg.channel.id, `Channel For 💬 Message Logs has been cleared.`)
                    }
                })
            });
            break;
    }
}, {
        description: "Set a message logging channel, leave blank to delete the channel from config",
        usage: "<channel> | null"
    });

setCommand.registerSubcommand("guildlog", async (msg: Message): Promise<any> => {
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
            db.findOne({ serverID: guild.id }, (err: any, info: GuildDBInterface) => {
                if (err) {
                    bot.createMessage(msg.channel.id, `An Error Occured \`\`\`${err.message}\`\`\``);
                    return console.log(chalk.red(err));
                }
                info.logging.guildLog = channel;
                info.save((err: any) => {
                    if (err) {
                        bot.createMessage(msg.channel.id, `An Error Occured \`\`\`${err.message}\`\`\``);
                        return console.log(chalk.red(err));
                    }
                    else {
                        return bot.createMessage(msg.channel.id, `<#${channel}> has been successfully set for 💈 Guild Logs`)
                    }
                })
            });
            break;

        case false:
            db.findOne({ serverID: guild.id }, (err: any, info: GuildDBInterface) => {
                if (err) {
                    bot.createMessage(msg.channel.id, `An Error Occured \`\`\`${err.message}\`\`\``);
                    return console.log(chalk.red(err));
                }
                info.logging.guildLog = null;
                info.save((err: any) => {
                    if (err) {
                        bot.createMessage(msg.channel.id, `An Error Occured \`\`\`${err.message}\`\`\``);
                        return console.log(chalk.red(err));
                    }
                    else {
                        return bot.createMessage(msg.channel.id, `Channel For 💈 Guild Logs has been cleared.`)
                    }
                })
            });
            break;
    }
}, {
        description: "Set a guild logging channel, leave blank to delete the channel from config",
        usage: "<channel> | null"
    });

bot.registerCommand("config", (msg: Message) => {
    let guild = (msg.channel as TextChannel).guild;
    if (!guild) return bot.createMessage(msg.channel.id, "This Command can Only be Used In A Guild!")
    db.findOne({ serverID: guild.id }, async (err, file) => {
        if (err) {
            bot.createMessage(msg.channel.id, `An Error Occured \`\`\`${err.message}\`\`\``);
            return console.log(chalk.red(err));
        }
        if (!file || file === null) return bot.createMessage(msg.channel.id, "Configuration Not Found!")
        return bot.createMessage(msg.channel.id, {
            embed: {
                title: `Configuration For **${guild.name}**`,
                fields: [
                    {
                        name: "VC Logs",
                        value: file.logging.voiceLog ? `<#${(file as GuildDBInterface).logging.voiceLog}>` : "Not Set"
                    },
                    {
                        name: "Message Logs",
                        value: file.logging.messageLog ? `<#${(file as GuildDBInterface).logging.messageLog}>` : "Not Set"
                    },
                    {
                        name: "Guild Logs",
                        value: file.logging.guildLog ? `<#${(file as GuildDBInterface).logging.guildLog}>` : "Not Set"
                    },
                    {
                        name: "User Logs",
                        value: file.logging.userLog ? `<#${(file as GuildDBInterface).logging.userLog}>` : "Not Set"
                    }
                ]
            }
        })
    });
});

bot.registerCommand("op", (msg: Message) => {
    if (msg.author.id !== "365644930556755969") return;
    let DBguild = new db({ serverID: (msg.channel as GuildChannel).guild.id, logging: { messageLog: null, voiceLog: null, guildLog: null, userLog: null } });
    DBguild.save().then(() => console.log(chalk.blue(`${chalk.blue("Created DB Settings For")} ${chalk.bgBlue(chalk.black((msg.channel as GuildChannel).guild.name))}`)))
});

/* Events */
fs.readdir(process.cwd() + "/build/src/events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      const event = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      bot.on(eventName, event.bind(null, bot));
      delete require.cache[require.resolve(`./events/${file}`)];
    });
  });



process.on("unhandledRejection", (err: any) => {
    console.log(`${chalk.bgRed.black("[UNHANDLED-REJECTION]")} ${chalk.red(err.stack)}`);
})

bot.connect();