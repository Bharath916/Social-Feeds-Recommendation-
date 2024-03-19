import { Request, Response, NextFunction } from "express";
import { ErrorCodes } from "../../models/models";
import * as DynamicModel from "../../models/dynamicModels";
import { config } from "../../config/config";
// import redis,{RedisClient } from "redis";
// import redis from "redis";
const redis = require("redis");
const { promisify } = require("util");

const Config = new config();
// Connect to Redis
const redisClient: any = redis.createClient();
(async () => {
  await redisClient.connect();
})();

redisClient.on("ready", () => {
  console.log("Connected!");
});
// let getAsync = promisify(redisClient.get).bind(redisClient);
// let setexAsync = promisify(redisClient.setex).bind(redisClient);

//Add logic
export async function createData(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    let collectionName: any = Config.availableCollection.userPost;
    let newRecord = req.body;
    let userId: any = req.query.userId;
    newRecord["userId"] = userId;

    if (!collectionName || !newRecord) {
      res.json({
        isSuccess: false,
        error: ErrorCodes[1001],
        customMsg: "Missing collection name || new record",
        data: {},
      });
      next();
      return;
    }
    let addRecord = await DynamicModel.add(collectionName, newRecord);

    if (addRecord) {
      res.json({
        isSuccess: true,
        data: "Added successfully",
      });
    } else {
      res.json({
        isSuccess: false,
        error: ErrorCodes[1001],
        data: {},
      });
      next();
      return;
    }
  } catch (error) {
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1002],
      customMsg: "Failed to add data",
      data: {},
    };
    next();
    return;
  }
}

//getData
export async function getData(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    const collectionName = Config.availableCollection.userPost;

    if (!collectionName) {
      return res.status(400).json({
        isSuccess: false,
        error: ErrorCodes[1001],
        data: {},
      });
    }
    // await redisClient.del(collectionName);
    // return;
    // Check if data exists in Redis cache
    const cachedData = await redisClient.get(collectionName);

    if (cachedData) {
      console.log("Data retrieved from cache");
      return res.json(JSON.parse(cachedData));
    } else {
      const findData = await DynamicModel.getData(collectionName, {}, {}, {});

      // Cache data in Redis with a TTL of 1 hour
      await redisClient.set(collectionName, JSON.stringify(findData));
      return setTimeout(() => {
        res.json({
          isSuccess: true,
          customMsg: "Data fetched successfully",
          data: findData,
        });
      }, 3000);
    }
  } catch (error) {
    console.error("Error in getData function:", error);
    return res.status(500).json({
      isSuccess: false,
      error: ErrorCodes[1004],
      customMsg: "Failed to fetch data",
      data: {},
    });
  }
}

//update functionality
export async function UpdateData(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    let collectionName: any = Config.availableCollection.userPost;
    let id: any = req.params.id;
    let body: any = req.body;

    if (!collectionName && !id && !body) {
      res.json({
        isSuccess: false,
        error: ErrorCodes[1001],
        customMsg: "Missing collection name || new record",
        data: {},
      }),
        next();
      return;
    }

    let updatedData = await DynamicModel.updateData(collectionName, id, body);

    if (updatedData) {
      res.json({
        isSuccess: true,
        customMsg: "DATA UPDATE SUCCESSFULLY",
        data: {},
      });
    } else {
      res.json({
        isSuccess: false,
        error: ErrorCodes[1007],
        customMsg: "FAILED TO UPDATE DATA",
        data: {},
      });
      next();
      return;
    }
  } catch (error) {
    res.json({
      isSuccess: false,
      error: ErrorCodes[1007],
      customMsg: "FAILED TO UPDATE DATA",
      data: {},
    });
    next();
    return;
  }
}

//delete record
export async function deleteData(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    let collectionName: any = Config.availableCollection.userPost;
    let id: any = req.params.id;

    if (!collectionName && !id) {
      res.json({
        isSuccess: false,
        error: ErrorCodes[1001],
        customMsg: "Missing collection name || new record",
        data: {},
      });
      next();
      return;
    }

    let deleteRecord = await DynamicModel.deleteData(collectionName, id);
    // console.log("deleteRecord", deleteRecord);
    if (deleteRecord) {
      res.json({
        isSuccess: true,
        customMsg: "DATA DELETE SUCCESSFULL",
        data: {},
      });
    } else {
      res.json({
        isSuccess: false,
        error: ErrorCodes[1005],
        customMsg: "FAILED TO DELETE DATA 232323",
        data: {},
      });
      next();
      return;
    }
  } catch (error) {
    res.json({
      isSuccess: false,
      error: ErrorCodes[1008],
      customMsg: "FAILED TO DELETE DATA",
      data: {},
    });
    next();
    return;
  }
}

//like a post
export async function likePost(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    const collectionName: any = Config.availableCollection.likes;
    if (!collectionName) {
      return res.status(400).json({
        isSuccess: false,
        error: ErrorCodes[1001],
        data: {},
      });
    }

    let userId: any = req.query.userId;
    let body: any = req.body;
    body["userId"] = userId;

    let addLike = await DynamicModel.add(collectionName, body);
    if (addLike) {
      res.json({
        isSuccess: true,
        data: "Added successfully",
      });
    } else {
      res.json({
        isSuccess: false,
        error: ErrorCodes[1001],
        data: {},
      });
      next();
      return;
    }
  } catch (error) {
    console.error("Error in like function:", error);
    return res.status(500).json({
      isSuccess: false,
      error: ErrorCodes[1004],
      customMsg: "Failed to like data",
      data: {},
    });
  }
}

export async function countLikes(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    let collectionName: any = Config.availableCollection.likes;
    let aggrQuery: any = [
      {
        $group: {
          _id: "$userId",
          likeCounts: {
            $sum: 1,
          },
          postId: {
            $first: "$postId",
          },
          createdAt: {
            $first: "$createdAt",
          },
        },
      },
      {
        $sort: {
          likeCounts: -1,
        },
      },
    ];
    let aggregateResult = await DynamicModel.aggregateAwait(
      collectionName,
      aggrQuery
    );
    if (aggregateResult && aggregateResult.length) {
      res.json(aggregateResult);
    } else {
      res.json({ result: "failed to count" });
    }
  } catch (error) {
    console.error("Error in count like function:", error);
    return res.status(500).json({
      isSuccess: false,
      error: ErrorCodes[1004],
      customMsg: "Failed to count like data",
      data: {},
    });
  }
}
