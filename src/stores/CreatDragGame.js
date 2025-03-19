import { defineStore } from "pinia";

export const CreatDragGame = defineStore("tableStore", {
  state: () => ({
    columns: 2,
    headers: [
      ["标题1", "标题2"],  
    ],
    tableData: [
      ["A1", "B1"],
      ["A2", "B2"]
    ]
  }),
  actions: {
    // 添加列
    addColumn() {
      this.columns++;
      this.headers.forEach(row => row.push(`新列${this.columns}`)); // 表头扩展
      this.tableData.forEach(row => row.push("新列数据"));
    },

    // 添加行
    addRow() {
      const newRow = new Array(this.columns).fill("新行数据");
      this.tableData.push(newRow);
    },

    // 更新单元格数据
    updateCell(rowIndex, colIndex, value) {
      this.tableData[rowIndex][colIndex] = value;
    },

    // 更新表头数据
    updateHeader(rowIndex, colIndex, value) {
      this.headers[rowIndex][colIndex] = value;
    }
  }
});
