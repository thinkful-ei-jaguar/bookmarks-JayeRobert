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
    logger.info(`Card with id ${id} created`);

    res
      .status(201)
      .location(`http://localhost:8000/card/${id}`)
      .json(bookmark);

  })
  .delete(bodyParser,(req, res) => {
    const { id } = req.params;

    const listIndex = bookmarks.findIndex(li => li.id === id);
  
    if (listIndex === -1) {
      logger.error(`List with id ${id} not found.`);
      return res
        .status(404)
        .send('Not Found');
    }
  
    bookmarks.splice(listIndex, 1);
  
    logger.info(`List with id ${id} deleted.`);
    res
      .status(204)
      .end();
  });

module.exports = bookmarkRouter;