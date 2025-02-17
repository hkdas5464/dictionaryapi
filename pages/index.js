

import { Button, ButtonGroup } from '@heroui/button';
import { Input } from '@heroui/input';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState(null);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!word) return;
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await res.json();
      if (data && data.title) {
        setError("Word not found.");
        setDefinition(null);
      } else {
        setDefinition(data[0]);
        setError(null);
      }
    } catch (err) {
      setError("Error fetching data");
      setDefinition(null);
    }
  };

  const handleSaveWord = async () => {
    if (!definition) return;

    // For simplicity, we'll save the first definition from the first meaning.
    const payload = {
      word: definition.word,
      definition: definition.meanings[0].definitions[0].definition,
    };

    try {
      const res = await fetch('/api/words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        setMessage('Word saved successfully!');
      } else {
        setMessage('Failed to save word.');
      }
    } catch (err) {
      console.error('Failed to save word', err);
      setMessage('Error saving word.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-white bg-gray-900">
     
      <div className="absolute top-4 right-4">
        <Link
        href={"words"}

          onClick={() => setDarkMode(!darkMode)}
          className="p-2"
        >
      <Button >Save Words</Button>
      </Link>
      </div>
      <h1 className="mb-8 text-4xl font-bold">Harendra Dictionary App</h1>
      <form onSubmit={handleSearch} className="flex mb-8">
        <Input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter a word"
          className="text-black rounded-l-lg focus:outline-none"
        />
        <Button type="submit" className="p-2 bg-blue-600 rounded-r-lg hover:bg-blue-700">
          Search
        </Button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {definition && (
        <>
          <div className="max-w-xl text-left">
            <h2 className="mb-4 text-2xl font-bold">{definition.word}</h2>
            {definition.meanings.map((meaning, idx) => (
              <div key={idx} className="mb-4">
                <p className="italic">{meaning.partOfSpeech}</p>
                <ul className="ml-6 list-disc">
                  {meaning.definitions.map((def, i) => (
                    <li key={i} className="mb-1">{def.definition}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <button
            onClick={handleSaveWord}
            className="p-2 mt-4 bg-green-500 rounded hover:bg-green-600"
          >
            Save Word
          </button>
          {message && <p className="mt-2">{message}</p>}
        </>
      )}
    </div>
  );
}
