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
          <td v-for="(cell, colIndex) in row.slice(1)" 
              :key="colIndex" 
              class="drop-zone" 
              :class="getDropZoneClass(rowIndex, colIndex)"
              @pointerup="onDrop($event, rowIndex, colIndex)">
            <span v-if="filledAnswers[rowIndex] && filledAnswers[rowIndex][colIndex]"
                  :class="{ dragging: isDragging && draggedFrom.rowIndex === rowIndex && draggedFrom.colIndex === colIndex }"
                  @pointerdown="onPointerDown($event, filledAnswers[rowIndex][colIndex], rowIndex, colIndex)">
              {{ filledAnswers[rowIndex][colIndex] }}
            </span>
            <span v-else class="placeholder">拖拽到此</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="options" @pointerup="onDropBack($event)">
      <div 
        v-for="(option, index) in availableOptions" 
        :key="index" 
        class="draggable" 
        @pointerdown="onPointerDown($event, option)">
        {{ option }}
      </div>
    </div>
    <!-- 拖拽时显示的悬浮元素 -->
    <div v-if="isDragging" class="dragging-element" 
         :style="{ left: dragPosition.x + 'px', top: dragPosition.y + 'px' }">
      {{ draggedItem }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const headers = ref([["标题1", "标题2", "标题3"]]);
const tableData = ref([
  ["A1", "B1", "C1"],
  ["A2", "B2", "C2"]
]);
const filledAnswers = ref({});
const draggedItem = ref(null);
const draggedFrom = ref({ rowIndex: null, colIndex: null });
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const dragPosition = ref({ x: 0, y: 0 });
const currentDropZone = ref({ rowIndex: null, colIndex: null });

const availableOptions = computed(() => {
  const usedOptions = new Set();
  Object.values(filledAnswers.value).forEach(row => {
    if (row) Object.values(row).forEach(value => usedOptions.add(value));
  });
  return tableData.value.flatMap(row => row.slice(1)).filter(option => !usedOptions.has(option));
});

// pointerdown：开始拖拽
const onPointerDown = (event, item, rowIndex = null, colIndex = null) => {
  event.preventDefault();
  draggedItem.value = item;
  draggedFrom.value = { rowIndex, colIndex };
  isDragging.value = true;
  // 计算手指相对于目标元素的偏移量
  const rect = event.target.getBoundingClientRect();
  dragOffset.value = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  dragPosition.value = { x: event.clientX - dragOffset.value.x, y: event.clientY - dragOffset.value.y };

  // 添加全局 pointermove 和 pointerup 监听
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
};

// pointermove：更新拖拽元素位置
const onPointerMove = (event) => {
  if (!isDragging.value) return;
  dragPosition.value = { x: event.clientX - dragOffset.value.x, y: event.clientY - dragOffset.value.y };
};

// pointerup：结束拖拽，根据落点执行放置逻辑
const onPointerUp = (event) => {
  if (!isDragging.value) return;
  // 根据 pointerup 位置，判断是否落在某个目标单元格内
  // 此处可根据实际情况增加对目标区域的判断逻辑
  if (currentDropZone.value.rowIndex !== null) {
    placeItem(currentDropZone.value.rowIndex, currentDropZone.value.colIndex);
  } else {
    // 如果没有放在目标区域，则将拖拽项放回原处
    if (draggedFrom.value.rowIndex !== null) {
      filledAnswers.value[draggedFrom.value.rowIndex][draggedFrom.value.colIndex] = null;
    }
  }
  cleanupDrag();
};

// 在目标单元格上记录 pointerup 时的落点信息
const onDrop = (event, rowIndex, colIndex) => {
  currentDropZone.value = { rowIndex, colIndex };
};

// 放回选项区域
const onDropBack = (event) => {
  if (draggedFrom.value.rowIndex !== null) {
    filledAnswers.value[draggedFrom.value.rowIndex][draggedFrom.value.colIndex] = null;
  }
  cleanupDrag();
};

const placeItem = (rowIndex, colIndex) => {
  if (draggedItem.value !== null) {
    if (draggedFrom.value.rowIndex !== null && draggedFrom.value.colIndex !== null) {
      filledAnswers.value[draggedFrom.value.rowIndex] ||= {};
      filledAnswers.value[draggedFrom.value.rowIndex][draggedFrom.value.colIndex] = null;
    }
    filledAnswers.value[rowIndex] ||= {};
    filledAnswers.value[rowIndex][colIndex] = draggedItem.value;
  }
};

// 清理拖拽状态与全局事件监听
const cleanupDrag = () => {
  isDragging.value = false;
  draggedItem.value = null;
  draggedFrom.value = { rowIndex: null, colIndex: null };
  currentDropZone.value = { rowIndex: null, colIndex: null };
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
};

// 根据答案正确性或拖拽状态返回不同的 CSS 类
const getDropZoneClass = (rowIndex, colIndex) => {
  if (filledAnswers.value[rowIndex] && filledAnswers.value[rowIndex][colIndex]) {
    return filledAnswers.value[rowIndex][colIndex] === tableData.value[rowIndex][colIndex + 1]
      ? 'correct'
      : 'incorrect';
  }
  return '';
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
  transition: background-color 0.3s;
}
.correct {
  background-color: #a0e8a0 !important;
}
.incorrect {
  background-color: #f5a5a5 !important;
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
.dragging-element {
  position: absolute;
  pointer-events: none;
  z-index: 1000;
  background-color: #3498db;
  color: white;
  padding: 10px;
  border-radius: 5px;
}
</style>
