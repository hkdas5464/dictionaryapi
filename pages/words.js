import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function WordsPage() {
  const [words, setWords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editWord, setEditWord] = useState('');
  const [editDefinition, setEditDefinition] = useState('');
  const [message, setMessage] = useState('');

  // Fetch saved words from API
  const fetchWords = async () => {
    try {
      const res = await fetch('/api/words');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        console.log('Fetched words:', data.words);
        setWords(data.words || []);
      } else {
        // If response is not JSON, log the text to diagnose the issue
        const text = await res.text();
        console.error('Expected JSON, got:', text);
        setMessage('Invalid data received from server');
      }
    } catch (error) {
      console.error('Error fetching words:', error);
      setMessage('Error fetching words');
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  // Delete a word
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/words/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setMessage('Word deleted successfully');
        fetchWords();
      } else {
        setMessage(data.error || 'Failed to delete word');
      }
    } catch (error) {
      console.error('Error deleting word:', error);
      setMessage('Error deleting word');
    }
  };

  // Update a word
  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`/api/words/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: editWord, definition: editDefinition }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setMessage('Word updated successfully');
        setEditingId(null);
        fetchWords();
      } else {
        setMessage(data.error || 'Failed to update word');
      }
    } catch (error) {
      console.error('Error updating word:', error);
      setMessage('Error updating word');
    }
  };

  return (
    <div className="min-h-screen bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] p-4">
      <div className="p-4 text-gray-700 pattern-diagonal-lines">
       
       <Link href={"/"}> <h1 className="mb-8 text-4xl font-bold text-center">Saved Words</h1></Link>
        {message && (
          <div className="px-4 py-2 mb-4 text-center text-green-800 bg-green-100 rounded">
            {message}
          </div>
        )}
        {words.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {words.map((item) => (
              <div key={item._id} className="p-6 bg-white rounded-lg shadow">
                {editingId === item._id ? (
                  <div>
                    <input
                      type="text"
                      value={editWord}
                      onChange={(e) => setEditWord(e.target.value)}
                      placeholder="Word"
                      className="w-full px-3 py-2 mb-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    />
                    <textarea
                      value={editDefinition}
                      onChange={(e) => setEditDefinition(e.target.value)}
                      placeholder="Definition"
                      className="w-full px-3 py-2 mb-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleUpdate(item._id)}
                        className="px-4 py-2 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 text-white transition-colors bg-gray-500 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="mb-2 text-2xl font-semibold">{item.word}</h2>
                    <p className="mb-4 text-gray-700">{item.definition}</p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(item._id);
                          setEditWord(item.word);
                          setEditDefinition(item.definition);
                        }}
                        className="px-4 py-2 text-white transition-colors bg-yellow-500 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-4 py-2 text-white transition-colors bg-red-500 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No words found.</p>
        )}
      </div>
    </div>
  );
}
