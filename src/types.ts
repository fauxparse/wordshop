export type Letter = {
  id: string;
  letter: string;
};

export type Word = {
  id: string;
  letters: Letter[];
};

export type WordsAction =
  | { type: 'add'; word: Word }
  | { type: 'remove'; word: Word };

export type State = {
  letters: Letter[];
  words: Word[];
  word: Word;
};
