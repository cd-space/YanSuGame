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
        <tbody style="width: 100%;">
          <tr v-for="(row, rowIndex) in rows" :key="`row-${rowIndex}`">
            <td v-for="(cell, cellIndex) in row" :key="`cell-${rowIndex}-${cellIndex}`" class="td-data">
              <input v-if="cellIndex === 0" type="text" v-model="row[cellIndex]" class="first-column"
                placeholder="| 输入标题内容" />
              <input v-else type="text" v-model="row[cellIndex]" class="other-columns" placeholder="| 输入答案内容" />
            </td>
            <td v-if="columns > 0" class="td-dele">
              <button @click="deleteRow(rowIndex)"><img src="@/assets/images/error.png" alt=""
                  style="width: 20px; height: 20px;"></button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="controls">
        <div style="display: flex; justify-content: space-around;">
          <button @click="addColumn" class="add-btn">+ 添加列</button>
          <button @click="addRow" class="add-btn">+ 添加行</button>
        </div>
        <div class="random-checkbox">
            <label>
              <input type="checkbox" v-model="randomizeAnswers" />
              允许设置在预览中随机打乱答案顺序
            </label>
          </div>
      </div>
    </div>


    <div class="box">
          <div class="theme-setting">
            <div class="theme-setting-title">设置游戏主题色</div>
            <pick-colors v-model:value="color" show-alpha :colors="colors" :width="60" style="margin-right: 18px;" />
          </div>
        </div>
  </div>
</template>
  <script setup>
  import { ref } from 'vue';
  import PickColors from 'vue-pick-colors'
  
  const colors = ref(['#ACE2FF', '#8FF286', '#A3A3A3', '#EBBAED','#FFC9D4','#FFB05C'])
  const color = '#ACE2FF'

  const columns = ref(2);
  const rows = ref([
    ['', ''],
    ['', '']
  ]);
  const headers = ref([
    ['', '']
  ]);
  const shuffleAnswers = ref(false);
  const themeColor = ref('#0000ff');
  
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
  </script>
  
  
  <style scoped>
  .random-checkbox {
    display: flex;
    justify-content: center;
  margin-bottom: 4px;
  background-color: #fff;
  font-size: 14px;
  font-weight: 500;
  color: #000000;
}

.add-btn {
  width: 150px;
  height: 37px;
  margin: 8px 0 20px 0;
  background: #ACE2FF;
  border-radius: 6px;
  font-family: Source Han Sans;
  font-size: 14px;
  font-weight: 500;
  color: #3662EC;
  border: none;
}
  .th-head{
    outline: none; 
    border-bottom: 1px dashed #90D8FF;
    border-left: 1px dashed #90D8FF;
  }

  .td-data{
    border-bottom: 1px dashed #90D8FF;
    border-left: 1px dashed #90D8FF;
  }
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
  .table-editor {
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
  }
  
  th, td {
    padding: 8px;
    text-align: center;
  }
  
  th input, td input {
    width: calc(100% - 25px);
    padding: 10px;
    border: none;
    border-radius: 4px;
  }

  .first-column {
    background-color: #FFF1B8;

  }
  
  .other-columns {
    background-color: #E0EAFF;
  }
  
  th button, td button {
    /* margin-left: 5px; */
    /* padding: 4px 8px;s */
    /* background-color: #f56c6c; */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  /* th button:hover, td button:hover {
    background-color: #e63e3e;
  } */
  
  .controls {
    margin-bottom: 10px;
    width: 100%;
  }
  
  button {
    /* margin-right: 10px; */
    /* padding: 8px 16px; */
    background-color: white;
    color: red;
    border: none;
    /* border-radius: 4px; */
    /* cursor: pointer; */
  }
  th input:focus, td input:focus {
  outline: none;
  box-shadow: none;
}
.theme-setting {
  width: 100%;
  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
  padding: 7px 13px;
}

.theme-setting-title {
  display: flex;
  align-items: center;
  font-family: Source Han Sans;
  font-size: 18px;
  font-weight: 500;
  color: #3D3D3D;
}
  </style>
