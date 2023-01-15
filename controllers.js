import User from "./models/User.js";
import Card from "./models/Card.js";
import Purchase from "./models/Purchase.js";
import CurrentCard from "./models/CurrentCard.js";
import jwt from "jsonwebtoken";
import { createError } from "./error.js";
import mongoose from "mongoose";

function dateInDotFormat(value) {
  var day = value.getDate();
  var month = value.getMonth() + 1;
  var year = value.getFullYear();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  var dateInDotFormat = day + "." + month + "." + year;
  return value = dateInDotFormat;
}

export const enterAccount = async (req, res, next) => {
  const { name, lastname, documentCode, documentDate } = req.query;
  try {
    const newUser = new User({ name, lastname, documentCode, documentDate });

    const user = await newUser.save();

    const access_token = jwt.sign({ id: user._id }, process.env.JWT)

    res.status(200).json({ StatusMessage: "OK", access_token });
  } catch (err) {
    console.log('err ----->', err);
    next(err);
  }
};

export const postCard = async (req, res, next) => {
  const { userId, number, title, money } = req.query;
  try {
    const newCard = new Card({ userId, number, title, money });
    await newCard.save();
    res.status(200).json({ StatusMessage: "OK" })
  } catch (err) {
    next(err);
  }
};

export const getCard = async (req, res, next) => {
  const userId = new mongoose.Types.ObjectId(req.query.userId);
  try {
    // const cards = await Card.find({userId: userId}).populate("userId")
    const cards = await Card.aggregate([
      {
        $match: { userId: userId }
      },
      {
        $project: {
          number: "$number",
          title: "$title",
        }
      }
    ]);
    !cards && next(createError(404, "You don't have any cards!"));

    res.status(200).json(cards)
  } catch (err) {
    next(err);
  }
}

export const useCard = async (req, res, next) => {
  const id = req.query.id;
  try {
    const currentCard = await Card.findOne({ _id: id });
    const { _id, number, title, userId } = currentCard;
    // res.json({ number, title, userId, cardId: _id })
    const newCurrentCard = new CurrentCard({ cardId: _id, number, title, userId });
    await newCurrentCard.save();

    await User.findOneAndUpdate(
      userId,
      { $set: { currentCard: newCurrentCard._id } },
      { $new: true }
    )
    res.status(200).json({ message: 'Card has been activated successfully' });
  } catch (err) {
    next(err);
  }
}

export const getCurrentCard = async (req, res, next) => {
  const userId = req.query.userId;
  try {
    const currentCard = await CurrentCard.findOne({ userId: userId });
    const { cardId } = currentCard;
    res.status(200).json({ id: cardId });
  } catch (err) {
    next(err);
  }
}

export const getHistory = async (req, res, next) => {
  const userId = new mongoose.Types.ObjectId(req.query.userId);
  try {
    const purchases = await Card.find({ userId })
      .populate("purchases")
      .select({ "purchases": 1, _id: 0 })

    const purchasesArray = purchases.map(purchase => purchase.purchases)
      .flat()
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    res.status(200).json(purchasesArray);
  } catch (err) {
    next(err);
  }
}

export const addPurchase = async (req, res, next) => {
  const { price, userDocumentCode } = req.query;
  try {
    const user = await User.findOne({ userDocumentCode }).populate("currentCard")
    const { name, lastname } = user;
    const cardId = user.currentCard.cardId;
    const date = dateInDotFormat(new Date());
    const newPurchase = new Purchase({ price, date, ...req.body })
    const savedPurchase = await newPurchase.save()

    try {
      await Card.findByIdAndUpdate(
        cardId,
        {
          $push: { purchases: savedPurchase._id },
          $inc: { money: -price }
        },
        { $new: true }
      )
    } catch (err) {
      next(err);
    }

    res.status(200).json({ StatusMessage: "Ok", userInfo: { name, lastname } })
  } catch (err) {
    next(err);
  }
}

export const test = async (req, res, next) => {
  try {
    const abc = new Date();
    const dotFormat = dateInDotFormat(abc);
    res.send(dotFormat);
  } catch (err) {
    next(err);
  }
}