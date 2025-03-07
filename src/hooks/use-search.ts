import { useState, useCallback, useEffect } from 'react';
import { debounce } from '@/lib/utils';

interface UseSearchProps<T> {
  data: T[];
  searchFields: (keyof T)[];
  debounceMs?: number;
}

interface UseSearchReturn<T> {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: T[];
  isSearching: boolean;
}

export function useSearch<T>({
  data,
  searchFields,
  debounceMs = 300
}: UseSearchProps<T>): UseSearchReturn<T> {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<T[]>(data);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useCallback(
    (term: string) => {
      setIsSearching(true);
      
      const results = term
        ? data.filter((item) =>
            searchFields.some((field) => {
              const value = item[field];
              return value !== null &&
                value !== undefined &&
                value.toString().toLowerCase().includes(term.toLowerCase());
            })
          )
        : data;

      setSearchResults(results);
      setIsSearching(false);
    },
    [data, searchFields]
  );

  const debouncedSearch = debounce(performSearch, debounceMs);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Reset results when data changes
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults(data);
    } else {
      performSearch(searchTerm);
    }
  }, [data, performSearch, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching
  };
}