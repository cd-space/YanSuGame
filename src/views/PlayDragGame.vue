<template>
    <DragGame ref="gameRef"></DragGame>
</template>

<script setup>
import DragGame from './DragGame.vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { CreatDragGame } from '@/stores/CreatDragGame';

const route = useRoute();
const tableStore = CreatDragGame();
const gameId = route.params.id;
const gameRef = ref()

onMounted(() => {
  tableStore.loadFromLocalStorage(gameId);
  gameRef.value.startColor = tableStore.themeColor;
    gameRef.value.headers = tableStore.headers;
    gameRef.value.tableData = tableStore.rows;
    // gameRef.value.shuffleEnabled=draggameStore.shuffleAnswers;
});
</script>