import { Document } from "mongoose";

export interface GuildInterface extends Document {
    serverID: string,
    logging: {
    messageLog: string,
    voiceLog: string,
    userLog: string
    }
}