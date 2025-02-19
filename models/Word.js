// pages/api/words.js
import clientPromise from '@/lib/dbConnect';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { word, definition,example } = req.body;

    if (!word || !definition || !example) {
      return res.status(400).json({ error: 'Word and definition are required' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('dictionaryDB'); // Replace with your DB name
      const collection = db.collection('words');

      const result = await collection.insertOne({ word, definition, example, createdAt: new Date() });
      return res.status(201).json({ success: true, data: result.ops ? result.ops[0] : { word,definition, example } });
    } catch (error) {
      console.error('Error saving word:', error);
      return res.status(500).json({ error: 'Error saving word' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
