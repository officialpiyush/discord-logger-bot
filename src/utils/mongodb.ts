import * as mongoose from "mongoose";
import config from "../../config";

mongoose.connect(config.mongoURI , { useNewUrlParser: true });

const guildSchema = new mongoose.Schema({
    serverID: String,
    logging: {
        messageLog: String,
        voiceLog: String,
        useLog: String
    }
});

let db = mongoose.model("guilds" , guildSchema);

export default db;