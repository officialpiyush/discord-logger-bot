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
import chalk from "chalk";
import config from "../config";
import db from "./utils/mongodb";

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
    console.log((msg.channelMentions as Array<string>).length);
    // if(typeof msg.channel !== TextChannel) throw bot.createMessage(msg.channel.id, "This Command can Only be Used In A Guild!")
    let guild = (msg.channel as TextChannel).guild;
    if (!guild) return bot.createMessage(msg.channel.id, "This Command can Only be Used In A Guild!")
    let channel: string;
    let shouldSet = true;
    if ((msg.channelMentions as Array<string>).length <= 0) shouldSet = false;
    channel = (msg.channelMentions as Array<string>)[0];
    if(shouldSet){
    let gChannel = await guild.channels.get(channel);
    if (!gChannel) return bot.createMessage(msg.channel.id, "Channel Couldnt be Found!");
    }
    console.log(shouldSet);


    switch (shouldSet) {
        case true:
        db.findOne({serverID: guild.id} , async (err, file) => {
            if (err) return console.log(chalk.red(err.stack));
            if(!file || file === null) {
                console.log("0");
            let stage = new db();
            (stage as any).serverID = guild.id;
            (stage as any).logging.voicelog = channel;
            await stage.save();
        } else if(file || file !== null){
            console.log("1");
            await db.updateOne({serverID: guild.id} , {logging : { voicelog: channel}});
        }
    });
            break;
        
        case false:
        console.log("2");
            await db.updateOne({serverID: guild.id} , {logging : { voicelog: undefined}});
            break;
    }
});

process.on("unhandledRejection" , (err: any) => {
    console.log(chalk.red(err.stack));
})

bot.connect();