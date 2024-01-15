import express from "express";
import {
  addPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePostById,
  commentPostById,
  getCommentByPostId
  // findCommentByPostId,
} from "../controllers/post.js";

import { Authenticate } from "../middlewares/auth.js";

export const postRouter = express.Router();

postRouter.post("/addpost", Authenticate, addPost);

postRouter.get("/posts", getPosts);

postRouter.get("/post/:id", Authenticate, getPostById);

postRouter.put("/post/:id", Authenticate, updatePost);

postRouter.delete("/post/:id", Authenticate, deletePost);
 
postRouter.post("/post/like/:id",Authenticate, likePostById);

postRouter.post("/post/comment/:id",Authenticate, commentPostById);

postRouter.get("/post/comment/:id", Authenticate, getCommentByPostId);



