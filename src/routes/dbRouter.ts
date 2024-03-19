require("dotenv").config();
import express from "express";
import { createTestAccounts } from "../scripts/createTestAccounts";

const router = express.Router();

if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "prod") {
  // populate DB via script
  router.get("/populateDB", async (req, res) => {
    await createTestAccounts()
      .then(() => {
        res.status(200).send({ result: "Successfully populated DB" });
      })
      .catch((error) => {
        res.status(500).send(`Error populating DB, err: ${error}`);
      });
  });
}

//This route for dev server and localhost to DROP tables and populate fresh tables
// if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "prod") {
//   router.delete("/dropAllTables", async (req, res) => {
//     await dropAllTables()
//       .then(() => {
//         res.status(200).send({ message: "Tables dropped successfully" });
//       })
//       .catch((error) => {
//         res.status(400).send(`Error drop tables from DB, err: ${error}`);
//       });
//   });
// }

module.exports = router;
