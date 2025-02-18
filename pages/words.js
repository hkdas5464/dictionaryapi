import { Button } from '@heroui/button';
import { Input, Textarea } from '@heroui/input';
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { title } from '@/components/primitives';
import { Divider } from '@heroui/divider';

export default function WordsPage() {
  const [words, setWords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editWord, setEditWord] = useState('');
  const [editDefinition, setEditDefinition] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

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
        const errorData = await res.json();
        console.error('Deletion error response:', errorData);
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setWords(words.filter((word) => word._id !== id));
      } else {
        console.error('Deletion unsuccessful:', data.message);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting word:', err);
    }
  };

  // Update (edit) a word
  const handleUpdate = async (id, updatedData) => {
    if (!updatedData || !updatedData.word || !updatedData.definition) {
      setError("Word and definition are required for update.");
      return;
    }

    try {
      const res = await fetch(`/api/words/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Update error response:', errorData);
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setWords(
          words.map((word) =>
            word._id === id ? { ...word, ...updatedData } : word
          )
        );
        setEditingId(null);
        setEditWord('');
        setEditDefinition('');
      } else {
        console.error('Update unsuccessful:', data.message);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error updating word:', err);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      <div className="p-6 bg-white rounded-lg shadow-xl bg-opacity-80">
        <Link href="/">
          <h1 className="mb-8 text-4xl font-bold text-center"> <span className={title({ color: "blue" })}>Saved Words</span></h1>
        </Link>
        {message && (
          <div className="px-4 py-2 mb-4 text-center text-green-800 bg-green-100 rounded">
            {message}
          </div>
        )}
        {words.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {words.map((item,index) => (
              <Card
                key={item._id}
                className="text-white shadow-lg bg-gradient-to-br from-pink-500 via-purple-500 to-blue-400"
              >
                {editingId === item._id ? (
                  <>
                    <CardHeader>
                      <Input
                        type="text"
                        value={editWord}
                        onChange={(e) => setEditWord(e.target.value)}
                        placeholder="Word"
                      />
                    </CardHeader>
                    <CardBody>
                      <Textarea
                        value={editDefinition}
                        onChange={(e) => setEditDefinition(e.target.value)}
                        placeholder="Definition"
                        className="max-w-xs"
                      />
                    </CardBody>
                    <CardFooter className="flex justify-end space-x-2">
                      <Button
                        onClick={() =>
                          handleUpdate(item._id, {
                            word: editWord,
                            definition: editDefinition,
                          })
                        }
                        color='success'
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingId(null)}
                        color='default'
                      >
                        Cancel
                      </Button>
                    </CardFooter>
                  </>
                ) : (
                  <>

                  
                    <CardHeader className="flex gap-3 text-center">
                      <h2 className={title({ size: "sm" })}><span className='text-black'>{index+1} )</span> {item.word}</h2>

                    </CardHeader>
                    <Divider />

                    <CardBody>
                      <p className="text-gray-200">{item.definition}</p>
                    </CardBody>
                    <CardFooter className="flex justify-end space-x-2">
                      <Button
                        onClick={() => {
                          setEditingId(item._id);
                          setEditWord(item.word);
                          setEditDefinition(item.definition);
                        }}
                        color="warning"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(item._id)}
                        color="danger"
                      >
                        Delete
                      </Button>
                    </CardFooter>
                  </>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No words found.</p>
        )}
      </div>
    </div>
  );
}
