import { Button } from '@heroui/button';
import { Input, Textarea } from '@heroui/input';
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { title } from '@/components/primitives';
import { Divider } from '@heroui/divider';

// Helper function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Custom Pagination Component
function CustomPagination({ totalPages, currentPage, onPageChange }) {
  return (
    <div className="flex justify-center mt-6 space-x-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 border rounded ${page === currentPage
              ? 'bg-blue-500 text-white'
              : 'bg-white text-blue-500'
            }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
}

export default function WordsPage() {
  const [words, setWords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editWord, setEditWord] = useState('');
  const [editDefinition, setEditDefinition] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const cardsPerPage = 12;

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
        // Ensure data.words is an array; then shuffle it.
        const shuffledWords = Array.isArray(data.words)
          ? shuffleArray(data.words)
          : [];
        setWords(shuffledWords);
      } else {
        const text = await res.text();
        console.error('Expected JSON, got:', text);
        setMessage('Invalid data received from server');
      }
    } catch (error) {
      console.error('Error fetching words:', error);
      setMessage('Error fetching words');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  // Delete a word
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this word? This action cannot be undone."
    );
    if (confirmed) {
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

  // Determine which words to display on the current page
  const startIndex = (currentPage - 1) * cardsPerPage;
  const currentCards = words.slice(startIndex, startIndex + cardsPerPage);
  // Compute the total number of pages
  const totalPages = Math.ceil(words.length / cardsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      <div className="p-6 rounded-lg shadow-xl from-yellow-400 via-purple-500 to-orange-500 bg-opacity-80">
        <Link href="/">
          <h1 className="mb-8 text-4xl font-bold text-center">
            <span className={title({ color: 'green' })}>Saved Words</span>
          </h1>
        </Link>
        {message && (
          <div className="px-4 py-2 mb-4 text-center text-green-800 bg-green-100 rounded">
            {message}
          </div>
        )}
        {words.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {currentCards.map((item, index) => (
                <Card
                  key={item._id}
                  isBlurred
                  className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
                  shadow="sm"                >
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
                          color="success"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingId(null)}
                          color="default"
                        >
                          Cancel
                        </Button>
                      </CardFooter>
                    </>
                  ) : (
                    <>
                      <CardHeader className="flex gap-3 text-center">
                        <h1 className="mt-2 font-medium text-large">
                          {item.word}
                        </h1>
                      </CardHeader>
                      <Divider />
                      <CardBody>
                        
                        <h3 className="font-semibold text-foreground/90">
                        {item.definition}
                        </h3>

                        {item.example && (
                          <p className="text-gray-200">
                            <i>Example: {item.example}</i>
                          </p>
                        )}
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
            <CustomPagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        ) : (
          <p className="text-center text-gray-500">No words found.</p>
        )}
      </div>
    </div>
  );
}
