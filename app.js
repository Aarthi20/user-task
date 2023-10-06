const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "userData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//Register User API
app.post("/api/signup", async (request, response) => {
  const { name, email } = request.body;
  const selectUserQuery = `
    SELECT 
    * 
    FROM 
    user 
    WHERE 
    name = '${name}';`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    //create new user
    const createUserQuery = `
    INSERT INTO
    user (name, email)
    VALUES
    (
      '${name}',
      '${email}',  
    );`;
    await db.run(createUserQuery);
    response.send("Successful user sign-up");
  } else {
    response.status(400);
    response.send("User already exists");
  }
});

//Create Post API
app.post("/api/posts", async (request, response) => {
  const { userId, content } = request.body;
  const selectUserQuery = `SELECT * FROM user WHERE user_id = '${userId}';`;
  const databaseUser = await database.get(selectUserQuery);
  if (databaseUser === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    response.send("Successfully created");
  }
});

//Delete Post API
app.delete(
  "/api/deletepost/:postId",
  authenticateToken,
  async (request, response) => {
    const { postId } = request.params;
    const deletePostQuery = `
  DELETE FROM
    user
  WHERE
    post_id = ${postId} 
  `;
    await database.run(deletePostQuery);
    response.send("Successful post deletion");
  }
);

//Fetch User's Post API
app.get("/api/posts/:userId/", authenticateToken, async (request, response) => {
  const { userId } = request.params;
  const getUserIdQuery = `
    SELECT
      *
    FROM
     user
    WHERE
      user_id = ${userId};`;
  const district = await database.get(getUserIdQuery);
  response.send(district);
});
