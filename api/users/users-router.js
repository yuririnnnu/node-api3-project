const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const User = require('./users-model');
const Post = require('./../posts/posts-model');
const { validateUserId,
        validateUser,
        validatePost } = require('./../middleware/middleware');

const router = express.Router();

router.get('/', (req, res, next) => {
  User.get()
  .then(users => {
    res.json(users)
  })
  .catch(next)
});

router.get('/:id', validateUserId, (req, res) => {
  res.json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  User.insert(req.body)
  .then(inserted => {
    res.status(201).json(inserted)
  })
  .catch(next)
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  User.update(req.params.id, {name: req.name})
  .then(changed => {
    res.json(changed)
  })
  .then(user => {
    return User.getById(req.params.id)
  })
  .catch(next)
});

router.delete('/:id', validateUserId, (req, res, next) => {
  User.remove(req.params.id)
  .then(user=>{
    res.json(req.user)
  })
  .catch(next)
});

router.get('/:id/posts', validateUserId, (req, res, next) => {
  User.getUserPosts(req.params.id)
  .then(result => res.json(result))
  .catch(next)
});

router.post('/:id/posts', validateUserId, validatePost,(req, res, next) => {
  Post.insert({user_id: req.params.id, text: req.text})
  .then(inserted =>{
    res.json(inserted)
  })
  .catch(next)
});

router.use((err,req,res,next)=>{
  res.status(err.status || 500).json({
    customMessage: "something went wrong with calling posts router",
    message: err.message,
    stack: err.stack
  })
})
// do not forget to export the router
module.exports = router;