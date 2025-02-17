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
      <div className="pattern-diagonal-lines text-gray-700 p-4">
        <h1 className="text-4xl font-bold text-center mb-8">Saved Words</h1>
        {message && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4 text-center">
            {message}
          </div>
        )}
        {words.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {words.map((item) => (
              <div key={item._id} className="bg-white shadow rounded-lg p-6">
                {editingId === item._id ? (
                  <div>
                    <input
                      type="text"
                      value={editWord}
                      onChange={(e) => setEditWord(e.target.value)}
                      placeholder="Word"
                      className="w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring focus:border-blue-300"
                    />
                    <textarea
                      value={editDefinition}
                      onChange={(e) => setEditDefinition(e.target.value)}
                      placeholder="Definition"
                      className="w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring focus:border-blue-300"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleUpdate(item._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">{item.word}</h2>
                    <p className="text-gray-700 mb-4">{item.definition}</p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(item._id);
                          setEditWord(item.word);
                          setEditDefinition(item.definition);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
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
