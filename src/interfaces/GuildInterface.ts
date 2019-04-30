import { Document } from "mongoose";

export interface GuildInterface extends Document {
    serverID: string,
    logging: {
        messageLog: string | undefined,
        voiceLog: string | undefined,
        userLog: string | undefined
    }
}