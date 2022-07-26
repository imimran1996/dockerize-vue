const { resolve } = require("path");
const express = require("express");
const history = require("connect-history-api-fallback");
const pkg = require("../package.json");

const PORT = process.env.PORT || 8080;
const ROOT_DIR = resolve(__dirname, "../dist");

console.log(ROOT_DIR);
const app = express();

app.get("/liveness", async (req, res) => {
  res.send({
    name: pkg.name,
    version: pkg.version,
    integrations: [],
  });
});
app.get("/readiness", async (req, res) => {
  res.send({
    name: pkg.name,
    version: pkg.version,
    integrations: [
      {
        name: "apollo/client",
        version: pkg.dependencies["@apollo/client"],
      },
      {
        name: "graphql",
        version: pkg.dependencies.graphql,
        url: "https://192.168.101.84/graphql",
      },
      {
        name: "Environment check",
      },
    ],
  });
});
// app.use(express.static(ROOT_DIR));
app.use(history());
app.use(express.static(ROOT_DIR));
app.get("/", function (req, res) {
  res.render(ROOT_DIR + "/index.html");
});
app.listen(PORT, function () {
  console.log(`${pkg.name}/${pkg.version} started on port ${PORT}`);
});
