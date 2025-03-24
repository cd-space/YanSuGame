import { defineStore } from "pinia";
import { v4 as uuidv4 } from 'uuid';


export const CreatLineGame = defineStore("LinegameStore", {
  state: () => ({
    questionList: [
      { id: 0, left: "", right: "" },
      { id: 1, left: "", right: "" },
    ],
    randomizeAnswers: false,
    color: "#ACE2FF",
    nextId:2,
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
    addnextId() {
      this.nextId++;
    },


     // 生成唯一ID并保存数据
     saveToLocalStorage() {
      const id = uuidv4(); // 生成唯一ID
      const savedData = JSON.parse(localStorage.getItem("lineGames") || "{}");
      savedData[id] = { ...this.$state,  id };
      localStorage.setItem("lineGames", JSON.stringify(savedData));
      return id; // 返回唯一ID
    },

    // 根据ID加载数据
    loadFromLocalStorage(id) {
      const savedData = JSON.parse(localStorage.getItem("lineGames") || "{}");
      if (savedData[id]) {
        this.questionList = savedData[id].questionList;
        this.randomizeAnswers = savedData[id].randomizeAnswers;
        this.themeColor = savedData[id].themeColor;
        this.nextId = savedData[id].nextId;
      }
    },

    // 删除指定ID的数据
    deleteFromLocalStorage(id) {
      const savedData = JSON.parse(localStorage.getItem("lineGames") || "{}");
      delete savedData[id];
      localStorage.setItem("lineGames", JSON.stringify(savedData));
    }




  },
});
