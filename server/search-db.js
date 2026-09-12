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
    let database = [];

    // 💡 AUTOMATED ROUTING: If running live on Vercel production, read directly from your cloud store link
    if (process.env.VERCEL) {
      // ⚠️ Use your direct Vercel Blob public download link here
      const blobUrl = 'https://vercel-storage.com';

      console.log(`🌐 Fetching text analysis vectors from cloud bucket: ${blobUrl}`);
      const response = await fetch(blobUrl);
      if (!response.ok) throw new Error(`Failed to stream data matrix: ${response.statusText}`);
      
      database = await response.json();
    } else {
      // Otherwise, look for your offline local file container asset during testing on your computer
      const dbPath = path.resolve('./server/vector-index.json');
      const rawData = await fs.readFile(dbPath, 'utf-8');
      database = JSON.parse(rawData);
    }

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
    console.error("❌ Error performing database vector search:", error);
    return [];
  }
}
