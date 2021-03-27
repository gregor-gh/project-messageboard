require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectID;

const connect = async () => {
  // connect to db
  const URI = process.env.DB;
  const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();

  const db = client.db("ProjectMessageBoard");

  return db
}

const createThread = async (board, text, delete_password) => {
  // connect
  const db = await connect();

  // set table
  const c = db.collection("thread");

  // get current date
  date = new Date();

  // create the thread
  await c.insertOne({
    board,
    text,
    created_on: date,
    bumped_on: date,
    reported: false,
    delete_password,
    replies: [],
    replycount: 0
  });
}

const updateThread = async (thread_id, text, delete_password) => {
  // connect
  const db = await connect();

  // set table
  const c = db.collection("thread");

  // get current date
  date = new Date();

  // get current replies
  const { replies, replycount } = await c.findOne({
    _id: thread_id,
  });

  // add reply
  const response = await c.updateOne({
    _id: thread_id,
  }, {
    $set: {
      bumped_on: date,
      replies: [...replies || [], {
        _id: new ObjectId(),
        text,
        created_on: date,
        delete_password,
        reported: false
      }],
      replycount: replycount + 1
    }
  }
  );

  console.log(response);
}

const getThreads = async board => {
  // connect
  const db = await connect();

  // set table
  const c = db.collection("thread");

  // get mnost recent 10 threads
  const response = await c.find({ board })
    .limit(10)
    .sort({ bumped_on: -1 })
    .toArray();

  return response;
}

const getReplies = async (board, thread_id) => {
  // connect
  const db = await connect();

  // set table
  const c = db.collection("thread");

  const test = await c.find({
    _id: thread_id,
  }).toArray();

  // get replies
  const { replies } = await c.findOne({
    _id: thread_id,
  });

  return replies;
}

module.exports = { createThread, updateThread, getThreads, getReplies };