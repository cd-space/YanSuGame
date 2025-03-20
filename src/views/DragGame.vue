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
            :class="getDropZoneClass(rowIndex, colIndex)" @drop="onDrop($event, rowIndex, colIndex)"
            @dragover.prevent="onDragOver($event, rowIndex, colIndex)" @dragleave="onDragLeave(rowIndex, colIndex)"
            @touchmove.prevent="onTouchMove($event, rowIndex, colIndex)"
            @touchend.prevent="onTouchEnd(rowIndex, colIndex)">
            <span v-if="filledAnswers[rowIndex] && filledAnswers[rowIndex][colIndex]" draggable="true"
              @dragstart="onDragStart(filledAnswers[rowIndex][colIndex], rowIndex, colIndex)"
              @touchstart.prevent="onTouchStart($event, filledAnswers[rowIndex][colIndex], rowIndex, colIndex)">
              {{ filledAnswers[rowIndex][colIndex] }}
            </span>
            <span v-else class="placeholder">拖拽到此</span>
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="resetGame">重置游戏</button>
    <button @click="toggleShuffle">
      {{ shuffleEnabled ? "关闭打乱" : "开启打乱" }}
    </button>
    <button @click="showAnswers">显示答案</button>



    <div class="options" @drop="onDropBack($event)" @dragover.prevent @touchend.prevent="onTouchEndBack">
      <div v-for="(option, index) in availableOptions" :key="index" class="draggable" draggable="true"
        @dragstart="onDragStart(option)" @touchstart.prevent="onTouchStart($event, option)">
        {{ option }}
      </div>
    </div>
  </div>

  <div v-if="gameCleared" class="game-complete">
    <h1>🎉 恭喜你完成挑战！🎉</h1>
    <div style="display: flex; width: 30%; justify-content: space-between">
      <button @click="back">退出</button>
      <button @click="resetGame">再玩一次</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';



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
const hoveredCell = ref({ rowIndex: null, colIndex: null });

const shuffleEnabled = ref(true); // 默认开启打乱
const gameCleared = ref(false);

const availableOptions = computed(() => {
  const usedOptions = new Set();
  Object.values(filledAnswers.value).forEach(row => {
    if (row) Object.values(row).forEach(value => usedOptions.add(value));
  });
  let options = tableData.value.flatMap(row => row.slice(1)).filter(option => !usedOptions.has(option));
  return shuffleEnabled.value ? shuffleArray(options) : options;
});

const onDragStart = (item, rowIndex = null, colIndex = null) => {
  draggedItem.value = item;
  draggedFrom.value = { rowIndex, colIndex };
};

const onDrop = (event, rowIndex, colIndex) => {
  placeItem(rowIndex, colIndex);
};

const onDropBack = (event) => {
  if (draggedItem.value !== null && draggedFrom.value.rowIndex !== null) {
    filledAnswers.value[draggedFrom.value.rowIndex][draggedFrom.value.colIndex] = null;
    draggedItem.value = null;
    draggedFrom.value = { rowIndex: null, colIndex: null };
  }
};

const onDragOver = (event, rowIndex, colIndex) => {
  hoveredCell.value = { rowIndex, colIndex };
};

const onDragLeave = (rowIndex, colIndex) => {
  if (hoveredCell.value.rowIndex === rowIndex && hoveredCell.value.colIndex === colIndex) {
    hoveredCell.value = { rowIndex: null, colIndex: null };
  }
};

const checkGameStatus = () => {
  let allCorrect = true;
  let allFilled = true;

  tableData.value.forEach((row, rowIndex) => {
    row.slice(1).forEach((cell, colIndex) => {
      if (!filledAnswers.value[rowIndex] || !filledAnswers.value[rowIndex][colIndex]) {
        allFilled = false;
      } else if (filledAnswers.value[rowIndex][colIndex] !== cell) {
        allCorrect = false;
      }
    });
  });

  if (allFilled && allCorrect) {
    gameCleared.value = true;
  } else {
    gameCleared.value = false;
  }
};

const onTouchStart = (event, item, rowIndex = null, colIndex = null) => {
  event.preventDefault(); // 防止默认触摸行为
  draggedItem.value = item;
  draggedFrom.value = { rowIndex, colIndex };
  event.target.classList.add('dragging');
};

const onTouchMove = (event, rowIndex, colIndex) => {
  event.preventDefault(); // 防止页面默认滚动
  hoveredCell.value = { rowIndex, colIndex };
};


const onTouchEnd = (rowIndex, colIndex) => {
  if (draggedItem.value) {
    placeItem(rowIndex, colIndex);
  }
};

const onTouchEndBack = () => {
  if (draggedItem.value !== null && draggedFrom.value.rowIndex !== null) {
    filledAnswers.value[draggedFrom.value.rowIndex][draggedFrom.value.colIndex] = null;
    draggedItem.value = null;
    draggedFrom.value = { rowIndex: null, colIndex: null };
  }
};

const placeItem = async (rowIndex, colIndex) => {
  if (draggedItem.value !== null) {
    if (draggedFrom.value.rowIndex !== null && draggedFrom.value.colIndex !== null) {
      filledAnswers.value[draggedFrom.value.rowIndex] ||= {};
      filledAnswers.value[draggedFrom.value.rowIndex][draggedFrom.value.colIndex] = null;
    }
    filledAnswers.value[rowIndex] ||= {};
    filledAnswers.value[rowIndex][colIndex] = draggedItem.value;
    draggedItem.value = null;
    draggedFrom.value = { rowIndex: null, colIndex: null };
    hoveredCell.value = { rowIndex: null, colIndex: null };

    await nextTick(); // 确保 DOM 更新后再检查通关状态
    checkGameStatus();
  }
};

const getDropZoneClass = (rowIndex, colIndex) => {
  if (hoveredCell.value.rowIndex === rowIndex && hoveredCell.value.colIndex === colIndex) {
    return 'drop-hover';
  }
  if (filledAnswers.value[rowIndex] && filledAnswers.value[rowIndex][colIndex]) {
    return filledAnswers.value[rowIndex][colIndex] === tableData.value[rowIndex][colIndex + 1] ? 'correct' : 'incorrect';
  }
  return '';
};

const resetGame = () => {
  filledAnswers.value = {}; // 清空所有填入的答案
  draggedItem.value = null;
  draggedFrom.value = { rowIndex: null, colIndex: null };
  hoveredCell.value = { rowIndex: null, colIndex: null };
  gameCleared.value = false;
};
//关闭/打开打乱功能
const toggleShuffle = () => {
  shuffleEnabled.value = !shuffleEnabled.value;
};

const showAnswers = () => {
  filledAnswers.value = {};
  tableData.value.forEach((row, rowIndex) => {
    filledAnswers.value[rowIndex] = {};
    row.slice(1).forEach((cell, colIndex) => {
      filledAnswers.value[rowIndex][colIndex] = cell; 
    });
  });
};

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

//退出
const back = () => {
  console.log('退出游戏');
  resetGame();
};


</script>

<style scoped>
.game-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

table {
  border-collapse: collapse;
  width: 100%;
  max-width: 600px;
}

th,
td {
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

.drop-hover {
  background-color: #ccc !important;
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


.game-complete {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 3vw;
}
</style>
