import React, { useState, useRef } from 'react';
import { useQuery } from 'react-query';
import './App.css';

const fetchSearchResults = async (query: string) => {
  const response = await fetch(
    `https://etai-backend-537a5149f0b1.herokuapp.com/query?query=${query}`,
  );
  if (!response.ok) {
    throw new Error('Error fetching search results');
  }
  return response.json();
};

const removeTags = (html: string) => {
  return html.replace(/<\/?i>/g, '');
};

function App() {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const { data, error, isLoading, refetch } = useQuery(
    ['search'],
    () => fetchSearchResults(input),
    {
      enabled: false,
    },
  );

  console.log(data);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRef.current) {
      refetch();
    }
  };

  return (
    <div className="App">
      <div>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            value={input}
            onChange={handleInput}
            placeholder="Por qué el cilantro es tan rico"
          />
          <button type="submit">Buscar</button>
        </form>
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error :-(</p>}
      {data && (
        <div>
          <h1>Search results for "{input}"</h1>
          <div>
            {data.map((result: any, index) => (
              <p key={index}>{removeTags(result.title)}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
