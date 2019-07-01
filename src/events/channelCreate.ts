import { CommandClient, TextChannel, VoiceChannel, CategoryChannel, GuildChannel, Message } from "eris";
import { db } from "../utils/mongodb";
import { GuildDBInterface } from "../interfaces/GuildDBInterface";
import chalk from "chalk";
import constants from "../utils/constants";
import channelType from "../utils/channelType";

export = (_bot: CommandClient, channel: TextChannel | VoiceChannel | CategoryChannel) => {
    if(channel instanceof GuildChannel) {
        db.findOne({serverID: channel.guild.id} , (err: any , file: GuildDBInterface) => {
            if(err) return console.log(chalk.red(err));
            if(!file || file === null || file.logging.guildLog === null) return;
            _bot.createMessage(file.logging.guildLog , `${constants.add} - \`[CHANNEL_CREATE]\` \n **${channel.name}** \`(${channelType[channel.type]})\` has been created.`)
        })
    }
}