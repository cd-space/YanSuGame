<template>
  <div class="table-editor">
    <div class="box">
      <table>
        <thead>
          <tr>
            <th v-for="n in columns" :key="`header-${n}`" class="th-head">
              <div style="display: flex;">
                <input type="text" v-model="headers[0][n]" :placeholder="n === 1 ? '首列标题' : `表头`" />
                <button v-if="n > 0" @click="deleteColumn(n-1)" style="color: red;font-size: 30px;">×</button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in rows" :key="`row-${rowIndex}`">
            <td
              v-for="(cell, cellIndex) in row"
              :key="`cell-${rowIndex}-${cellIndex}`"
              class="td-data"
              @click="handleCellClick(rowIndex, cellIndex, $event)"
            >
              <input
                v-if="cellIndex === 0"
                type="text"
                v-model="row[cellIndex]"
                class="first-column"
                placeholder="| 输入标题内容"
              />
              <input v-else type="text" v-model="row[cellIndex]" class="other-columns" placeholder="| 输入答案内容" />
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 画连线 -->
      <svg class="connections-svg">
        <line
          v-for="(line, index) in connections"
          :key="index"
          :x1="line.startX"
          :y1="line.startY"
          :x2="line.endX"
          :y2="line.endY"
          stroke="blue"
          stroke-width="2"
        />
      </svg>

      <div class="controls">
        <button @click="addColumn" class="add-btn">+ 添加列</button>
        <button @click="addRow" class="add-btn">+ 添加行</button>
        <button @click="resetConnections" class="add-btn">清空连线</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

const columns = ref(2);
const rows = ref([
  ['', ''],
  ['', '']
]);
const headers = ref([
  ['', '']
]);
const connections = ref([]);
const selectedCell = ref(null);

const addColumn = () => {
  columns.value++;
  rows.value.forEach(row => row.push(''));
  headers.value[0].push('');
};

const addRow = () => {
  rows.value.push(new Array(columns.value).fill(''));
};

const deleteColumn = (columnIndex) => {
  columns.value--;
  rows.value.forEach(row => row.splice(columnIndex, 1));
  headers.value[0].splice(columnIndex, 1);
};

const deleteRow = (rowIndex) => {
  rows.value.splice(rowIndex, 1);
};

const resetConnections = () => {
  connections.value = [];
  selectedCell.value = null;
};

// 计算元素的中心点
const getCenterPosition = (element) => {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 + window.scrollX,
    y: rect.top + rect.height / 2 + window.scrollY
  };
};

// 处理点击连线逻辑
const handleCellClick = async (rowIndex, cellIndex, event) => {
  const targetElement = event.target.closest('td');
  if (!targetElement) return;

  const pos = getCenterPosition(targetElement);

  if (!selectedCell.value) {
    // 记录第一个选中的单元格
    selectedCell.value = { rowIndex, cellIndex, pos };
  } else {
    // 记录第二个单元格并画线
    connections.value.push({
      startX: selectedCell.value.pos.x,
      startY: selectedCell.value.pos.y,
      endX: pos.x,
      endY: pos.y,
      from: selectedCell.value,
      to: { rowIndex, cellIndex }
    });

    // 清除当前选中
    selectedCell.value = null;
  }
};
</script>

  
  
<style scoped>
.connections-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.add-btn {
  width: 100px;
  height: 35px;
  background: #ACE2FF;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #3662EC;
  border: none;
}
.td-data {
  position: relative;
  border: 1px dashed #90D8FF;
  cursor: pointer;
}
.td-data.selected {
  background-color: rgba(0, 0, 255, 0.2);
}
</style>

