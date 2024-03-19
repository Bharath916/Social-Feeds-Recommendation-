import mongoose = require("mongoose");
import { config } from "../config/config";

const Config = new config();

export function getCollectionObject(collectionName: string, Schema: any) {
  let collectionExists: any = false;
  let collection: any = {};
  try {
    for (var i = 0; i < Config.dynamicModels.length; i++) {
      if (Config.dynamicModels[i]["name"] === collectionName) {
        collection = Config.dynamicModels[i];
        collectionExists = true;
        break;
      }
    }

    if (!collectionExists) {
      collection["name"] = collectionName;
      collection["model"] = mongoose.model(
        collectionName,
        Schema,
        collectionName
      );
      Config.dynamicModels.push(collection);
    }
  } catch (error) {
    console.log("error", error);
  }
  return collection["model"];
}
