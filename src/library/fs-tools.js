import fs from 'fs-extra'
import {join, dirname} from 'path'
import { fileURLToPath } from 'url'
const { readJSON, writeJSON, writeFile } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")

const blogPostsJSONPath = join(dataFolderPath, "blogPosts.json")
const authorsJSONPath = join(dataFolderPath, "authors.json")

const publicFolderBlogPostPath = join(process.cwd(), "./public/img/blogPosts")
const publicFolderAuthorsPath = join(process.cwd(), "./public/img/authors")

export const getBlogPosts = () => readJSON(blogPostsJSONPath)
export const writeBlogPosts = content => writeJSON(blogPostsJSONPath, content)

export const getAuthors = () => readJSON(authorsJSONPath)
export const writeAuthors = content => writeJSON(authorsJSONPath, content)

export const blogPostPicture = (name, contentAsBuffer) => writeFile(join(publicFolderBlogPostPath, name), contentAsBuffer)
export const authorPicture = (name, contentAsBuffer) => writeFile(join(publicFolderAuthorsPath, name), contentAsBuffer)
