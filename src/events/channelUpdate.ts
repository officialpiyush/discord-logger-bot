import { CommandClient, TextChannel, VoiceChannel, CategoryChannel,GuildChannel } from "eris";
import { oldChannel } from "../interfaces/oldChannel";

export = (_bot: CommandClient, channel: TextChannel | VoiceChannel | CategoryChannel, oldChannel: oldChannel) => {
    if(channel instanceof GuildChannel) {
      
    }
}
