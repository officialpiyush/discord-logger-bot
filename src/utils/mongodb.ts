
import { connect, model, Model, Schema } from "mongoose";
import config from "../../config";
import { GuildInterface } from "../interfaces/GuildInterface";

connect(config.mongoURI, { useNewUrlParser: true });

const guildSchema = new Schema({
    serverID: { type: String, unique: true },
    logging: {
        messageLog: { type: String, default: undefined },
        voiceLog: { type: String, default: undefined },
        userLog: { type: String, default: undefined }
    }
});

export const db: Model<GuildInterface> = model<GuildInterface>("guild", guildSchema);