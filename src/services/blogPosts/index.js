import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import createHttpError from "http-errors"

const blogPostsJSONFilePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogPosts.json"
);

const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONFilePath));
const writeBlogPosts = (content) =>
  fs.writeFileSync(blogPostsJSONFilePath, JSON.stringify(content));

const blogRouter = express.Router();

//---Get---

blogRouter.get("/", (req, res, next) => {
  try {
    const blogs = getBlogPosts();
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

blogRouter.get("/:id", (req, res, next) =>{
 try{
  const blogs = getBlogPosts()
  const blog = blogs.find(bl => bl.id === req.params.id)
  if(blog){
    res.send(blog)
  } else {
    next(createHttpError(404, `Book with ID ${req.params.id} not found!`)) // we want to trigger 404 error handler
  }
 }catch(error){
   next(error)
 }
})

//---POST---

blogRouter.post("/", (req, res, next) =>{
  try {
    const {category, title, cover, readTime = {value: 2, unit: "minute"}, author = {name : "AUTHOR AVATAR NAME", avatar : "AUTHOR AVATAR LINK"}, content } = req.body

    const newBlogPost = {
      id: uniqid(),
      category,
      title,
      cover,
      readTime,
      author,
      content,
      createdAt: new Date()     
    };

    const blogs = getBlogPosts()
    blogs.push(newBlogPost)
    writeBlogPosts(blogs)
    res.status(201).send({id: newBlogPost.id})
    } catch (error){
    next(error)
  }
})

//---PUT---

blogRouter.put("/:id", (req, res, next) => {
  try{
    const blogs = getBlogPosts()
    const remainingBlogs = blogs.filter(bl => bl.id !== req.params.id)
    const updatedBlogPost = {...req.body, updatedAt: new Date(), id: req.params.id}
    remainingBlogs.push(updatedBlogPost)
    writeBlogPosts(blogs)
    res.send(updatedBlogPost).status(200)

  }catch(error){
    next(error)
  }
})

//---Delete---

blogRouter.delete("/:id", (req, res, next) => {
  try{
  const blogs = getBlogPosts()
  const filteredBlogs = blogs.filter(bl => bl.id !== req.params.id)
  writeBlogPosts(filteredBlogs)
  res.status(204).send()
  }catch(error){
    next(error)
  }
})
export default blogRouter