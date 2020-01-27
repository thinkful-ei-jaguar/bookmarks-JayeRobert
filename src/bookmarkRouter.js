const express = require('express');
const bookmarks = require('./store');
const logger = require('./logger');
const bookmarkRouter = express.Router();
const bodyParser = express.json();
const uuid = require('uuid/v4');

bookmarkRouter
  .route('/bookmark')
  .get((req, res) => {
    res
      .json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { title, content } = req.body;
    if (!title) {
      logger.error('Title is required');
      return res
        .status(400)
        .send('Invalid data');
    }
    
    if (!content) {
      logger.error('Content is required');
      return res
        .status(400)
        .send('Invalid data');
    }
    const id = uuid();

    const bookmark = {
      id,
      title,
      content
    };

    bookmarks.push(bookmark);
    logger.info(`bookmark with id ${id} created`);

    res
      .status(201)
      .location(`http://localhost:8000/bookmark/${id}`)
      .json(bookmark);

  });
  

  bookmarkRouter
  .route('/bookmark/:id')
  .get((req, res) => {
    const { id } = req.params;

    const bookmark = bookmarks.find(b => b.id === id);

    if (!bookmark) {
      logger.error(`bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Not Found');
    }
    res.json(bookmark);
  })
  .delete(bodyParser,(req, res) => {
    const { id } = req.params;

    const bookmarkIndex = bookmarks.findIndex(b => b.id === id);
  
    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Not Found');
    }
  
    bookmarks.splice(bookmarkIndex, 1);
  
    logger.info(`bookmark with id ${id} deleted.`);
    res
      .status(204)
      .end();
  });

module.exports = bookmarkRouter;