import { CommandClient, TextChannel, VoiceChannel, CategoryChannel, GuildChannel } from "eris";
import { db } from "../utils/mongodb";
import chalk from "chalk";
import { GuildDBInterface } from "../interfaces/GuildDBInterface";
import channelType from "../utils/channelType";
import constants from "../utils/constants";

export = (_bot: CommandClient, channel: TextChannel | VoiceChannel | CategoryChannel) => {
    if (channel instanceof GuildChannel) {
        db.findOne({ serverID: channel.guild.id }, (err: any, file: GuildDBInterface) => {
            if (err) return console.log(chalk.red(err));
            if (!file || file === null || file.logging.guildLog === null) return;
            _bot.createMessage(file.logging.guildLog, `${constants.delete} - \`[CHANNEL_DELETE]\`\n**${channel.name}** \`(${channelType[channel.type]})\` has been deleted.`);
        });

    }
}