<template>
    <div class="container">
      <header class="header">
        <button class="back-button" @click="goBack">&lt;</button>
        <span style="font-family: Source Han Sans;
            font-size: 18px;
            font-weight: 500;
            color: #3D3D3D;
            ">创建严肃游戏</span>
      </header>
      <main class="main">
        <div class="game-options">
          <button class="option-button" @click="LineGame()">
            <img src="@/assets/images/add.png" alt="" style="width: 23px; height: 23px; margin-bottom: 10px;">
            连线配对</button>
          <button class="option-button" @click="DragGame()">
            <img src="@/assets/images/add.png" alt="" style="width: 23px; height: 23px; margin-bottom: 10px;">
            拖拽组装</button>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  const router = useRouter();


  const goBack = () => {
    // console.log('Go back');
  };
  
  const LineGame= () => {
    router.push({ name:'CreatLineGame' });
  };

  const DragGame= () => {
    router.push({ name:'CreatDragGame' });
  };


  </script>
  
  <style scoped>
  
  .container {
    width: 100%;
    height: 100%;
    background-color: rgb(226, 223, 223);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .header {
    
    height: 49px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
  }
  
  .back-button {
    left: 3vw;
    position:absolute;
    background: none;
    border: none;
    font-size: 24px;
    color: black;
    cursor: pointer;
  }
  
  h1 {
    margin: 0;
    flex-grow: 1;
    text-align: center;
    font-size: 18px;
    color: #333;
  }
  
  .main {
    padding: 29px 36px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  
  .game-options {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  
  .option-button {
    width: 38vw;
    padding: 15px;
    margin: 10px 0;
    background-color: #f5f5f5;
    border: none;
    border-radius: 8px;
    box-shadow: 2px 4px 10px 5px rgba(0, 0, 0, 0.1);
    font-size: 16px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .option-button:hover {
    background-color: #e0e0e0;
  }
  </style>