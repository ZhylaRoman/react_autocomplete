import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface AppProps {
  onSelected?: (person: Person) => void;
}

export const App: React.FC<AppProps> = ({ onSelected }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredPeople = useMemo(() => {
    if (!normalizedQuery) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  const showNoResults = normalizedQuery !== '' && filteredPeople.length === 0;

  const handleSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setIsOpen(false);
    onSelected?.(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          className={`dropdown ${isOpen ? 'is-active' : ''}`}
          data-cy="autocomplete-dropdown"
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onFocus={() => setIsOpen(true)}
              onChange={event => {
                setQuery(event.target.value);
                setSelectedPerson(null);
              }}
              onBlur={() => setIsOpen(false)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onMouseDown={() => handleSelect(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showNoResults && (
          <div
            className="
            notification is-danger is-light mt-3 is-align-self-flex-start"
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
