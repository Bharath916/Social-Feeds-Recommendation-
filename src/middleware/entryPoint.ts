import { Request, Response, NextFunction } from "express";
// import

export function entryPoint(req: Request, res: Response, next: NextFunction) {
  // req.txId = genearateTransaction()

  next();
}
