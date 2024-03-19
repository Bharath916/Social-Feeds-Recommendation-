import mongoose, { Collection } from "mongoose";
import bcrypt from "bcrypt";
import { ObjectId } from "bson";

const { getCollectionObject } = require("../seed/getModels");

const Schema = mongoose.Schema;

export let schema = new Schema({}, { strict: false, versionKey: false });

//CRUD operations

//====Add api====//
export var add = (collectionName: string, data: any) => {
  data["createdAt"] = new Date();
  if (data && data.length) {
    data = [data];
  }
  return getCollectionObject(collectionName, schema).insertMany(data);
};

//=====Get api====//
export var getData = (
  collectionName: string,
  query: any,
  projection: any,
  options: any
) => {
  return getCollectionObject(collectionName, schema).find(
    query,
    projection,
    options
  );
};

//======findOne api=====//
export var GetfindOne = (collectionName: string, id: string) => {
  return getCollectionObject(collectionName, schema).findById({
    _id: new ObjectId(id),
  });
};

export var findOne = (collectionName: string, id) => {
  return getCollectionObject(collectionName, schema).findOne({ userId: id });
};

export var findOneByMail = (collectionName: string, mail) => {
  return getCollectionObject(collectionName, schema).findOne({ email: mail });
};

export var aggregateAwait = (collectionName: string, aggre: any) => {
  return getCollectionObject(collectionName, schema).aggregate(aggre).exec();
};

// update the document and returns the updated document
export let findOneAndUpdate = function (
  model: any,
  query: Object,
  data: any
  // options: Object,
  // cb: Function
) {
  return getCollectionObject(model).findOneAndUpdate(
    query,
    { $set: { ...data, updatedAt: new Date() } },
    { upsert: false, returnDocument: "after" },
    { upsert: false, returnNewDocument: true, returnDocument: "after" }
  );
  // model.findOneAndUpdate(
  //   query,
  //   { $set: { ...data, updatedAt: new Date() } },
  //   // { upsert: false, returnDocument: 'after' },
  //   { upsert: false, returnNewDocument: true, returnDocument: "after" },
  //   (err: any, docs: any) => {
  //     cb(err, docs);
  //   }
  // );
};

export var findOneWithAwait = async function (
  model: any,
  query: any,
  options: any
) {
  // console.log("model 20", model);
  try {
    // console.log("model22", model);

    let resp: any = await model.findOne(query, options);
    return resp;
  } catch (error) {
    return null;
  }
};

//=====update api======//
export var updateData = (collectionName: string, id: string, data: any) => {
  console.log("data", data, id, collectionName);
  let startDate: any = new Date();
  data["updatedAt"] = startDate;
  return getCollectionObject(collectionName, schema).updateOne(
    { _id: id },
    { $set: data },
    { upsert: true }
  );
};

//update with upsert false
export var updateDataWithUpsertFalse = (
  collectionName: string,
  query: object,
  data: any
) => {
  // console.log("data", data, id, collectionName);
  let startDate: any = new Date();
  data["updatedAt"] = startDate;
  return getCollectionObject(collectionName, schema).updateOne(
    query,
    { $set: data },
    { upsert: false }
  );
};

//======delete api=====//
export var deleteData = (collectionName: string, id: string) => {
  return getCollectionObject(collectionName, schema).deleteOne({ _id: id });
};

export var updateOneWithAwait = async (
  model: any,
  query: object,
  data: any
) => {
  try {
    console.log("model", model);

    let res: any = await model.updateOne(
      query,
      { $set: { ...data, updatedAt: new Date() } },
      { upsert: false }
    );
    return res;
  } catch (error) {
    return error;
  }
};

export var updateManyWithAwait = async function (
  model: any,
  query: any,
  setObj: any
) {
  try {
    console.log("model", model);

    let res: any = await model.updateMany(
      query,
      { $set: { ...setObj, updatedAt: new Date() } },
      { upsert: false }
    );
    return res;
  } catch (error) {
    throw error;
  }
};

export var findMany = async function (
  model: any,
  query: any,
  options: any,
  projection: any,
  cb: Function
) {
  try {
    let resp: any = await model
      .find(query, options)
      .project(projection)
      .toArray();
    cb(null, resp);
  } catch (error) {
    cb(error, null);
  }
};

export var findManyWithAwait = async function (
  model: any,
  query: any,
  options: any,
  projection: any
) {
  try {
    let resp: any = await model
      .find(query, options)
      .project(projection)
      .toArray();
    return resp;
  } catch (error) {
    return null;
  }
};

export var compareSaltedPassword = function (
  password: string,
  hash: string,
  callback: Function
) {
  bcrypt.compare(password, hash, function (err, isMatch) {
    callback(err, isMatch);
  });
};
