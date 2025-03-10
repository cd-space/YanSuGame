<template>
    <div class="table-container">
      <button @click="addColumn">添加列</button>
      <button @click="addRow">添加行</button>
  
      <table border="1">
        <thead>
          <tr>
            <th v-for="(col, colIndex) in columns" :key="colIndex">列 {{ colIndex + 1 }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
            <td v-for="(col, colIndex) in columns" :key="colIndex">
              {{ tableData[rowIndex][colIndex] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  // 初始表格：2 行 2 列
  const columns = ref(2);
  const tableData = ref([
    ["A1", "B1"],
    ["A2", "B2"]
  ]);
  
  // 添加列
  const addColumn = () => {
    columns.value++;
    tableData.value.forEach(row => row.push("新列"));
  };
  
  // 添加行
  const addRow = () => {
    const newRow = new Array(columns.value).fill("新行");
    tableData.value.push(newRow);
  };
  </script>
  
  <style scoped>
  .table-container {
    text-align: center;
  }
  button {
    margin: 10px;
    padding: 5px 10px;
    cursor: pointer;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    padding: 8px;
    text-align: center;
  }
  </style>
  