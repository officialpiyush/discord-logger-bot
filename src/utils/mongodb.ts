
import { connect, model, Model, Schema } from "mongoose";
import config from "../../config";
import { GuildInterface } from "../interfaces/GuildInterface";

connect(config.mongoURI, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });

const guildSchema = new Schema({
    serverID: { type: String, unique: true },
    logging: {
        messageLog: { type: String },
        voiceLog: { type: String },
        userLog: { type: String }
    }
});

export const db: Model<GuildInterface> = model<GuildInterface>("guild", guildSchema);