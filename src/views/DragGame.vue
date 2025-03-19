<template>
    <div class="game-container">
      <table>
        <thead>
          <tr>
            <th v-for="(header, index) in headers[0]" :key="index">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
            <td class="question">{{ row[0] }}</td>
            <td v-for="(cell, colIndex) in row.slice(1)" :key="colIndex" class="drop-zone" 
                @drop="onDrop($event, rowIndex, colIndex)" 
                @dragover.prevent>
              <span v-if="filledAnswers[rowIndex] && filledAnswers[rowIndex][colIndex]" 
                    draggable="true" 
                    @dragstart="onDragStart(filledAnswers[rowIndex][colIndex], rowIndex, colIndex)">
                {{ filledAnswers[rowIndex][colIndex] }}
              </span>
              <span v-else class="placeholder">拖拽到此</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="options" @drop="onDropBack($event)" @dragover.prevent>
        <div 
          v-for="(option, index) in availableOptions" 
          :key="index" 
          class="draggable" 
          draggable="true" 
          @dragstart="onDragStart(option)">
          {{ option }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const headers = ref([
    ["标题1", "标题2", "标题3"]
  ]);
  
  const tableData = ref([
    ["A1", "B1", "C1"],
    ["A2", "B2", "C2"]
  ]);
  
  const filledAnswers = ref({});
  const draggedItem = ref(null);
  const draggedFrom = ref(null);
  
  const availableOptions = computed(() => {
    const usedOptions = new Set();
    Object.values(filledAnswers.value).forEach(row => {
      if (row) Object.values(row).forEach(value => usedOptions.add(value));
    });
    return tableData.value.flatMap(row => row.slice(1)).filter(option => !usedOptions.has(option));
  });
  
  const onDragStart = (item, rowIndex = null, colIndex = null) => {
    draggedItem.value = item;
    draggedFrom.value = { rowIndex, colIndex };
  };
  
  const onDrop = (event, rowIndex, colIndex) => {
    if (draggedItem.value !== null) {
      if (draggedFrom.value.rowIndex !== null && draggedFrom.value.colIndex !== null) {
        filledAnswers.value[draggedFrom.value.rowIndex] ||= {};
        filledAnswers.value[draggedFrom.value.rowIndex][draggedFrom.value.colIndex] = null;
      }
      filledAnswers.value[rowIndex] ||= {};
      filledAnswers.value[rowIndex][colIndex] = draggedItem.value;
      draggedItem.value = null;
      draggedFrom.value = { rowIndex: null, colIndex: null };
    }
  };
  
  const onDropBack = (event) => {
    if (draggedItem.value !== null && draggedFrom.value.rowIndex !== null) {
      filledAnswers.value[draggedFrom.value.rowIndex][draggedFrom.value.colIndex] = null;
      draggedItem.value = null;
      draggedFrom.value = { rowIndex: null, colIndex: null };
    }
  };
  </script>
  
  <style scoped>
  .game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
    max-width: 600px;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
  }
  
  .drop-zone {
    min-width: 100px;
    min-height: 30px;
    background-color: white;
    cursor: pointer;
  }
  
  .placeholder {
    color: #aaa;
  }
  
  .options {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    min-height: 50px;
    width: 200px;
    background-color: #e0e0e0;
    padding: 10px;
  }
  
  .draggable {
    padding: 10px;
    background-color: #3498db;
    color: white;
    cursor: grab;
    border-radius: 5px;
  }
  </style>
  