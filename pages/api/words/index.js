// pages/api/words.jsimport clientPromise from '@/lib/dbConnect';

import clientPromise from '@/lib/dbConnect';

export default async function handler(req, res) {
    
  if (req.method === 'POST') {
    const { word, definition } = req.body;
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
      
      // Insert the new word
      const result = await db.collection('words').insertOne({
        word,
        definition,
        createdAt: new Date()
      });
      
      // Check for successful insertion using "insertedId"
      if (!result.insertedId) {
        throw new Error('Insertion failed');
      }
      
      return res.status(201).json({
        success: true,
        data: { word, definition, id: result.insertedId }
      });
    } catch (error) {
      console.error('Error saving word:', error);
      return res.status(500).json({ error: 'Word already exists' });
    }
  }   if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('dictionaryDB'); // Verify this is the correct DB name
      const words = await db.collection('words').find({}).toArray();
      return res.status(200).json({ words });
    } catch (error) {
      console.error('Error fetching words:', error);
      return res.status(500).json({ error: 'Failed to fetch words' });
    }
  }   




  if (req.method === 'POST') {
    const { word, definition } = req.body;

    if (!word || !definition) {
      return res.status(400).json({ error: 'Word and definition are required' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('dictionaryDB'); // Replace with your DB name
      const collection = db.collection('words');

      const result = await collection.insertOne({
        word,
        definition,
        createdAt: new Date(),
      });

      // Depending on your MongoDB driver version, result.ops may not be available.
      const insertedWord = result.ops ? result.ops[0] : { word, definition };

      return res.status(201).json({ success: true, data: insertedWord });
    } catch (error) {
      console.error('Error saving word:', error);
      return res.status(500).json({ error: 'Error saving word' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.setHeader('Allow', ['GET']);

    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
  
  
  
  
 
  



