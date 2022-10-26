import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  TouchEvent,
} from 'react';
import { useParams } from 'react-router-dom';
import { last, map, shuffle, uniqueId } from 'lodash-es';
import { Word, Letter, State } from './types';
import './Anagrams.scss';
import { AnimatePresence, motion, Reorder } from 'framer-motion';

type Action =
  | { type: 'addWord'; word: Word }
  | { type: 'removeWord'; word: Word }
  | { type: 'addLetter'; letter: Letter }
  | { type: 'removeLetter'; letter: Letter }
  | { type: 'reorderWords'; words: Word[] }
  | { type: 'shuffle' };

const touchTap = (e: TouchEvent<HTMLButtonElement>) => {
  const { target } = e;
  if (target instanceof HTMLElement) {
    target.click();
    e.preventDefault();
  }
};

const Anagrams: React.FC = () => {
  const { word: source } = useParams<{ word: string }>();

  const [{ letters, words, word }, dispatch] = useReducer(
    (state: State, action: Action) => {
      switch (action.type) {
        case 'addWord':
          return {
            ...state,
            word: { id: uniqueId(), letters: [] },
            words: [...state.words, action.word],
          };
        case 'removeWord':
          return {
            ...state,
            words: state.words.filter((word) => word !== action.word),
            letters: [...state.letters, ...action.word.letters],
          };
        case 'addLetter':
          return {
            ...state,
            word: {
              ...state.word,
              letters: [...state.word.letters, action.letter],
            },
            letters: state.letters.filter((letter) => letter !== action.letter),
          };
        case 'removeLetter':
          return {
            ...state,
            word: {
              ...state.word,
              letters: state.word.letters.filter(
                (letter) => letter !== action.letter
              ),
            },
            letters: [...state.letters, action.letter],
          };

        case 'reorderWords':
          return {
            ...state,
            words: action.words,
          };
        case 'shuffle':
          return {
            ...state,
            letters: shuffle(state.letters),
          };
      }
    },
    undefined,
    () => ({
      letters: source!
        .toUpperCase()
        .replace(/\W+/g, '')
        .split('')
        .map((letter) => ({ id: uniqueId(), letter })),
      words: [],
      word: { id: uniqueId(), letters: [] },
    })
  );

  useEffect(() => {
    const keyPress = (e: KeyboardEvent) => {
      if (
        (e.key === 'Enter' || e.key === 'Space') &&
        !(e.target as HTMLElement)?.closest('button')
      ) {
        if (word.letters.length > 0) {
          dispatch({ type: 'addWord', word });
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        const letter = last(word.letters);
        if (letter) {
          dispatch({ type: 'removeLetter', letter });
        } else {
          const word = last(words);
          if (word) dispatch({ type: 'removeWord', word });
        }
      } else {
        const key = e.key.toUpperCase();
        const letter = letters.find((letter) => letter.letter === key);
        if (letter) dispatch({ type: 'addLetter', letter });
      }
    };

    document.addEventListener('keydown', keyPress);
    return () => document.removeEventListener('keydown', keyPress);
  }, [word, words]);

  const reorder = useCallback(
    (words: Word[]) => dispatch({ type: 'reorderWords', words }),
    []
  );

  return (
    <div className="anagrams">
      <AnimatePresence>
        <Reorder.Group
          as="div"
          className="words"
          axis="x"
          values={words}
          onReorder={reorder}
        >
          {words.map((w) => (
            <Reorder.Item as="div" key={w.id} value={w} className="word">
              {w.letters.map((l) => (
                <motion.span layout key={l.id} layoutId={l.id}>
                  {l.letter}
                </motion.span>
              ))}
              <button
                onClick={() => dispatch({ type: 'removeWord', word: w })}
                onTouchStart={touchTap}
              >
                &times;
              </button>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <div className="current-word">
          {word.letters.length ? (
            <>
              {word.letters.map((letter) => (
                <motion.button
                  layout
                  layoutId={letter.id}
                  className="letter"
                  key={letter.id}
                  onClick={() => dispatch({ type: 'removeLetter', letter })}
                  onTouchStart={touchTap}
                >
                  {letter.letter}
                </motion.button>
              ))}
              <motion.button
                layout
                layoutId="return"
                className="return"
                onClick={() => dispatch({ type: 'addWord', word })}
                onTouchStart={touchTap}
              >
                ⏎
              </motion.button>
            </>
          ) : (
            letters.length > 0 && (
              <motion.div
                layout
                layoutId="placeholder"
                className="current-word__placeholder"
                exit={{ opacity: 0 }}
              >
                Type a word
              </motion.div>
            )
          )}
        </div>

        <div className="letters">
          {letters.map((letter) => (
            <motion.button
              layout
              layoutId={letter.id}
              className="letter"
              key={letter.id}
              onClick={() => dispatch({ type: 'addLetter', letter })}
              onTouchStart={touchTap}
            >
              {letter.letter}
            </motion.button>
          ))}
        </div>
        {letters.length > 0 && (
          <motion.button
            key="scramble"
            className="scramble"
            layout
            layoutId="scramble"
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch({ type: 'shuffle' })}
            onTouchStart={touchTap}
          >
            Scramble
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Anagrams;
