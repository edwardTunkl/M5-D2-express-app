import express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";

import { getBlogPosts, writeBlogPosts } from "../../library/fs-tools.js";

const blogRouter = express.Router();

//---Get---

blogRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await getBlogPosts();
    if (req.query && req.query.title) {
      const filteredBlogs = blogs.filter((bl) => bl.query === req.query.title);
      res.send(filteredBlogs);
    } else {
      res.send(blogs);
    }
  } catch (error) {
    next(error);
  }
});

//---GET:id----

blogRouter.get("/:id", async (req, res, next) => {
  try {
    const blogs = await getBlogPosts();
    const blog = blogs.find((bl) => bl.id === req.params.id);
    if (blog) {
      res.send(blog);
    } else {
      next(createHttpError(404, `Blog with ID ${req.params.id} not found!`)); // we want to trigger 404 error handler
    }
  } catch (error) {
    next(error);
  }
});

//---POST---

blogRouter.post("/", async (req, res, next) => {
  try {
    const {
      category,
      title,
      cover,
      readTime = { value: 2, unit: "minute" },
      author = { name: "", avatar: "" },
      content,
    } = req.body;

    const newBlogPost = {
      id: uniqid(),
      category,
      title,
      cover,
      readTime,
      author,
      content,
      createdAt: new Date(),
    };

    const blogs = await getBlogPosts();
    blogs.push(newBlogPost);
    await writeBlogPosts(blogs);
    res.status(201).send({ id: newBlogPost.id });
  } catch (error) {
    next(error);
  }
});

//---PUT---

blogRouter.put("/:id", async (req, res, next) => {
  try {
    const blogs = await getBlogPosts();
    const remainingBlogs = blogs.filter((bl) => bl.id !== req.params.id);
    const updatedBlogPost = {
      ...req.body,
      updatedAt: new Date(),
      id: req.params.id,
    };
    remainingBlogs.push(updatedBlogPost);
    await writeBlogPosts(blogs);
    res.send(updatedBlogPost).status(200);
  } catch (error) {
    next(error);
  }
});

//---Delete---

blogRouter.delete("/:id", async (req, res, next) => {
  try {
    const blogs = await getBlogPosts();
    const filteredBlogs = blogs.filter((bl) => bl.id !== req.params.id);
    await writeBlogPosts(filteredBlogs);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
export default blogRouter;
