<template>
  <div class="drag-fill">
    <!-- 填空区域 -->
    <div class="question" v-html="formattedText"></div>

    <!-- 选项区域 -->
    <div class="options">
      <div
        v-for="(option, index) in options"
        :key="index"
        class="option"
        @mousedown="startDrag(option, $event)"
        @touchstart="startDrag(option, $event)"
      >
        {{ option }}
      </div>
    </div>

    <!-- 拖拽元素 -->
    <div v-if="dragging" class="dragging-item" :style="dragStyle">
      {{ draggingItem }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const question = ref("Vue是一种____框架，它主要用于构建用户界面。");
const blanks = ref(["", ""]);
const options = ref(["渐进式", "响应式", "单页", "后端"]);

// 记录当前拖拽项和拖拽状态
const draggingItem = ref(null);
const dragging = ref(false);
const dragStyle = ref({});

// 处理拖拽开始
const startDrag = (item, event) => {
  draggingItem.value = item;
  dragging.value = true;

  const touch = event.touches ? event.touches[0] : event;

  dragStyle.value = {
    top: `${touch.clientY}px`,
    left: `${touch.clientX}px`,
  };

  document.addEventListener("mousemove", onDragMove);
  document.addEventListener("mouseup", onDragEnd);
  document.addEventListener("touchmove", onDragMove);
  document.addEventListener("touchend", onDragEnd);
};

// 拖拽中
const onDragMove = (event) => {
  const touch = event.touches ? event.touches[0] : event;
  dragStyle.value = {
    top: `${touch.clientY}px`,
    left: `${touch.clientX}px`,
  };
};

// 拖拽结束，处理放置
const onDragEnd = (event) => {
  dragging.value = false;

  const blanksEls = document.querySelectorAll(".blank");
  blanksEls.forEach((el, index) => {
    const rect = el.getBoundingClientRect();
    const touch = event.changedTouches ? event.changedTouches[0] : event;

    if (
      touch.clientX >= rect.left &&
      touch.clientX <= rect.right &&
      touch.clientY >= rect.top &&
      touch.clientY <= rect.bottom
    ) {
      blanks.value[index] = draggingItem.value;
    }
  });

  draggingItem.value = null;

  document.removeEventListener("mousemove", onDragMove);
  document.removeEventListener("mouseup", onDragEnd);
  document.removeEventListener("touchmove", onDragMove);
  document.removeEventListener("touchend", onDragEnd);
};

// 生成带填空的文本
const formattedText = computed(() => {
  return question.value.replace(/____/g, (_, i) => {
    return `<span class='blank'>${blanks.value[i] || "_____"}</span>`;
  });
});
</script>

<style scoped>
.drag-fill {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.question {
  margin-bottom: 20px;
  line-height: 1.8;
}

.blank {
  display: inline-block;
  min-width: 80px;
  padding: 5px 10px;
  margin: 0 5px;
  border: 2px dashed #3498db;
  border-radius: 8px;
  text-align: center;
}

.options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.option {
  padding: 10px 15px;
  background: #42b983;
  color: white;
  border-radius: 12px;
  cursor: grab;
}

.dragging-item {
  position: fixed;
  pointer-events: none;
  padding: 10px 15px;
  background: #42b983;
  color: white;
  border-radius: 12px;
  z-index: 999;
}
</style>
