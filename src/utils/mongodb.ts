
import * as mongoose from "mongoose";
import config from "../../config";
import { GuildInterface } from "../interfaces/GuildInterface";

mongoose.connect(config.mongoURI, { useNewUrlParser: true });

const guildSchema = new mongoose.Schema({
    serverID: String,
    logging: {
        messageLog: String,
        voiceLog: String,
        userLog: String
    }
});

export const db: mongoose.Model<GuildInterface> = mongoose.model<GuildInterface>("guild", guildSchema);