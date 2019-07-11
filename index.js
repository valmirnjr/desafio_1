const express = require("express");

const server = express();

server.get("/teste", (req, res) => {
  return res.json({ message: "Oi" });
});

server.listen(3000);
