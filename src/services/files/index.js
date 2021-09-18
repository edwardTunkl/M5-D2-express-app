import express from "express";
import multer from "multer";
import createHttpError from "http-errors";

import { getBlogPosts, writeBlogPosts, blogPostPicture, getAuthors, writeAuthors, authorPicture } from "../../library/fs-tools.js";

const filesRouter = express.Router();

filesRouter.post(
  "/uploadSingle/:id",
  multer(
  //   {
  //   fileFilter: (req, file, cb) => {
  //     if (file.mimetype !== "image/gif")
  //       cb(
  //         createHttpError(400, { errorsList: "Format not supported!" }),
  //         false
  //       );
  //     else cb(null, true);
  //   },
  // }
  ).single("profilePic"),
  async (req, res, next) => {
    // This route is going to receive a multipart/form-data body, therefore we should use multer to parse that body and give us back the file
    try {
      console.log(req.file);

      // await authorPicture("authorPic.gif", req.file.buffer);
      // 1. read students.json file
      const authors = await getAuthors()
      const remainingAuthors = authors.filter(
        (auth) => auth.id !== req.params.id
      );
      // 2. find the student by studentID
      const author = authors.find(a => a.id === req.params.id)
      // 3. add img: "/img/students/3kgeacktjxtomx.gif"
     
      author = {
        ...req.body,
      avatar: await authorPicture(req.file.originalname, req.file.buffer),
      updatedAt: new Date(),
      id: req.params.id,
      }
      remainingAuthors.push(author)
     
      // 4. save the students back to students.json file
      await writeAuthors(remainingAuthors)
      res.send("OK");
    } catch (error) {
      next(error);
    }
  }
);
export default filesRouter