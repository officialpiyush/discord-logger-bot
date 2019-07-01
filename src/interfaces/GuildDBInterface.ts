import { GuildInterface } from "./GuildInterface";
import { ObjectId } from "bson";

export interface GuildDBInterface extends GuildInterface {
    _id: ObjectId,
    __v: number
}