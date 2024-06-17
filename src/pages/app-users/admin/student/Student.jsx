// React Helmet Async import should come first
import { Helmet } from 'react-helmet-async';
// Then import React
import React from 'react';
// Then import local components
import Students from './Students';

function App() {
  return (
    <div>
      <Helmet>
        <title>NCTech | Students</title>
      </Helmet>
      <Students />
    </div>
  );
}

export default App;
