import express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";

import { getAuthors, writeAuthors } from "../../library/fs-tools.js";
import { authorValidation } from "./validation.js";
import { validationResult } from "express-validator";
const authorsRouter = express.Router();

//---GET---

authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await getAuthors();
    res.send(authors);
  } catch (error) {
    next(error);
  }
});

//---GET:id---

authorsRouter.get("/:id", async (req, res, next) => {
  try {
    const authors = await getAuthors();
    const author = authors.find((a) => a.id === req.params.id);

    if (author) {
      res.send(author);
    } else {
      res.send("Not found!");
    }
  } catch (error) {
    next(error);
  }
});

//---POST---

authorsRouter.post("/", authorValidation, async (req, res, next) => {
  const errorsList = validationResult(req);
  if (!errorsList.isEmpty) {
    next(createHttpError(400, { errorsList }));
  } else {
    try {
      const { name, surname, email, dateOfBirth } = req.body;

      const newAuthor = {
        id: uniqid(),
        name,
        surname,
        email,
        dateOfBirth,
        avatar: `https://ui-avatars.com/api/?name=${name}+${surname}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log(newAuthor);
      const authors = await getAuthors();
      authors.push(newAuthor);
      await writeAuthors(authors);
      res.status(201).send({ id: newAuthor.id });
    } catch (error) {
      next(error);
    }
  }
});

//---PUT---

authorsRouter.put("/:id", async (req, res, next) => {
  try {
    const authors = await getAuthors();
    const remainingAuthors = authors.filter(
      (auth) => auth.id !== req.params.id
    );
    const updatedAuthor = {
      ...req.body,
      updatedAt: new Date(),
      id: req.params.id,
    };

    remainingAuthors.push(updatedAuthor);

    await writeAuthors(authors);
    res.send(updatedAuthor);
  } catch (error) {
    next(error);
  }
});

//---DELETE---

authorsRouter.delete("/:id", async (req, res, next) => {
  try {
    const authors = await getAuthors();
    const remainingAuthors = authors.filter(
      (auth) => auth.id !== req.params.id
    );
    await writeAuthors(remainingAuthors);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
