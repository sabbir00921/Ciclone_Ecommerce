const { connectDatabase } = require("./src/database/db");
const { server } = require("./src/app");
const chalk = require("chalk");
require("dotenv").config();

connectDatabase()
  .then(() => {
    server.listen(process.env.PORT || 3000, () => {
      console.log(
        chalk.green(`Server running at http://localhost:${process.env.PORT}`)
      );
    });
  })
  .catch((error) => {
    console.log(chalk.red("Database connection faield!!", error));
  });
