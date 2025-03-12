<template>
  <div class="table-container">
    <div class="head">
      <div class="editor-title">编辑拖拽组装</div>
    </div>

    <div class="middle">
      <button @click="addColumn">添加列</button>
      <button @click="addRow">添加行</button>
      <div class="box">

        <!-- 表格区域 -->
        <div class="table-wrapper">
          <!-- 表头 -->
          <div class="table-header">
            <div v-for="(headerRow, rowIndex) in tableStore.headers" :key="rowIndex" class="table-row">
              <div v-for="(col, colIndex) in tableStore.columns" :key="colIndex" class="table-cell header-cell"
                :style="getCellStyle(rowIndex, colIndex)">
                <input v-model="tableStore.headers[rowIndex][colIndex]"
                  @input="updateHeader(rowIndex, colIndex, $event.target.value)">
              </div>
            </div>
          </div>

          <!-- 表格主体 -->
          <div class="table-body">
            <div v-for="(row, rowIndex) in tableStore.tableData" :key="rowIndex" class="table-row">
              <div v-for="(cell, colIndex) in row" :key="colIndex" class="table-cell"
                :style="getCellStyle(rowIndex + 2, colIndex)">
                <input v-model="tableStore.tableData[rowIndex][colIndex]"
                  @input="updateCell(rowIndex, colIndex, $event.target.value)">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="preview-bar" @click="handlePreview">
        <div class="preview-btn">预览</div>
      </div>
      <div class="preview-bar" @click="handleSubmit">
        <div class="preview-btn">确认提交</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CreatDragGame } from "@/stores/CreatDragGame";

const tableStore = CreatDragGame();

// 添加列
const addColumn = () => {
  tableStore.addColumn();
};

// 添加行
const addRow = () => {
  tableStore.addRow();
};

// 更新单元格数据
const updateCell = (rowIndex, colIndex, value) => {
  tableStore.updateCell(rowIndex, colIndex, value);
};

// 更新表头数据
const updateHeader = (rowIndex, colIndex, value) => {
  tableStore.updateHeader(rowIndex, colIndex, value);
};

// 预览处理
const handlePreview = () => {
  console.log("预览数据:", tableStore.tableData);
};

// 提交处理
const handleSubmit = () => {
  console.log("提交数据:", tableStore.tableData);
};

// 设置单元格样式
const getCellStyle = (rowIndex, colIndex) => {
  if (rowIndex < 2) {
    return { backgroundColor: "#FFA07A", fontWeight: "bold" }; // 表头橙色
  }
  if (colIndex === 0) {
    return { backgroundColor: "#FFD700" }; // 第一列金色
  }
  return { backgroundColor: "#ADD8E6" }; // 其他单元格浅蓝色
};
</script>

<style scoped>
.box {
  width: 91vw;
  border-radius: 10px;
  box-sizing: border-box;
  border: 1px solid #ACE2FF;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 16px;
}

.table-container {
  width: 100%;
  height: 100%;
  /* text-align: center; */
  /* padding: 10px; */
}

.editor-title {
  width: 100%;
  height: 53px;
  text-align: center;
  align-content: center;
  font-family: Source Han Sans;
  font-size: 24px;
  font-weight: 500;
  font-weight: normal;
  color: #3D3D3D;
  background: #D8D8D8;
}

.middle {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

button {
  margin: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

/* 表格容器 */
.table-wrapper {
  display: flex;
  flex-direction: column;
  width: 91vw;
  overflow-x: auto;
  /* border: 1px solid #ccc; */
}

/* 表头 */
.table-header {
  display: flex;
  flex-direction: column;
  background-color: #eee;
}

/* 表体 */
.table-body {
  display: flex;
  flex-direction: column;
}

/* 每一行 */
.table-row {
  display: flex;
}

/* 单元格 */
.table-cell {
  flex: 1;
  padding: 9px;
  text-align: center;
  /* border: 1px solid #ddd; */
}

/* 表头单元格 */
.header-cell {
  font-weight: bold;
  background-color: #FFA07A;
}

/* 底部按钮 */
.footer {
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #fff;
  justify-content: space-around;
}

.preview-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  width: 50%;
  height: 53px;
  background-color: #f0f0f0;
  font-family: Source Han Sans;
  font-size: 24px;
  font-weight: 500;
  color: #3D3D3D;
  border: 1px solid #A3A3A3;
}

.preview-bar:hover {
  background: #45a049;
}
</style>
