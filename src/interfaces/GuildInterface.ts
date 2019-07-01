import { Document } from "mongoose";

export interface GuildInterface extends Document {
    serverID: string,
    logging: {
        messageLog: string | null,
        voiceLog: string | null,
        guildLog: string | null,
        userLog: string | null
    }
}