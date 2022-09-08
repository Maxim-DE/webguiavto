import React from 'react';
import ReactDOM from 'react-dom';

import './index.css'

function LoadingSpan(props) {
  const isLoading = props.loading;
  if (isLoading) {
    return <span className='loading_text'>загрузка...</span>;
  }
}

export default LoadingSpan;
