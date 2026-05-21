const express = require("express");
const mainRoute = require("./routes/index")

const app = express();

app.use("/api/v1",mainRoute);

app.listen(3000, () => {
  console.log("Server running")
})