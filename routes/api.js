'use strict';
const msg = require("../api/messages.js");

module.exports = function (app) {

  app.route('/api/threads/:board')
    .post(async (req, res) => {
      const board = req.params.board;
      const text = req.body.text;
      const delete_password = req.body.delete_password;

      await msg.createThread(board, text, delete_password);

      res.send("TEST");
    });

  app.route('/api/replies/:board');

};
