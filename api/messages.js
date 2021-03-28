const db = require("./database.js");

const createThread = async (board, text, delete_password) => {
  await db.createThread(board, text, delete_password);
}

const updateThread = async (thread_id, text, delete_password) => {
  await db.updateThread(thread_id, text, delete_password);
}

const getThreads = async board => {
  // get threads for the board
  const response = await db.getThreads(board);

  // replace the replys array with the most recent three replies
  const lessReplies = response.map((el, i) => {
    const replies = el.replies
      .sort((a, b) => a?.created_on - b?.created_on)
      .slice(-3)
      
    return {
      ...el,
      replies
    }
  })
  return lessReplies;
}

const getReplies = async (board, thread_id) => {
  const response = await db.getReplies(board, thread_id);
  return response;
}

const deleteBoard = async (board,delete_password) => {
  return await db.deleteBoard(board,delete_password);
}
const deleteReply = async (thread_id, reply_id, delete_password) => {
  return await db.deleteReply(thread_id, reply_id, delete_password);
}

module.exports = { createThread, updateThread,getThreads,getReplies,deleteBoard, deleteReply };