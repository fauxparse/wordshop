import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Anagrams from './Anagrams';
import Home from './Home';
import './App.scss';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <BrowserRouter basename="/wordshop">
        <Routes>
          <Route path="/:word" element={<Anagrams />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
