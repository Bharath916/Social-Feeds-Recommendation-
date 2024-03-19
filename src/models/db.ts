require("dotenv").config();
import mongoose, { ConnectOptions } from "mongoose";

export class DB {
  private static db: any;
  public getDB() {
    return DB.db;
  }

  public connectWithRetry(uriString: string) {
    let Mongoose: any = mongoose.connect(uriString, {
      autoIndex: true,
      // bufferMaxEntries: 0,
      // useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      // useCreateIndex: true,
    } as ConnectOptions);
    (err: Error) => {
      if (err) {
        console.log(
          "Mongoose failed initials connection. Retrying in 5 seconds..."
        );
        setTimeout(() => {
          this.connectWithRetry(uriString);
        }, 5000);
      } else {
        mongoose.Promise = global.Promise;
        DB.db = mongoose.connection;
      }
    };
    return Mongoose;
  }

  public connctionClose(callback: Function) {
    mongoose.connection.close(function () {
      console.log("Mongoose connection closed.");
      if (callback) {
        callback();
      }
    });
  }
}

mongoose.connection.on("error", function (err) {
  console.log("Mongoose error:", +err);
});

mongoose.connection.on("connected", function () {
  console.log("Mongoose connected");
});

mongoose.connection.on("disconnected", function () {
  console.log("Mongoose disconnected");
});
