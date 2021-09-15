import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const authorsRouter = express.Router();

const currentFilePath = fileURLToPath(import.meta.url);
// console.log("IMPORT META URL ", import.meta.url);
// console.log("CURRENT FILE PATH: ", currentFilePath);
const currentDirPath = dirname(currentFilePath);
// console.log("CURRENT DIRECTORY: ", currentDirPath);
const authorsJSONFilePath = join(currentDirPath, "authors.json");
// console.log("Authors.json path: ", authorsJSONFilePath);

//---GET---

authorsRouter.get("/", (req, res, next) => {
  try{
    const fileContent = fs.readFileSync(authorsJSONFilePath);
    // console.log(JSON.parse(fileContent));
    const authors = JSON.parse(fileContent);
    res.send(authors);

  } catch (error){
    res.send(500).send({ message: error.message });
  }
});

//---POST---

authorsRouter.post("/", (req, res, next) => {
  try {
    // console.log("REQUESTBODY: ", req.body);
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
    const authors = JSON.parse(fs.readFileSync(authorsJSONFilePath));
    authors.push(newAuthor);
    fs.writeFileSync(authorsJSONFilePath, JSON.stringify(authors));
    res.status(201).send({ id: newAuthor.id });

  } catch (error){
    res.send(500).send({ message: error.message });
  }
});




//---GET---

authorsRouter.get("/:id", (req, res, next) =>{
  try{
    const authors = JSON.parse(fs.readFileSync(authorsJSONFilePath))
    const author = authors.find(a => a.id === req.params.id)
    
    if (author){
      res.send(author)
     } else {
      res.send("Not found!")
     }
  } catch (error){
    res.send(500).send({ message: error.message });
  }
})

//---DELETE---

authorsRouter.delete("/:id", (req, res, next) => {
try {
  const authors = JSON.parse(fs.readFileSync(authorsJSONFilePath))
  const remainingAuthors = authors.filter(auth => auth.id !== req.params.id)
  fs.writeFileSync(authorsJSONFilePath, JSON.stringify(remainingAuthors))
  res.status(204).send()

} catch (error){
  res.send(500).send({ message: error.message });
}
})


//---PUT---

authorsRouter.put("/:id", (req, res, next) => {
  try {
    const authors = JSON.parse(fs.readFileSync(authorsJSONFilePath))
    const remainingAuthors = authors.filter(auth => auth.id !== req.params.id) 
    const updatedAuthor = {...req.body, updatedAt: new Date(), id: req.params.id}
  
    remainingAuthors.push(updatedAuthor)
  
    fs.writeFileSync(authorsJSONFilePath, JSON.stringify(authors))
    res.send(updatedAuthor)

  } catch (error){
    res.send(500).send({ message: error.message });
  }

})

export default authorsRouter;