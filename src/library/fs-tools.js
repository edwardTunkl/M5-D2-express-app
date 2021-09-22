import fs from 'fs-extra'
import path, {join, dirname, extname} from 'path'
import { fileURLToPath } from 'url'
const { readJSON, writeJSON, writeFile } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")

const blogPostsJSONPath = join(dataFolderPath, "blogPosts.json")
const authorsJSONPath = join(dataFolderPath, "authors.json")

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const publicFolderBlogPostPath = path.join(__dirname, "../../../public/img/blogPosts");


const publicFolderBlogPostPath = join(process.cwd(), "./public")
const publicFolderAuthorsPath = join(process.cwd(), "./public/img/authors")

export const getBlogPosts = () => readJSON(blogPostsJSONPath)
export const writeBlogPosts = content => writeJSON(blogPostsJSONPath, content)

export const getAuthors = () => readJSON(authorsJSONPath)
export const writeAuthors = content => writeJSON(authorsJSONPath, content)

// export const blogPostPicture = (name, contentAsBuffer) => writeFile(join(publicFolderBlogPostPath, name), contentAsBuffer)
// export const authorPicture = (name, contentAsBuffer) => writeFile(join(publicFolderAuthorsPath, name), contentAsBuffer)

/*  export const uploadAuthorPicture = (req, res, next) => {
    try {
      const {originalname, buffer} = req.file                 // => de-constructure this object
      const extension = extname(originalname)
      const fileName = `${req.params.id}${extension}`
      const pathToFile = path.join(publicFolderAuthorsPath, fileName) 
      fs.writeFileSync(pathToFile, buffer)
      const link = `http://localhost:3001/${fileName}`
      req.file = link                                         // => req.file will be link after upload
      // console.log(req.file)
      // console.log(publicFolderAuthorsPath)
      next()                                                  // => next function can request to access file
    } catch (error) {
      next(error)
    }
  }
*/
//---Upload BlogCover in localhost---

export const uploadBlogCover = (req, res, next) => {
  try {
    const {originalname, buffer} = req.file                 // => de-constructure this object
    const extension = extname(originalname)
    const fileName = `${req.params.id}${extension}`
    const pathToFile = path.join(publicFolderBlogPostPath, fileName) 
    fs.writeFileSync(pathToFile, buffer)
    const link = `http://localhost:3001/${fileName}`
    req.file = link                                         // => req.file will be link after upload
    // console.log(req.file)
    // console.log(publicFolderAuthorsPath)
    next()                                                  // => next function can request to access file
  } catch (error) {
    next(error)
  }
}

//--- Upload BlogCover in Cloud---

/*export const cloudUploadBlogCover = (req, res, next) => {
  try {
    const {originalname, buffer} = req.file                 // => de-constructure this object
    const extension = extname(originalname)
    const fileName = `${req.params.id}${extension}`
    fs.writeFileSync(pathToFile, buffer)
    const link = `https://strive-blog-mu.vercel.app/${fileName}`
    req.file = link                                         // => req.file will be link after upload
    // console.log(req.file)
    // console.log(publicFolderAuthorsPath)
    next()                                                  // => next function can request to access file
  } catch (error) {
    next(error)
  }
}
*/
//---Function to create ReadStream from blogPost.json ---

const getBlogPostsReadableStream = () => fs.createReadStream(blogPostsJSONPath)