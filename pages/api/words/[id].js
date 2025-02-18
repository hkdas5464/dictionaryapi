// pages/api/words/[id].js
import clientPromise from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  console.log('API Request:', req.method, req.query);
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      const client = await clientPromise;
      const db = client.db('dictionaryDB'); // Replace with your DB name
      const collection = db.collection('words');

      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 1) {
        return res.status(200).json({ success: true });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'Word not found' });
      }
    } catch (error) {
      console.error('Error deleting word:', error);
      return res.status(500).json({ error: 'Error deleting word' });
    }
  } else if (req.method === 'PUT') {
    // Expecting both "word" and "definition" in the request body
    const { word, definition } = req.body;
    if (!word || !definition) {
      return res
        .status(400)
        .json({ error: 'Word and definition are required for update' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('dictionaryDB'); // Replace with your DB name
      const collection = db.collection('words');

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { word, definition } }
      );

      // Even if modifiedCount is 0, we consider it successful if a document was matched.
      if (result.matchedCount === 1) {
        return res.status(200).json({
          success: true,
          message:
            'Word updated successfully (or no changes were necessary)',
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Word not found',
        });
      }
    } catch (error) {
      console.error('Error updating word:', error);
      return res.status(500).json({ error: 'Error updating word' });
    }
  } else {
    res.setHeader('Allow', ['DELETE', 'PUT']);
    return res
      .status(405)
      .json({ error: `Method ${req.method} not allowed` });
  }
}
