import express from "express";
import { addPurchase, enterAccount, getCard, getCurrentCard, getHistory, postCard, test, useCard } from "./controllers.js";
import { verifyToken } from "./verifyToken.js";

const router = express.Router();

//REGISTER
router.post("/enterAccount", enterAccount);

//POST CARDS
router.post("/card", verifyToken, postCard);

//GET CARDS
router.get("/getCards", verifyToken, getCard);

//USE CARD
router.post("/useCard", verifyToken, useCard);

//GET CURRENT CARD
router.get("/getCurrentCard", verifyToken, getCurrentCard);

//HISTORY OF PURCHASES
router.get("/getHistory", verifyToken, getHistory);

//ADD PURCHASE
router.post("/addPurchase", verifyToken, addPurchase);

//TEST
// router.get("/test", test);

export default router;