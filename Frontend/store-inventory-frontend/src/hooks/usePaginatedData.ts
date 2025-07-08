import { useState, useEffect } from 'react';
import axios from 'axios';

interface PaginatedResponse<T> {
  results: T[];
  count: number;
}

const usePaginatedData = <T,>(endpoint: string | ((page: number, search: string) => string), page: number, search: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const url = typeof endpoint === 'string'
      ? `http://localhost:8000/api/${endpoint}/?page=${page}${search ? `&search=${search}` : ''}`
      : endpoint(page, search);

    setLoading(true);
    axios
      .get<PaginatedResponse<T>>(url, {
        auth: { username: 'admin', password: 'seun@112' },
      })
      .then((response) => {
        setData(response.data.results || []);
        setTotalPages(Math.ceil(response.data.count / 10));
      })
      .catch((error) => {
        console.error(`Error fetching data:`, error);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [endpoint, page, search]);

  return { data, loading, totalPages };
};

export default usePaginatedData;
