import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { title } from "@/components/primitives";
import { Spotlight } from '@/components/ui/Spotlight';
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

  // Aggregate synonyms and antonyms from meanings and definitions.
  let allSynonyms = [];
  let allAntonyms = [];
  if (definition) {
    definition.meanings.forEach((meaning) => {
      if (meaning.synonyms && meaning.synonyms.length > 0) {
        allSynonyms = allSynonyms.concat(meaning.synonyms);
      }
      if (meaning.antonyms && meaning.antonyms.length > 0) {
        allAntonyms = allAntonyms.concat(meaning.antonyms);
      }
      meaning.definitions.forEach((def) => {
        if (def.synonyms && def.synonyms.length > 0) {
          allSynonyms = allSynonyms.concat(def.synonyms);
        }
        if (def.antonyms && def.antonyms.length > 0) {
          allAntonyms = allAntonyms.concat(def.antonyms);
        }
      });
    });
  }
  const uniqueSynonyms = Array.from(new Set(allSynonyms));
  const uniqueAntonyms = Array.from(new Set(allAntonyms));

  const handleSaveWord = async () => {
    if (!definition) return;
    // Prepare the payload including synonyms, antonyms, and example (from the first definition if available).
    const payload = {
      word: definition.word,
      definition: definition.meanings[0]?.definitions[0]?.definition || "",
      example: definition.meanings[0]?.definitions[0]?.example || "",
      synonyms: uniqueSynonyms,
      antonyms: uniqueAntonyms,
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
        setMessage('Word already exists or server error occurred.');
      }
    } catch (err) {
      console.error('Failed to save word', err);
      setMessage('Error saving word.');
    }
  };

  return (
    <>
    
     
    <div className="flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden antialiased bg-grid-white/[0.02] relative ">
    <Spotlight
        className="left-0 -top-40 md:left-60 md:-top-20"
        fill="blue"
      />
    
      <div className="absolute top-4 right-4">
        <Link href="words" onClick={() => setDarkMode(!darkMode)}>
          <button 
            type="button" 
            className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
          >
            Saved Word
          </button>
        </Link>
      </div>
      <span className="p-8">
        <h1 className={title({ color: "violet" })}>Harendra Dictionary App</h1>
      </span>
      <form onSubmit={handleSearch} className="flex mb-8">
        <div className="flex items-center gap-4">
          <Input
            isClearable
            className="max-w-xs"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Enter a word"
            type="text"
            variant="bordered"
            onClear={() => setWord("")}
          />
          <Button type="submit" variant="bordered">
            Search
          </Button>
        </div>
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
                    <li key={i} className="mb-1">
                      <p>{def.definition}</p>
                      {def.example && (
                        <p className="ml-4 text-sm italic text-gray-300">
                          <strong>Example:</strong> {def.example}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col max-w-xl gap-4 mt-4 md:flex-row">
            <div>
              <h3 className="mb-2 text-xl font-bold">Synonyms</h3>
              {uniqueSynonyms.length > 0 ? (
                <ul className="pl-5 list-disc">
                  {uniqueSynonyms.map((synonym, idx) => (
                    <li key={idx}>{synonym}</li>
                  ))}
                </ul>
              ) : (
                <p>N/A</p>
              )}
            </div>
            <div>
              <h3 className="mb-2 text-xl font-bold">Antonyms</h3>
              {uniqueAntonyms.length > 0 ? (
                <ul className="pl-5 list-disc">
                  {uniqueAntonyms.map((antonym, idx) => (
                    <li key={idx}>{antonym}</li>
                  ))}
                </ul>
              ) : (
                <p>N/A</p>
              )}
            </div>
          </div>
         <div className='pt-2 pb-2'>
         <Button onClick={handleSaveWord} color="success" variant="bordered">
            Save Word
          </Button>
         </div>
          {message && <p className="mt-2">{message}</p>}
        </>
      )}
    </div>
    </>
  );
}
