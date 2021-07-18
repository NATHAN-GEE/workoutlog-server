require("dotenv").config();
const Express = require("express");
const app = Express();
const dbconnection = require("./db");
const controllers = require("./controllers");

app.use(Express.json()); //Must be above all routes
app.use("/user", controllers.userController);
app.use("/log", controllers.logController);

dbconnection
  .authenticate()
  .then(() => dbconnection.sync())
  .then(() => {
    app.listen(4000, () => {
      console.log(`[Server]: App is listening on 4000.`);
    });
  })
  .catch((err) => {
    console.log(`[Server]: Server crashed. Error = ${err}`);
  });
