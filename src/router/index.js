import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue'; 
import CreatLineGame from '../views/CreatLineGame.vue';
import CreatDragGame from '../views/CreatDragGame.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/CreatLineGame',
    name: 'CreatLineGame',
    component: CreatLineGame
  },
  {
    path: '/CreatDragGame',
    name: 'CreatDragGame',
    component: CreatDragGame
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;