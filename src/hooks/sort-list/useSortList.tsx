import { useEffect, useState } from 'react';
import orderBy from 'lodash/orderBy';

type TSortDir = 'asc' | 'desc';

export function useSortList(
  list: object,
  name: string,
  direction: TSortDir = 'desc',
) {
  const searchParams = new URLSearchParams(window.location.search);

  const [currentName, setCurrentName] = useState(
    searchParams.get('sort') || name,
  );
  const [currentDerection, setCurrentDirection] = useState(
    (searchParams.get('order') as TSortDir) || direction,
  );

  const handleSort = (name: string, dir: TSortDir) => {
    const url = new URL(window.location.href);

    url.searchParams.set('sort', name);
    url.searchParams.set('order', dir);

    window.history.pushState(null, '', url);
    setCurrentName(name);
    setCurrentDirection(dir);
  };

  useEffect(() => {
    const handleUrlChange = () => {
      const searchParams = new URLSearchParams(window.location.search);

      setCurrentName(searchParams.get('sort') || name);
      setCurrentDirection((searchParams.get('order') as TSortDir) || direction);
    };

    window.addEventListener('popstate', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const sortedList = orderBy(list, [currentName], [currentDerection]);

  return {
    list: sortedList,
    name: currentName,
    derection: currentDerection,
    handleSort,
  };
}
