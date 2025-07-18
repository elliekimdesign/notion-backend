const express = require("express");
const { Client } = require("@notionhq/client");
require("dotenv").config();

const app = express();
const port = process.env.PORT; 

const notion = new Client({ auth: process.env.NOTION_API_KEY });

app.get('/api/words', async (req, res) => {
  try {
    const response = await notion.databases.query({ database_id: databaseId });
    const words = (response.results || []).map((row) => ({
      word: row.properties?.Word?.title?.[0]?.plain_text || '',
      meaning: row.properties?.Meaning?.rich_text?.[0]?.plain_text || '',
      example: row.properties?.Example?.rich_text?.[0]?.plain_text || '',
    })).filter((item) => item.word);
    res.json(words);
  } catch (error) {
    res.status(500).json({ error: error.message, details: error });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
