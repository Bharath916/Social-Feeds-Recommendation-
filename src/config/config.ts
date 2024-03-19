require("dotenv").config();

export class config {
  serviceName = process.env.SERVICE || "Task_Assessment";
  mongodbURI =
    process.env.MONGO_DB_URI || "mongodb://localhost:27017/taskAssessment";
  port = process.env.PORT || 9090;
  dynamicModels = new Array();
  availableCollection = {
    userAccount: "userAccount",
    userPost: "userPost",
    likes: "likes",
  };
  static serviceName: string;
  static mongodbURI: string;
  static port: number;
  static availableCollection: any;
  static dynamicModels: any;
}
