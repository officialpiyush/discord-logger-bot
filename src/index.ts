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

import {CommandClient} from "eris";
import config from "../config";
import chalk from "chalk";

const bot = new CommandClient(config.token , {} , {
    description: config.description,
    prefix: config.preifx,
    owner: config.owner
});

bot.on("ready" , () => {
    console.log(chalk.blue(`[ BOT ] Logged In as ${bot.user.username} - ${bot.user.id}`));
});

bot.connect();