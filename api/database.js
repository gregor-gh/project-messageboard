require('dotenv').config();
const { MongoClient } = require('mongodb');

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
    replies: []
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
  const { replies } = c.findOne({
    _id: thread_id,
  });

  // add reply
  await c.updateOne({
      _id:thread_id,
  }, {
    $set: {
      bumped_on: date,
      replies: [...replies, {
        text,
        created_on: date,
        delete_password,
        reported:false
      }]
      }
    }
  )
}

module.exports = { createThread, updateThread };