

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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
     
      <div className="absolute top-4 right-4">
        <Link
        href={"words"}

          onClick={() => setDarkMode(!darkMode)}
          className="bg-gray-800 p-2 rounded hover:bg-gray-700"
        >
          Save Words
        </Link>
      </div>
      <h1 className="text-4xl font-bold mb-8">Dictionary App</h1>
      <form onSubmit={handleSearch} className="mb-8 flex">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter a word"
          className="p-2 rounded-l-lg text-black focus:outline-none"
        />
        <button type="submit" className="bg-blue-600 p-2 rounded-r-lg hover:bg-blue-700">
          Search
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {definition && (
        <>
          <div className="max-w-xl text-left">
            <h2 className="text-2xl font-bold mb-4">{definition.word}</h2>
            {definition.meanings.map((meaning, idx) => (
              <div key={idx} className="mb-4">
                <p className="italic">{meaning.partOfSpeech}</p>
                <ul className="list-disc ml-6">
                  {meaning.definitions.map((def, i) => (
                    <li key={i} className="mb-1">{def.definition}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <button
            onClick={handleSaveWord}
            className="mt-4 bg-green-500 p-2 rounded hover:bg-green-600"
          >
            Save Word
          </button>
          {message && <p className="mt-2">{message}</p>}
        </>
      )}
    </div>
  );
}
