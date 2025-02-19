// pages/api/words.js
import clientPromise from '@/lib/dbConnect';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { word, definition, example } = req.body;
    if (!word || !definition) {
      return res.status(400).json({ error: 'Word and definition are required' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('dictionaryDB'); // Replace with your DB name

      // Check if the word already exists
      const existingWord = await db.collection('words').findOne({ word });
      if (existingWord) {
        return res.status(409).json({ error: 'Word already exists.' });
      }

      // Insert the new word including the example field
      const result = await db.collection('words').insertOne({
        word,
        definition,
        example, // saving the example in the document
        createdAt: new Date()
      });

      if (!result.insertedId) {
        throw new Error('Insertion failed');
      }

      return res.status(201).json({
        success: true,
        data: { word, definition, example, id: result.insertedId }
      });
    } catch (error) {
      console.error('Error saving word:', error);
      return res.status(500).json({ error: 'Error saving word' });
    }
  } else if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('dictionaryDB'); // Replace with your DB name if different
      const words = await db.collection('words').find({}).toArray();
      return res.status(200).json({ words });
    } catch (error) {
      console.error('Error fetching words:', error);
      return res.status(500).json({ error: 'Failed to fetch words' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
