import { useState } from "react";
import _orderBy from "lodash/orderBy";

type TSortDir = "asc" | "desc";

export function useSortList(
  list: object,
  name: string,
  direction: TSortDir = "desc"
) {
  const [currentName, setCurrentName] = useState(name);
  const [currentDerection, setCurrentDirection] = useState(direction);
  const handleSort = (name: string, dir: TSortDir) => {
    setCurrentName(name);
    setCurrentDirection(dir);
  };

  const sortedList = _orderBy(list, [currentName], [currentDerection]);

  return {
    list: sortedList,
    name: currentName,
    derection: currentDerection,
    handleSort,
  };
}
