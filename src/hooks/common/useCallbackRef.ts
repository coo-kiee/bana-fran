import { useCallback, useMemo, useState } from 'react';

interface OffsetType {
  offsetTop: number;
  offsetHeight: number;
}

const useCallbackRef = <T extends HTMLElement>(initialValue: null) => {
  const [element, setElement] = useState<T | null>(initialValue); // Element 담아두기
  const offset: OffsetType = useMemo(() => {
    return element
      ? { offsetTop: element.offsetTop, offsetHeight: element.offsetHeight }
      : { offsetTop: 0, offsetHeight: 0 };
  }, [element]);

  const ref = useCallback(
    (node: T) => {
      if (node !== null) {
        setElement(node); // element 담아주기
      } else {
        setElement(initialValue); // node가 화면에서 사라지는 경우 cleanup
      }
    },
    [initialValue],
  );

  return { element, offset, ref };
};

export default useCallbackRef;
