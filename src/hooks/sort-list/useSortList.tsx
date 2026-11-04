import { useEffect, useState } from 'react';
import { orderBy } from 'lodash-es';

type TSortDir = 'asc' | 'desc';

export function useSortList(list: object, name: string, direction: TSortDir = 'desc') {
  const searchParams = new URLSearchParams(window.location.search);

  const [currentName, setCurrentName] = useState(searchParams.get('sort') || name);
  const [currentDerection, setCurrentDirection] = useState(
    (searchParams.get('order') as TSortDir) || direction,
  );

  const handleSort = (sortName: string, dir: TSortDir) => {
    const url = new URL(window.location.href);

    url.searchParams.set('sort', sortName);
    url.searchParams.set('order', dir);

    window.history.pushState(null, '', url);
    setCurrentName(sortName);
    setCurrentDirection(dir);
  };

  useEffect(() => {
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search);

      setCurrentName(urlParams.get('sort') || name);
      setCurrentDirection((urlParams.get('order') as TSortDir) || direction);
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
