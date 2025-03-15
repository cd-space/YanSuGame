import { defineStore } from 'pinia';

export const CreatLineGame  = defineStore('LinegameStore', {
  state: () => ({
    questionList: [
      { id: 0, left: '', right: '' },
  { id: 1, left: '', right: '' },
    ],
    randomizeAnswers: false,
    color: '#ACE2FF',
  }),
  actions: {
    setQuestionList(questions) {
      this.questionList = questions;
    },
    setRandomizeAnswers(randomize) {
      this.randomizeAnswers = randomize;
    },
    setColor(color) {
      this.color = color;
    },
    addid() {
      this.id++;
    }
  },
});