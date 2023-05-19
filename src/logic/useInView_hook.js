import React, { useState, useEffect } from 'react';

export function useInView(refs, intersection_div_ref = {current: undefined}) {

  const [elements, setElements] = useState({});

  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        const name = entry.target.id;
        if (!name) {
          console.warn(
            'Encountered entry with no name. You should add data-myProperty to every element passed to the isInView hook.'
          );
        } else {
          if (entry.isIntersecting) {
            setElements((prev) => {
              return {
                ...prev,
                [name]: {
                  isInView: true,
                },
              };
            });
          } else {
            setElements((prev) => ({
              ...prev,
              [name]: {
                isInView: false,
              },
            }));
          }
        }
      });
    };

    const observer_options = {
      root: intersection_div_ref.current ? intersection_div_ref.current : null,
      thershold: 0.3,
      rootMargin: "-32% 0px -66% 0px"
    }

    const observer = new IntersectionObserver(observerCallback, observer_options);

    refs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return elements;
}