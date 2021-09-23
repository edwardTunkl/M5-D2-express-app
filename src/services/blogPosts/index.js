import express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import {
  getBlogPosts,
  writeBlogPosts,
  uploadBlogCover,
  parseFile
} from "../../library/fs-tools.js";
import {
  checkBlogPostSchema,
  checkCommentSchema,
  checkSearchSchema,
  checkValidationResult,
} from "./validation.js";

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

blogRouter.post(
  "/",
  checkBlogPostSchema,
  checkValidationResult,
  async (req, res, next) => {
    // deleted const {} = req.body
      try {
        const newBlogPost = {
          id: uniqid(),
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const blogs = await getBlogPosts();
        blogs.push(newBlogPost);
        await writeBlogPosts(blogs);
        res.status(201).send({ id: newBlogPost.id }); //changed send; before .send(newBlogPost)
      } catch (error) {
        next(error);
      }
    }
);

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

//---PUT with cover stored in localhost:3001---

/* blogRouter.put(
  "/:id/cover",
  multer().single("cover"),
  uploadBlogCover,
  async (req, res, next) => {
    try {
      const blogs = await getBlogPosts();
      const blogIndex = blogs.findIndex(bl => bl.id === req.params.id)
      if (!blogIndex == -1) {
        res
          .status(404)
          .send({ message: `blog with ${req.params.id} is not found!` });
      }
      const previousblogData = blogs[blogIndex]
      const changedBlog = {
        ...previousblogData,
        test:"HELLO CAN YOU READ ME",                 //--> made change here
        cover: req.file, //added .path
        updatedAt: new Date(),
        id: req.params.id,
      };
      blogs[blogIndex] = changedBlog
     
      await writeBlogPosts(blogs);   
      res.status(200).send(changedBlog)         // changed writeBlogPosts(blogs) -->
    } catch (error) {
      next(error);
    }
  }
);
*/
//---PUT with cover stored in Cloud---


blogRouter.put(
  "/:id/cover",
  parseFile.single("cover"),    //  parseFile === multer({storage})
  async (req, res, next) => {
    try {
      const blogs = await getBlogPosts();
      const blogIndex = blogs.findIndex(bl => bl.id === req.params.id)
      if (!blogIndex == -1) {
        res
          .status(404)
          .send({ message: `blog with ${req.params.id} is not found!` });
      }
      const previousblogData = blogs[blogIndex]
      const changedBlog = {
        ...previousblogData,
        test:"HELLO CAN YOU READ ME",                 //--> made change here
        cover: req.file.path,                     //--> trying to link to storage.path       res.json(req.file)  ???
        updatedAt: new Date(),
        id: req.params.id,
      };
      blogs[blogIndex] = changedBlog
     
      await writeBlogPosts(blogs);   
      res.status(200).send(changedBlog)         // changed writeBlogPosts(blogs) -->
    } catch (error) {
      next(error);
    }
  }
);

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

//-------COMMENTS------------------------------------------

//---PUT Blog/POST comment---

blogRouter.put("/:id/comments",
checkCommentSchema,
checkValidationResult,
async (req, res, next) => {
  try {
    const {text, userName} = req.body
    const comment = {id: uniqid(), text, userName, createdAt: new Date()}
    const blogs = await getBlogPosts();
    const remainingBlogs = blogs.filter((bl) => bl.id !== req.params.id);
    const specificBlogPost = blogs.filter((bl) => bl.id === req.params.id)
    console.log("SPECIFIC",specificBlogPost.comments)
    specificBlogPost.comments = specificBlogPost.comments || []
    
    
    const updatedBlogPost = {
      ...req.body,
      comments: [...specificBlogPost.comments, comment],
      updatedAt: new Date(),
      id: req.params.id,
    };
    console.log("UPDATEEEEEED",updatedBlogPost.comments)
    remainingBlogs.push(updatedBlogPost);
    await writeBlogPosts(remainingBlogs);
    res.send(updatedBlogPost).status(200);
  } catch (error) {
    next(error);
  }
});

//---GET :id/comments-------------

blogRouter.get("/:id/comments", async (req, res, next) => {
  try {
    const blogs = await getBlogPosts();
    const blog = blogs.find((bl) => bl.id === req.params.id);
    if (blog) {
      blog.comments = blog.comments || []
      res.send(blog.comments);
      
    } else {
      next(createHttpError(404, `Blog with ID ${req.params.id} not found!`)); // we want to trigger 404 error handler
    }
  } catch (error) {
    next(error);
  }
});

//---download blog-content as PDF---


export default blogRouter;