import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"

const server = express()
const port = 3001

server.use(cors())
server.use(express.json())

server.listen(port, () => {
  console.log("SERVER RUNNING ON PORT", port)
})