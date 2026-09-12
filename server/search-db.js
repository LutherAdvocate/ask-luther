// server/search-db.js
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';
import fs from 'fs/promises';
import path from 'path';
import 'dotenv/config';

function dotProduct(vecA, vecB) {
  return vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
}

export async function getContextFromVectorDB(userQuery, matchCount = 3) {
  try {
    // 💡 Point directly to your local JSON database asset inside the project directory
    const dbPath = path.resolve('./server/vector-index.json');
    const rawData = await fs.readFile(dbPath, 'utf-8');
    const database = JSON.parse(rawData);

    const { embedding } = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: userQuery,
    });

    const scoredRecords = database.map(record => {
      const similarity = dotProduct(embedding, record.vector);
      return { ...record, similarity };
    });

    scoredRecords.sort((a, b) => b.similarity - a.similarity);
    const topMatches = scoredRecords.slice(0, matchCount);

    return topMatches.map(match => `[Source: ${match.sourceFile}]\n${match.content}`).join('\n\n');
  } catch (error) {
    console.error("❌ Error performing project vector search:", error);
    return "";
  }
}
