const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Notion 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.NOTION_DATABASE_ID;

// API 엔드포인트
app.get('/api/words', async (req, res) => {
  try {
    console.log('Fetching words from Notion...');
    
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    const words = response.results.map((page) => {
      const properties = page.properties;
      
      return {
        word: properties.Word?.title?.[0]?.text?.content || '',
        meaning: properties.Meaning?.rich_text?.[0]?.text?.content || '',
        example: properties.Example?.rich_text?.[0]?.text?.content || '',
      };
    });

    console.log(`Found ${words.length} words`);
    res.json(words);
  } catch (error) {
    console.error('Error fetching words:', error);
    res.status(500).json({ error: 'Failed to fetch words' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
