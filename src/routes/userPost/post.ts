import express from "express";
import * as ControllersData from "../../controllers/userPost/post";
import { entryPoint } from "../../middleware/entryPoint";
import { exitPoint } from "../../middleware/exitPoint";

const XLSX = require("xlsx");
const multer = require("multer");

let router = express.Router();

router.post("/add", ControllersData.createData);
router.get("/find", ControllersData.getData);
router.put("/update/:id", ControllersData.UpdateData);
router.delete("/delete/:id", ControllersData.deleteData);

router.post("/likePost/:userId", ControllersData.likePost);
router.get("/countLikes", ControllersData.countLikes);

router.post("/commentPost", ControllersData.commentPost);
router.get("/commentCounts", ControllersData.commentCounts);

router.post("/addSports/:userId", ControllersData.interestSports);
router.get("/recommendUserInterest", ControllersData.recommendUserinterest);

router.post(
  "/postRecommendByUser/:userId",
  ControllersData.postRecommendationByUserId
);

module.exports = router;
