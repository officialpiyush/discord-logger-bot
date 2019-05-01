import { CommandClient, Guild } from "eris";
import { db } from "../utils/mongodb";
import chalk from "chalk";

export = (_bot: CommandClient, guild: Guild) => {
    db.deleteOne({ serverID: guild.id }, (err: any) => {
        if (err) return console.log(chalk.red(err));
    })
}