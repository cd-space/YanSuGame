<template>
  <div class="table-container">
    <div class="head">
      <button class="back-button" @click="goBack"><img src="../assets/images/back.png" alt="back" style="width:9px ; height: 16px;"></button>
      <div class="editor-title">编辑拖拽组装</div>
    </div>

    <div class="middle">
      <div class="box">
      <table>
        <thead>
          <tr>
            <th v-for="n in tableStore.columns" :key="`header-${n}`" class="th-head">
              <div style="display: flex;">
                <input type="text" v-model="tableStore.headers[0][n-1]" :placeholder="n === 1 ? '| 首列标题' : `| 表头`" style="font-size:clamp(10px, 3.4vw, 20px);"/>
                <button v-if="n > 0" @click="deleteColumn(n-1)" style="color: red;font-size: 30px;">×</button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody style="width: 100%;">
          <tr v-for="(row, rowIndex) in tableStore.rows" :key="`row-${rowIndex}`">
            <td v-for="(cell, cellIndex) in row" :key="`cell-${rowIndex}-${cellIndex}`" class="td-data">
              <input v-if="cellIndex === 0" type="text" v-model="row[cellIndex]" class="first-column"
                placeholder="| 输入标题内容" />
              <input v-else type="text" v-model="row[cellIndex]" class="other-columns" placeholder="| 输入答案内容" />
            </td>
            <td v-if="tableStore.columns > 0" class="td-dele" style="width: 30px;padding-left: 0;">
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
            <label style="display: flex; justify-content: center; align-items: center;">
              <input type="checkbox" v-model="tableStore.shuffleAnswers" style="width: 15px; height: 15px; margin: 3px;" />
              允许设置在预览中随机打乱答案顺序
            </label>
          </div>
      </div>
    </div>

    <div class="box">
          <div class="theme-setting">
            <div class="theme-setting-title">设置游戏主题色</div>
            <pick-colors v-model:value="tableStore.themeColor" show-alpha :colors="colors" :width="60" style="margin-right: 18px;" />
          </div>
        </div>
    </div>
    <div class="footer">
      <div class="preview-bar" @click="handlePreview" style="border-left: 2px solid #A3A3A3;">
        <div class="preview-btn">预览</div>
      </div>
      <div class="preview-bar" @click="handleSubmit" style="border-right: 2px solid #A3A3A3;">
        <div class="preview-btn">确认提交</div>
      </div>
    </div>
  </div>

  <div v-if="showComponent" class="tips">
      <div>{{ massige }}</div>
      <button @click="showComponent = false" class="tips-button">确定</button>
    </div>
</template>


<script setup>
import { ref } from 'vue'
  import { CreatDragGame } from '@/stores/CreatDragGame';  
  import PickColors from 'vue-pick-colors';
  import { useRouter } from 'vue-router';

  const tableStore = CreatDragGame(); // 获取 store
  const router = useRouter();

  const colors = ['#ACE2FF', '#8FF286', '#A3A3A3', '#EBBAED','#FFC9D4','#FFB05C'];

  let showComponent = ref(false)
  let massige = ref('')

  const addColumn = () => {
    tableStore.addColumn();
  };

  const addRow = () => {
    tableStore.addRow();
  };

  const deleteColumn = (index) => {
    tableStore.deleteColumn(index);
  };

  const deleteRow = (index) => {
    tableStore.deleteRow(index);
  };

  const goBack = () => {
    router.go(-1);
  };

  const validateTable = () => {
    if (tableStore.headers.some(header => header.some(col => !col))) {
      showComponent.value = true
      massige.value = '请完善题干';
      return false;
    }
    if (tableStore.rows.some(rows => rows.some(col => !col))) {
      showComponent.value = true
      massige.value = '请完善题干';
      return false;
    }
    if (tableStore.rows.length < 2 || tableStore.rows.some(row => row.length < 2)) {
      showComponent.value = true
      massige.value = '至少需要两道题';
      return false;
    }

    return true;
  };

  const handlePreview = () => {
    if (validateTable()) {
      router.push({
        name: 'PreviewDragGame'})
    }
  };

  const handleSubmit = () => {
    if (validateTable()) {
      // console.log('DragGame确认提交...');
      const gameId = tableStore.saveToLocalStorage(); // 保存数据并生成唯一ID
      console.log(gameId,'gameId')
      const gameUrl = `${window.location.origin}/#/PlayDragGame/${gameId}`;
      console.log(gameUrl,'gameUrl')
      router.push(`/PlayDragGame/${gameId}`); 
    }
  };
</script>

<style scoped>
  .back-button {
    left: 3vw;
    top: 10px;
    position:absolute;
    background: none;
    border: none;
    font-size: 24px;
    color: black;
    cursor: pointer;
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

.table-container {
  width: 100%;
  height: 100%;
}

.head{
  height: 53px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #D8D8D8;

}
/* 顶部标题 */
.editor-title {
  font-family: Source Han Sans;
  font-size: 24px;
  font-weight: 500;
  font-weight: normal;
  color: #3D3D3D;
}

.middle {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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
  font-size: 18px;
  font-weight: 500;
  color: #3D3D3D;
  border: 1px solid #A3A3A3;
}



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
  width: clamp(20px,30vw,250px);
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
    font-size:clamp(10px, 3.4vw, 20px);
  }
  
  .other-columns {
    background-color: #E0EAFF;
    font-size: clamp(10px, 3.4vw, 20px);
  }
  
  th button, td button {
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  

  
  .controls {
    margin-bottom: 10px;
    width: 100%;
  }
  
  button {
    background-color: white;
    color: red;
    border: none;
  }
  th input:focus, td input:focus {
  outline: none;
  box-shadow: none;
}

th input, td input {
  text-align: center;
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

.tips {
  display: flex;
  justify-content: center;
  padding:15px 10px 0px 10px ;
  width: 198px;
  min-height: 100px;
  border-radius: 10px;
  background: #FFFFFF;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: fixed;
  font-family: Source Han Sans;
font-size: 18px;
font-weight: 500;
color: #3D3D3D;
box-sizing: border-box
}

.tips-button{
  width: 100px;
  height: 30px;
  background: #ACE2FF;
  border-radius: 5px;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 500;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  border: none;
}

</style>
