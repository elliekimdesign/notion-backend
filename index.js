const express = require("express");
const { Client } = require("@notionhq/client");
require("dotenv").config();

const app = express();
const port = process.env.PORT; 

const notion = new Client({ auth: process.env.NOTION_API_KEY });

app.get("/api/words", async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    });
    res.json(response.results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch data from Notion");
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
