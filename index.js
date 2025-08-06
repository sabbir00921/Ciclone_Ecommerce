const { connectDatabase } = require("./src/database/db");
const { app } = require("./src/app");
const chalk = require("chalk");
require("dotenv").config();

connectDatabase()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(
        chalk.green(`Server running at http://localhost:${process.env.PORT}`)
      );
    });
  })
  .catch((error) => {
    console.log(chalk.red("Database connection faield!!", error));
  });
