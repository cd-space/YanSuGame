<template>
    <div class="editor-wrapper">
      <div class="head">
        <div class="editor-title">编辑连线配对</div>
      </div>

      <div class="middle">
        <div class="box">
          <div class="qa-header">
            <div class="header-item" style="border-right: 1px dashed #90D8FF;">题干</div>
            <div class="header-item">答案</div>
          </div>

          <div class="qa-list">
            <div v-for="(item, index) in questionList" :key="index" class="qa-row">
              <div class="qa-box">
                <input v-model="item.left" type="text" class="qa-input" placeholder="| 输入题干内容" />
              </div>

              <div class="dash-line">
                <div class="dash-line-content"></div>
              </div>

              <div class="qa-box">
                <input v-model="item.right" type="text" class="qa-input" placeholder="| 输入答案内容" />
              </div>

              <button class="delete-btn" @click="removeQuestion(index)"></button>
            </div>

            <button class="add-btn" @click="addQuestion">
              + 添加题目
            </button>
          </div>

          <!-- 是否随机打乱答案的勾选项 -->
          <div class="random-checkbox">
            <label>
              <input type="checkbox" v-model="randomizeAnswers" />
              允许设置在预览中随机打乱答案顺序
            </label>
          </div>
        </div>

        <div class="box">
          <div class="theme-setting">
            <div class="theme-setting-title">设置游戏主题色</div>
            <pick-colors v-model:value="color" show-alpha :colors="colors" :width="60" style="margin-right: 18px;" />
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
       <div style="display: flex; position: fixed;bottom: 0; width: 100%;">
         <div class="preview-bar" @click="handlePreview">
           <div class="preview-btn"> 预览</div>
         </div>
         <div class="preview-bar" @click="handlePreview">
           <div class="preview-btn"> 确认提交</div>
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
import { useRouter } from 'vue-router'
import { CreatLineGame } from '@/stores/CreatLineGame';
import PickColors from 'vue-pick-colors'
const router = useRouter()
const linegameStore = CreatLineGame();

let showComponent = ref(false)
let massige = ref('')
 const questionList = ref(linegameStore.questionList)

/** 是否随机打乱答案 */
const randomizeAnswers = ref(linegameStore.randomizeAnswers)


/** 颜色数组，包含一些默认颜色 */
const colors = ref(['#ACE2FF', '#8FF286', '#A3A3A3', '#EBBAED','#FFC9D4','#FFB05C'])
const color = ref(linegameStore.color)


/** 添加一条题目 */
function addQuestion() {
  questionList.value.push({ id: linegameStore.id, left: '', right: '' })
  linegameStore.addid()
}

/** 删除某条题目 */
function removeQuestion(index) {
  questionList.value.splice(index, 1)
}

/** “预览”按钮*/
function handlePreview() {
  // 检测题目列表数量是否少于两个
  if (questionList.value.length < 2) {
    showComponent.value = true
    massige.value = '请至少添加两个题目!'
    return
  }

  // 检测是否存在题干或答案为空的情况
  for (const item of questionList.value) {
    if (!item.left || !item.right) {
      showComponent.value = true
      massige.value = '请先完善所有题干和答案!'
      return
    }
  }


  linegameStore.setQuestionList(questionList.value);
  linegameStore.setRandomizeAnswers(randomizeAnswers.value);
  linegameStore.setColor(color.value);
  router.push({
    name: 'ManageLinecopy'})
}
</script>
  
<style scoped>


.middle {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  max-height: 80vh;
}
.middle::-webkit-scrollbar {
  display: none; 
}

/* 外部容器 */
.editor-wrapper {
  width: 100%;
  height: 100%;
  background-color: white;
  position: relative;
}

/* 顶部标题 */
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

/* 题目/答案表头 */
.qa-header {
  display: flex;
  width: 100%;

  font-size: 14px;
  color: #666;
}

.header-item {
  flex: 1;
  text-align: center;
  font-family: Source Han Sans;
  font-size: 18px;
  font-weight: 500;
  color: #000000;
  box-sizing: border-box;
  border-bottom: 1px dashed #90D8FF;
  padding: 8px 0px 10px 0px;
}


.qa-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}


.qa-row {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  position: relative;
  padding: 17px 8px;
  border-bottom: 1px dashed #90D8FF;
}


.qa-box {
  flex: 1;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #E0EAFF;
}

.qa-input {
  width: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  text-align: center;
  font-family: Source Han Sans;
  font-size: 3.5vw;
  color: #000000;
}
.qa-input::placeholder {
  font-family: Source Han Sans;
  font-size: 3.5vw;
  color: #A3A3A3;
}


.dash-line {
  width: 33px;
  height: 2px;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.dash-line-content {
  width: 100%;
  height: 2px;
  border-top: 2px solid #000000;
}


.delete-btn {
  background: url(/src/assets/images/error.png)no-repeat center center;
  background-size: cover;
  cursor: pointer;
  width: 20px;
  height: 20px;
  margin-left: 8px;
  border: none;
}


.add-btn {
  width: 138px;
  height: 37px;
  padding: 10px 0;
  margin: 18px 0px;
  background: #ACE2FF;
  border-radius: 6px;
  font-family: Source Han Sans;
  font-size: 14px;
  font-weight: 500;
  color: #3662EC;
  border: none;
}


.random-checkbox {
  margin-bottom: 14px;
  background-color: #fff;
  font-size: 14px;
  font-weight: 500;
  color: #000000;
}

.random-checkbox label {
  cursor: pointer;
  user-select: none;
}

.random-checkbox input {
  margin-right: 6px;
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
  background: #FFB05C;
  border-radius: 5px;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 500;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
