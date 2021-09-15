import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import { badRequestErrorHandler, notFoundErrorHandler, forbiddenErrorHandler, genericServerErrorHandler } from "./errorHandlers.js"

import authorsRouter from "./services/authors/index.js"
import blogRouter from "./services/blogPosts/index.js"

const server = express()
const port = 3001

server.use(cors())    // Add this to make your FE be able to communicate with BE
server.use(express.json())    // If I do not specify this line BEFORE the routes, all the requests' bodies will be UNDEFINED

// ---Endpoints---

server.use("/authors", authorsRouter)
server.use("/blogPosts", blogRouter)


// --- Error Middlewares ---

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(genericServerErrorHandler)

console.table(listEndpoints(server))

server.listen(port, () => {
  console.log("SERVER RUNNING ON PORT", port)
})