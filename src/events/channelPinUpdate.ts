import { CommandClient, TextChannel, PrivateChannel } from "eris";
import { db } from "../utils/mongodb";
import { GuildDBInterface } from "../interfaces/GuildDBInterface";
import chalk from "chalk";
import constants from "../utils/constants";

export = (_bot: CommandClient, channel: TextChannel | PrivateChannel) => {
    if(channel instanceof TextChannel) {
        db.findOne({serverID: channel.guild.id} , (err: any, file: GuildDBInterface) => {
            if(err) return console.log(chalk.red(err));
            if(!file || file === null || file.logging.guildLog === null) return;
            _bot.createMessage(file.logging.guildLog , `${constants.update} - \`[CHANNEL_PIN_UPDATE]\`\nA Pin Was Updated In **${channel.name}**`)
        })
    }
}