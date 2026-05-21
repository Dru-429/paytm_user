const express = require("express");
const mainRoute = require("./routes/index")
const cors  = require('cors')

const app = express();

app.use("/api/v1",mainRoute);
app.use(cors())
app.use(express.json())

app.listen(3000, () => {
  console.log("Server running")
})