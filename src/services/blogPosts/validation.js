import {body} from 'express-validator'

export const blogPostsValidation = [

  body("title").exists().withMessage("Please enter Title"),
  body("content").exists().withMessage("Please enter Text")

]