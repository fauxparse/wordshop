import React, { FormEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.scss';

type WordForm = HTMLFormElement & {
  word: HTMLInputElement;
};

const Home: React.FC = () => {
  const navigate = useNavigate();

  const submit = useCallback((e: FormEvent<WordForm>) => {
    e.preventDefault();
    const {
      word: { value },
    } = e.currentTarget;
    if (value) navigate(`/${value}`);
  }, []);

  return (
    <form className="home" onSubmit={submit}>
      <label htmlFor="word">Type a word to get started</label>
      <input id="word" type="text" autoFocus />
    </form>
  );
};

export default Home;
