<template>
    <LineGame ref="gameRef"></LineGame>
</template>

<script setup>
import LineGame from './LineGame.vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { CreatLineGame } from '@/stores/CreatLineGame';

const route = useRoute();
const tableStore = CreatLineGame();
const gameId = route.params.id;
const gameRef = ref()

onMounted(() => {
  tableStore.loadFromLocalStorage(gameId);
  gameRef.value.startColor = tableStore.color;
    gameRef.value.questionList = tableStore.questionList;
    // gameRef.value.shuffleEnabled=draggameStore.shuffleAnswers;
});
</script>