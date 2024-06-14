// React Helmet Async import should come first
import { Helmet } from 'react-helmet-async';
import React from 'react'; // Then import React
import Payments from './Payments'; // Then import local components

function App() {
  return (
    <div>
      <Helmet>
        <title>NCTech | Payments </title>
      </Helmet>
      <Payments />
    </div>
  );
}

export default App;
