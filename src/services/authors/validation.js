import {body} from 'express-validator'

export const authorValidation = [
  body("name").exists().withMessage("Please enter Name"),
  body("surname").exists().withMessage("Please enter Surname"),
  body("email").exists().withMessage("Please enter email"),
  body("dateOfBirth").exists().withMessage("Please enter date-of-birth")
]

