import { CommandClient, TextChannel, VoiceChannel, CategoryChannel, GuildChannel, Message } from "eris";
import { db } from "../utils/mongodb";
import { GuildDBInterface } from "../interfaces/GuildDBInterface";
import chalk from "chalk";

export = (_bot: CommandClient, channel: TextChannel | VoiceChannel | CategoryChannel) => {
    if(channel instanceof GuildChannel) {
        db.findOne({serverID: channel.guild.id} , (err: any , file: GuildDBInterface) => {
            if(err) return console.log(chalk.red(err));
            if(!file || file === null || file.logging.guildLog === null) return;
            _bot.createMessage(file.logging.guildLog , {
                    embed: {
                        title: 'Channel Created',
                        author: {
                          name: `${_bot.user.username}#${_bot.user.discriminator}`,
                          icon_url: `${_bot.user.avatarURL}`
                        },
                        color: 12948299,
                        fields: [
                          {
                            name: 'Channel Name',
                            value: `${channel.name}`,
                            inline: false
                          },
                          {
                            name: 'Channel ID',
                            value: `${channel.id}`,
                            inline: true
                          }
                        ]
                      }
            })
        })
    }
}