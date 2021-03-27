'use strict';
const ObjectId = require("mongodb").ObjectID;
const msg = require("../api/messages.js");

module.exports = function (app) {

  app.route('/api/threads/:board')
    .get(async (req, res, done) => {
      const board = req.params.board;
      const response = await msg.getThreads(board);
      res.send(response);
    })
    .post(async (req, res) => {
      const board = req.params.board;
      const text = req.body.text;
      const delete_password = req.body.delete_password;

      await msg.createThread(board, text, delete_password);

      //res.redirect("../views/board.html");
      res.sendFile(process.cwd() + "/views/board.html");
    });

  app.route('/api/replies/:board')
    .post(async (req, res) => {
      const board = req.params.board;
      const thread_id = new ObjectId(req.body.thread_id);
      const text = req.body.text;
      const delete_password = req.body.delete_password;

      await msg.updateThread(thread_id, text, delete_password);
      res.redirect(`/api/replies/${board}?thread_id=${thread_id}`);
    })
    .get(async (req, res) => {
      const board = req.params.board;
      const thread_id = new ObjectId(req.query.thread_id);

      await msg.getReplies(board, thread_id);
      res.sendFile(process.cwd() + "/views/thread.html");
    });

};
