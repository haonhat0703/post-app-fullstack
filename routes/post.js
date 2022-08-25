const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/index");

const Post = require("../models/Post");

//GET api/posts
//Get all posts of user
//private
router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).populate("user", [
      "username",
    ]);
    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//POST api/posts
//Create new post
//Private
router.post("/", verifyToken, async (req, res) => {
  const { title, description } = req.body;

  //if not title
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });

  //create new post
  try {
    const newPost = new Post({
      title,
      description,
      user: req.userId,
    });

    await newPost.save();

    res.json({ success: true, message: "Happy learning!", post: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
});

//PUT api/posts
//Update post
//private
router.put("/:id", verifyToken, async (req, res) => {
  const { title, description } = req.body;

  try {
    let updatedPost = {
      title,
      description,
    };

    const postUpdateCondition = { _id: req.params.id, user: req.userId };

    updatedPost = await Post.findOneAndUpdate(
      postUpdateCondition,
      updatedPost,
      { new: true }
    );

    //User not authorised
    if (!updatedPost)
      return res.status(401).json({
        success: false,
        message: "Post not found or user not authorised",
      });

    //All good
    res.json({
      success: true,
      message: "Excellent progress!",
      post: updatedPost,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//Delete api/posts
//Delet post
//Private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const postDeleteCondition = { _id: req.params.id, user: req.userId };
    const deletedPost = await Post.findOneAndDelete(postDeleteCondition);

    //User not authorised or post not found
    if (!deletedPost)
      return res.status(401).json({
        success: false,
        message: "Post not found or user not authorised",
      });

    //All good
    res.json({ success: true, post: deletedPost });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
