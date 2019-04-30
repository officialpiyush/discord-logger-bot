
import { connect, model, Model, Schema } from "mongoose";
import config from "../../config";
import { GuildInterface } from "../interfaces/GuildInterface";

connect(config.mongoURI, { useNewUrlParser: true });

const guildSchema = new Schema({
    serverID: String,
    logging: {
        messageLog: String,
        voiceLog: String,
        userLog: String
    }
});

export const db: Model<GuildInterface> = model<GuildInterface>("guild", guildSchema);