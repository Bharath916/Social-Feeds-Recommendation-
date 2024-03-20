import { Request, Response, NextFunction } from "express";
import { ErrorCodes } from "../../models/models";
import * as DynamicModel from "../../models/dynamicModels";
import { config } from "../../config/config";
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

    let userId: any = req.params.userId;
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
    }
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
    await redisClient.set(collectionName, JSON.stringify(aggregateResult));
    return setTimeout(() => {
      res.json({
        isSuccess: true,
        customMsg: "Data fetched successfully",
        data: aggregateResult,
      });
    }, 3000);
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

//comment a post
export async function commentPost(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    let collectionName: any = Config.availableCollection.comments;
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

    let addComment = await DynamicModel.add(collectionName, body);
    if (addComment) {
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
    console.error("Error in comment function:", error);
    return res.status(500).json({
      isSuccess: false,
      error: ErrorCodes[1004],
      customMsg: "Failed to comment data",
      data: {},
    });
  }
}

export async function commentCounts(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    let collectionName: any = Config.availableCollection.comments;
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
    }
    let aggrQuery: any = [
      {
        $group: {
          _id: "$userId",
          commnetCounts: {
            $sum: 1,
          },
          comment: {
            $push: "$comment",
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
          commnetCounts: -1,
        },
      },
    ];

    let commentAggre = await DynamicModel.aggregateAwait(
      collectionName,
      aggrQuery
    );
    await redisClient.set(collectionName, JSON.stringify(commentAggre));
    return setTimeout(() => {
      res.json({
        isSuccess: true,
        customMsg: "Data fetched successfully",
        data: commentAggre,
      });
    }, 3000);
  } catch (error) {
    console.error("Error in comment count function:", error);
    return res.status(500).json({
      isSuccess: false,
      error: ErrorCodes[1004],
      customMsg: "Failed to comment count data",
      data: {},
    });
  }
}

//sports activity
export async function interestSports(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    let collectionName: any = Config.availableCollection.sports;
    if (!collectionName) {
      return res.status(400).json({
        isSuccess: false,
        error: ErrorCodes[1001],
        data: {},
      });
    }
    let userId: any = req.params.userId;
    let body: any = req.body;
    body["userId"] = userId;

    let addSports = await DynamicModel.add(collectionName, body);
    if (addSports) {
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
    console.error("Error in sports function:", error);
    return res.status(500).json({
      isSuccess: false,
      error: ErrorCodes[1004],
      customMsg: "Failed to sports data",
      data: {},
    });
  }
}

//recommendation based on user interest, likes and comments with popularity score
export async function recommendUserinterest(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    let collectionName: any = Config.availableCollection.sports;
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
    }
    let aggrQuery: any = [
      {
        $lookup: {
          from: "likes",
          localField: "userId",
          foreignField: "userId",
          as: "postInfo",
        },
      },
      {
        $group: {
          _id: "$userId",
          likeCounts: {
            $sum: 1,
          },
          sportName: {
            $first: "$sportName",
          },
          userId: {
            $first: "$userId",
          },
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "userId",
          foreignField: "userId",
          as: "commentInfo",
        },
      },
      {
        $group: {
          _id: "$userId",
          commentCount: {
            $sum: {
              $size: "$commentInfo",
            },
          },
          likeCounts: {
            $sum: 1,
          },
          sportName: {
            $first: "$sportName",
          },
          userId: {
            $first: "$userId",
          },
        },
      },
      {
        $addFields: {
          totalPopularity: {
            $sum: ["$commentCount", "$likeCounts"],
          },
        },
      },
      {
        $sort: {
          totalPopularity: -1,
        },
      },
    ];

    let recommendInterest = await DynamicModel.aggregateAwait(
      collectionName,
      aggrQuery
    );
    await redisClient.set(collectionName, JSON.stringify(recommendInterest));
    return setTimeout(() => {
      res.json({
        isSuccess: true,
        customMsg: "Data fetched successfully",
        data: recommendInterest,
      });
    }, 3000);
  } catch (error) {
    console.error("Error in recommend function:", error);
    return res.status(500).json({
      isSuccess: false,
      error: ErrorCodes[1004],
      customMsg: "Failed to recommend data",
      data: {},
    });
  }
}

// Post recommendation API: based on userId
export async function postRecommendationByUserId(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    let collectionName: any = Config.availableCollection.likes;

    if (!collectionName) {
      return res.status(400).json({
        isSuccess: false,
        error: ErrorCodes[1001],
        data: {},
      });
    }
    // await redisClient.del(collectionName);
    // return;
    const cachedData = await redisClient.get(collectionName);
    if (cachedData) {
      console.log("Data retrieved from cache");
      return res.json(JSON.parse(cachedData));
    }

    let userId = req.params.userId;
    let aggreQuery: any = [
      {
        $match: {
          userId: userId,
        },
      },
      {
        $addFields: {
          ids: {
            $toObjectId: "$postId",
          },
        },
      },
      {
        $lookup: {
          from: "userPost",
          localField: "ids",
          foreignField: "_id",
          as: "postInfo",
        },
      },
      {
        $unwind: {
          path: "$postInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$postId",
          likeCounts: {
            $sum: 1,
          },
          postId: {
            $first: "$postId",
          },
          text: {
            $first: "$postInfo.text",
          },
          userId: {
            $first: "$userId",
          },
          createdAt: {
            $first: "$postInfo.createdAt",
          },
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "postId",
          foreignField: "postId",
          as: "commentInfo",
        },
      },
      {
        $group: {
          _id: "$postId",
          commentCounts: {
            $sum: {
              $size: "$commentInfo",
            },
          },
          likeCounts: {
            $first: "$likeCounts",
          },
          postId: {
            $first: "$postId",
          },
          text: {
            $first: "$text",
          },
          userId: {
            $first: "$userId",
          },
          createdAt: {
            $first: "$createdAt",
          },
        },
      },
      {
        $addFields: {
          totalPopularity: {
            $sum: ["$commentCounts", "$likeCounts"],
          },
        },
      },
      {
        $sort: {
          totalPopularity: -1,
        },
      },
    ];

    // Query likes and comments collections to check if the user has interacted with the posts
    // const userInteractedPosts = await DynamicModel.getData(
    //   collectionName,
    //   { userId: userId },
    //   {},
    //   {}
    // );
    // const userInteractedPostIds = userInteractedPosts.map(
    //   (post) => post.postId
    // );

    // Filter out posts that the user has already interacted with
    // aggreQuery.unshift({
    //   $match: {
    //     postId: { $nin: userInteractedPostIds },
    //   },
    // });

    let postRecommendationByUser = await DynamicModel.aggregateAwait(
      collectionName,
      aggreQuery
    );
    await redisClient.set(
      collectionName,
      JSON.stringify(postRecommendationByUser)
    );
    return setTimeout(() => {
      res.json({
        isSuccess: true,
        customMsg: "Data fetched successfully",
        data: postRecommendationByUser,
      });
    }, 3000);
    // if (postRecommendationByUser && postRecommendationByUser.length) {
    //   res.json(postRecommendationByUser);
    // } else {
    //   res.json({ result: "failed to get post recommend data" });
    // }
  } catch (error) {
    console.error("Error in post recommend function:", error);
    return res.status(500).json({
      isSuccess: false,
      error: ErrorCodes[1004],
      customMsg: "Failed to post recommend data",
      data: {},
    });
  }
}
