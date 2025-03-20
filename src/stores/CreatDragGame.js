import { defineStore } from "pinia";

export const CreatDragGame = defineStore("tableStore", {
  state: () => ({
    columns: 2,
    rows: [
      ['', ''],
      ['', '']
    ],
    headers: [
      ['', '']
    ],
    shuffleAnswers: false,
    themeColor: '#ACE2FF'
  }),
  actions: {
    // 添加列
    addColumn() {
      this.columns++;
      this.rows.forEach(row => row.push(''));
      this.headers[0].push('');
    },

    // 删除列
    deleteColumn(columnIndex) {
      this.columns--;
      this.rows.forEach(row => row.splice(columnIndex, 1));
      this.headers[0].splice(columnIndex, 1);
    },

    // 添加行
    addRow() {
      this.rows.push(new Array(this.columns).fill(''));
    },

    // 删除行
    deleteRow(rowIndex) {
      this.rows.splice(rowIndex, 1);
    },

    // 更新单元格数据
    updateCell(rowIndex, cellIndex, value) {
      this.rows[rowIndex][cellIndex] = value;
    },

    // 更新表头数据
    updateHeader(rowIndex, cellIndex, value) {
      this.headers[rowIndex][cellIndex] = value;
    },

    // 切换答案顺序随机化
    toggleShuffleAnswers() {
      this.shuffleAnswers = !this.shuffleAnswers;
    },

    // 设置主题颜色
    setThemeColor(color) {
      this.themeColor = color;
    }
  }
});
