const express = require("express");

const server = express();

server.get("/teste", (req, res) => {
  return res.json({ message: "Oi oi oi" });
});

server.listen(3000);
