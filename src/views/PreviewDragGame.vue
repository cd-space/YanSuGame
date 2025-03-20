<template>
    <div class="head">
        <div class="editor-title">预览游戏</div>
    </div>
    <div class="middle">
        <DragGame ref="gameRef"></DragGame>
    </div>
    <div style="display: flex; position: fixed;bottom: 0; width: 100%;">
        <div class="preview-bar" @click="goBack">
            <div class="preview-btn"> <img src="../assets/images/pencil.png" alt="编辑" style="width: 18px; height:  18px; margin-right: 5px;">编辑</div>
        </div>
        <div class="preview-bar" @click="showAnswer">
            <div class="preview-btn"> 显示答案</div>
        </div>
    </div>


</template>

<script setup>
import { onMounted, ref, nextTick  } from 'vue';
import DragGame from './DragGame.vue';
import { useRouter } from 'vue-router'
import { CreatDragGame } from '@/stores/CreatDragGame';
 

const draggameStore = CreatDragGame();
const router = useRouter()
const gameRef = ref()



const showAnswer = () => {
  gameRef.value.showAnswers()
}

const goBack = () => {
  router.go(-1);
  };

onMounted(() => {

    gameRef.value.startColor = draggameStore.themeColor;
    gameRef.value.headers = draggameStore.headers;
    gameRef.value.tableData = draggameStore.rows;
    gameRef.value.shuffleEnabled=draggameStore.shuffleAnswers;
});
</script>

<style scoped>
.head{
    height: 53px;
}
.middle{
    height: calc(100vh - 53px - 53px);
}
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


</style>
