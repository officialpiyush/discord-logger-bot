import * as mongoose from "mongoose";
import config from "../../config";

mongoose.connect(config.mongoURI , { useNewUrlParser: true });

const guildSchema = new mongoose.Schema({
    serverID: String,
    logging: {
        messageLog: {type: String, default: undefined},
        voiceLog: {type: String, default: undefined},
        userLog: {type: String, default: undefined}
    }
});

let db = mongoose.model("guilds" , guildSchema);

export default db;