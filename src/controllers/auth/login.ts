import { NextFunction } from "express";
import jwtDecode from "jsonwebtoken";
import * as DynamicModels from "../../models/dynamicModels";
import { config } from "../../config/config";
import jwt from "jsonwebtoken";
import eventEmiiter from "events";

const secretVal = "25#f=XtKeS4Lh`H";
const Config = new config();
const Event = new eventEmiiter();
let users: any;

//another way of Login
export const logIn = async (req: any, res: any, next: NextFunction) => {
  let body = req.body;

  let user = await DynamicModels.findOneByMail(
    Config.availableCollection.userAccount,
    body.email
  );

  await DynamicModels.compareSaltedPassword(
    body.password,
    user.password,
    (err: any, getData: any) => {
      if (!getData) {
        res.json({ result: "incorrect password or email" });
      } else {
        users = user;
        res.json({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          createdAt: user.createdAt,
        });
      }
    }
  );
};
