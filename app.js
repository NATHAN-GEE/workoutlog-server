require("dotenv").config();
const Express = require("express");
const app = Express();
const dbconnection = require("./db");
const controllers = require("./controllers");

app.use(Express.json()); //Must be above all routes
app.use(require('./middleware/headers'));
app.use("/user", controllers.userController);
app.use("/log", controllers.logController);

dbconnection
  .authenticate()
  .then(() => dbconnection.sync())
  .then(() => {
    app.listen(5000, () => {
      console.log(`[Server]: App is listening on 5000.`);
    });
  })
  .catch((err) => {
    console.log(`[Server]: Server crashed. Error = ${err}`);
  });
