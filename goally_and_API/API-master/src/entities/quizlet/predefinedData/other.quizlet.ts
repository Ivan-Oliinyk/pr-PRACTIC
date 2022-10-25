import { LIBRARY_TYPES, QUIZLET_CORRECT_TYPE } from 'src/shared/const';
import { QUIZLET_TYPES } from 'src/shared/const/quizlet-types';
import { CreateQuizlet } from '../dto';

export const quizletOther: CreateQuizlet = {
  question: 'How do you feel?',
  libraryType: LIBRARY_TYPES.ADULT,
  isCorrectType: QUIZLET_CORRECT_TYPE.ONE,
  type: QUIZLET_TYPES.OTHER,
  answers: [
    {
      text: 'Green',
      correct: true,
    },
    {
      text: 'Blue',
      correct: false,
    },
    {
      text: 'Red',
      correct: false,
    },
    {
      text: 'Yellow',
      correct: false,
    },
  ],
  clientId: null,
  assignedRoutines: [],
  ordering: 0,
};
