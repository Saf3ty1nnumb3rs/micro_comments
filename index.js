const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const APP_PORT = 4001;
// no db for toy app
const commentsByPostId = {};

// POSTS/COMMENTS
app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');

  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id: commentId, content });
  commentsByPostId[req.params.id] = comments;

  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: { id: commentId, content, postId: req.params.id },
  });
  
  res.status(201).send(comments);
});

// EVENTS
app.post('/events', (req, res) => {
  console.log('Received Event', req.body.type);

  res.send({});
});
app.listen(APP_PORT, () => {
  console.log(`Listening on ${APP_PORT}`);
});
