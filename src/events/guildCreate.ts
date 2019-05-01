import { CommandClient, Guild } from "eris";
import { db } from "../utils/mongodb";
import chalk from "chalk";
export = (_bot: CommandClient, guild: Guild) => {
    let DBguild = new db({ serverID: guild.id, logging: { messageLog: null, voiceLog: null, guildLog: null, userLog: null } });
    DBguild.save().then(() => console.log(`${chalk.blue("Created DB Settings For")} ${chalk.bgBlue(chalk.white(` ${guild.name} `))}`))
}