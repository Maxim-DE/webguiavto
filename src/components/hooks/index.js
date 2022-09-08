import React from 'react';
import ReactDOM from 'react-dom';

function useFetch(component_name) {
  const [fetchState, setFetchState] = React.useState({
    loading: false,
    error: null,
    data: [],
  })

  React.useEffect(() => {
    setFetchState({
      loading: true,
    });

    const host = "192.168.1.4"
    const query = component_name + '.CGI';
    const url = `http://${host}/${query}`;

    fetch(url)
    .then(res => res.json())
    .then(
      (result) => {
        console.dir(result);
        setFetchState({
          loading: false,
          data: result,
        })
      },
      (error) => {
        console.dir(error);
        setFetchState({
          loading: false,
          error: error,
        })
      })
      
  }, []);

  return fetchState;
}

export default useFetch;
