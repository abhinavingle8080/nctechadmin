// React Helmet Async import should come first
import { Helmet } from 'react-helmet-async';
import React from 'react'; // Then import React
import Batches from './Batches'; // Then import local components

function App() {
  return (
    <div>
      <Helmet>
        <title>NCTech | Batches </title>
      </Helmet>
      <Batches />
    </div>
  );
}

export default App;
