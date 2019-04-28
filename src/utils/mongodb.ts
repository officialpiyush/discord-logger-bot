import * as mongoose from "mongoose";
import config from "../../config";

mongoose.connect(config.mongoURI, { useNewUrlParser: true });

const guildSchema = new mongoose.Schema({
    serverID: String,
    messageLog: String,
    voiceLog: String,
    userLog: String

});

let db = mongoose.model("guilds", guildSchema);

export default db;