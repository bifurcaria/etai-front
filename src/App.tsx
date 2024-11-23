import React, { useState, useRef } from 'react';
import { useQuery } from 'react-query';
import './App.css';
import ReactMarkdown from 'react-markdown';

const fetchSearchResults = async (query: string) => {
  const response = await fetch(
    `https://etai-backend-537a5149f0b1.herokuapp.com/query?question=${query}`,
  );
  if (!response.ok) {
    throw new Error('Error fetching search results');
  }
  return response.json();
};

function App() {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const { data, error, isLoading, refetch } = useQuery(
    ['search'],
    () => fetchSearchResults(inputRef.current?.value || ''),
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
          <h1>{data.summary.title}</h1>
          <div>
            <ReactMarkdown>{data.summary.introduction_summary}</ReactMarkdown>
          </div>
          <div>{data.research_findings_summary}</div>
          <div>
            {data.works_partial.map((result: any, index) => (
              <p key={index}>{result.title + ` (${result.pub_year})`}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
