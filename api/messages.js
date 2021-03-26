const db = require("./database.js");

const createThread = async (board, text, delete_password) => {
  await db.createThread(board, text, delete_password);
}

const updateThread = async (thread_id, text, delete_password) => {
  await db.updateThread(thread_id, text, delete_password)
}

module.exports = { createThread, updateThread };