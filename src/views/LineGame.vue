<template>
  <div class="container" :style="{ backgroundImage: color }">
    <div style="display: flex; justify-content: space-between; margin-bottom: 10px">
      <div style="height: 6vw; width: 6vw">
        <img
          v-if="audioEnabled"
          @click="audioEnabled = false"
          src="@/assets/images/openSound.png"
          alt=""
          style="height: 100; width: 100%"
        />
        <img
          v-else
          @click="audioEnabled = true"
          src="@/assets/images/OffSound.png"
          alt=""
          style="height: 100; width: 100%"
        />
      </div>
      <div style="display: flex; align-items: center; font-size: 3vw">点击不同色块进行连线</div>
      <button
        @click="resetGame"
        style="
          background-color: white;
          border: none;
          border-radius: 30px;
          width: 10.9415vw;
          height: 5.8vw;
          font-size: 2.0356vw;
        "
      >
        重置
      </button>
      <!-- <button @click="showAnswer "> 显示答案</button> -->
    </div>

    <div class="options-container">
      <div class="options-container2" ref="options_container2">
        <!-- 遍历左侧选项，并从打乱后的右侧选项中取值 -->
        <div class="option-pair" v-for="(leftItem, index) in leftItems" :key="leftItem.id">
          <!-- 左侧选项 -->
          <div
            class="option left-option"
            :style="getOptionStyle(leftItem.id, 'left')"
            @click="handleLeftClick(leftItem.id)"
            :ref="el => setLeftRef(leftItem.id, el)"
          >
            {{ leftItem.content }}
          </div>

          <!-- 右侧选项（取打乱后的对应索引项） -->
          <div style="display: flex; align-items: center; padding-right: 5vw">
            <div
              v-if="index < rightItems.length"
              class="option right-option"
              :style="getOptionStyle(rightItems[index].id, 'right')"
              @click="handleRightClick(rightItems[index].id)"
              :ref="el => setRightRef(rightItems[index], el)"
            >
              {{ rightItems[index].content }}
            </div>
            <img
              v-if="lines.some(line => line.rightId === rightItems[index].id && line.isCorrect)"
              src="@/assets/images/right.png"
              alt="✔"
              class="check-icon"
            />
          </div>
        </div>

        <!-- 连线画布 -->
        <svg class="lines" ref="svg" :height="svgHeight">
          <line
            v-for="(line, index) in lines"
            :key="index"
            :x1="line.x1"
            :y1="line.y1"
            :x2="line.x2"
            :y2="line.y2"
            :stroke="line.isCorrect ? '#ACE2FF' : 'red'"
            stroke-width="2"
          />
        </svg>
      </div>
    </div>
  </div>

  <!-- 通关页面 -->
  <div v-if="gameCompleted" class="game-complete">
    <h1>🎉 恭喜你完成挑战！🎉</h1>
    <div style="display: flex; width: 30%; justify-content: space-between">
      <button @click="back">退出</button>
      <button @click="resetGame">再玩一次</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  type ComponentPublicInstance,
  watch,
} from 'vue';
import successAudio from '../assets/audio/rightanswer.mp3';
import failureAudio from '../assets/audio/errorAnswer.mp3';
import challengeSuccessAudio from '../assets/audio/success.mp3';

// const props = defineProps({
//   questionListFromProps: Array,
// });


const questionList = ref([
  { id: Math.random(), left: 'Apple', right: '苹果苹果苹果苹果苹果苹果苹果苹果' },
  { id: Math.random(), left: 'Banana', right: '香蕉' },
  { id: Math.random(), left: 'Orange', right: '橙子' },
  { id: Math.random(), left: 'Apple', right: '苹果' },
  { id: Math.random(), left: 'Banana', right: '香蕉' },
  { id: Math.random(), left: 'Orange', right: '橙子' },
  { id: Math.random(), left: 'Apple', right: '苹果' },
  { id: Math.random(), left: 'Banana', right: '香蕉' },
  { id: Math.random(), left: 'Orange', right: '橙子' },
]);


watch(questionList, v => {
  nextTick(() => {
    svgHeight.value = options_container2.value.clientHeight;
  });
});


// 控制选项是否打乱
const isShuffled = ref(true); // 默认打乱
const lines = ref<
  Array<{
    leftId: number;
    rightId: number;
    isCorrect: boolean;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }>
>([]);
const leftRefs = ref<Record<number, HTMLElement>>({});
const rightRefs = ref<Record<number, HTMLElement>>({});
const selectedLeft = ref<number | null>(null);
const selectedRight = ref<number | null>(null);
const svg = ref<SVGSVGElement | null>(null);

// 背景色
const startColor = ref('#ACE2FF');
const endColor = ref('white');
const color = computed(
  () => `linear-gradient(to bottom, ${startColor.value} 75%, ${endColor.value})`
);

const gameCompleted = ref(false);

// 音效
const audioEnabled = ref(true);
const successSound = new Audio(successAudio);
const failureSound = new Audio(failureAudio);
const challengeSuccessSound = new Audio(challengeSuccessAudio);

const options_container2 = ref(null); // 绑定滚动容器
const svgHeight = ref(0); // SVG 的高度，初始为 0

// 计算左侧选项
const leftItems = computed(() => {
  return questionList.value.map(item => ({ id: item.id, content: item.left }));
});

// 计算右侧选项（打乱控制）
const rightItems = computed(() => {
  const items = questionList.value.map(item => ({ id: item.id, content: item.right }));
  return isShuffled.value ? [...items].sort(() => Math.random() - 0.5) : items;
});

// 选项打乱控制方法
const shuffleOptions = (shuffle: boolean) => {
  isShuffled.value = shuffle;
};

// 绑定元素
const setLeftRef = (id: number, el: Element | ComponentPublicInstance | null) => {
  if (el instanceof HTMLElement) {
    leftRefs.value[id] = el;
  }
};

const setRightRef = (item: { id?: number }, el: Element | ComponentPublicInstance | null) => {
  if (item?.id !== undefined && el instanceof HTMLElement) {
    rightRefs.value[item?.id] = el;
  }
};

// 处理点击
const handleLeftClick = (leftId: number) => {
  if (selectedRight.value !== null) {
    createLine(leftId, selectedRight.value);
    selectedRight.value = null;
  } else {
    selectedLeft.value = leftId;
  }
};

const handleRightClick = (rightId: number) => {
  if (selectedLeft.value !== null) {
    createLine(selectedLeft.value, rightId);
    selectedLeft.value = null;
  } else {
    selectedRight.value = rightId;
  }
};

// 创建连线（先清除旧连线，再创建新连线）
const createLine = (leftId: number, rightId: number) => {
  lines.value = lines.value.filter(line => line.leftId !== leftId && line.rightId !== rightId);
  const isCorrect = leftId === rightId;
  lines.value.push({ leftId, rightId, isCorrect, x1: 0, y1: 0, x2: 0, y2: 0 });

  if (audioEnabled.value) {
    if (isCorrect) {
      successSound.currentTime = 0;
      successSound.play();
    } else {
      failureSound.currentTime = 0;
      failureSound.play();
    }
  }

  nextTick(() => {
    updateLinePositions();
    checkGameEnd(); // 每次连线后检查游戏是否完成
  });
};

// 计算选项样式
const getOptionStyle = (id: number, side: 'left' | 'right') => {
  const line = lines.value.find(l => l[`${side}Id`] === id);
  const isSelected =
    (side === 'left' && selectedLeft.value === id) ||
    (side === 'right' && selectedRight.value === id);
  const isCorrect = line?.isCorrect ?? false;

  return {
    backgroundColor: line ? (isCorrect ? '#ACE2FF' : 'red') : '#EFEFEF',
    boxShadow: isSelected ? '0 0 10px rgba(0, 0, 0, 0.5)' : 'none',
    position: 'relative',
  };
};

// 更新连线位置
const updateLinePositions = () => {
  if (!svg.value) return;
  const svgRect = svg.value.getBoundingClientRect();

  lines.value.forEach(line => {
    const leftEl = leftRefs.value[line.leftId];
    const rightEl = rightRefs.value[line.rightId];
    if (leftEl && rightEl) {
      const leftRect = leftEl.getBoundingClientRect();
      const rightRect = rightEl.getBoundingClientRect();

      line.x1 = leftRect.right - svgRect.left;
      line.y1 = leftRect.top + leftRect.height / 2 - svgRect.top;
      line.x2 = rightRect.left - svgRect.left;
      line.y2 = rightRect.top + rightRect.height / 2 - svgRect.top;

    }
  });
};

// **显示答案**
const showAnswer = () => {
  lines.value = questionList.value.map(q => ({
    leftId: q.id,
    rightId: q.id, // 正确答案
    isCorrect: true,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  }));
  nextTick(updateLinePositions);
};

// 重置游戏
const resetGame = () => {
  lines.value = [];
  gameCompleted.value = false;
  if (isShuffled.value) {
    isShuffled.value = false;
    nextTick(() => {
      isShuffled.value = true;
    });
  }
};

// 检测游戏是否完成
const checkGameEnd = () => {
  if (
    lines.value.length === questionList.value.length &&
    lines.value.every(line => line.isCorrect)
  ) {
    gameCompleted.value = true; // 显示通关页面
    if (audioEnabled.value) {
      challengeSuccessSound.currentTime = 0;
      challengeSuccessSound.play();
    }
  }
};

//退出
const back = () => {
  console.log('退出游戏');
  resetGame();
};

// 生命周期
onMounted(() => {
  svgHeight.value = options_container2.value.scrollHeight; //动态调整svg高度
  window.addEventListener('resize', updateLinePositions);
  updateLinePositions();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateLinePositions);
});

defineExpose({ shuffleOptions, resetGame, showAnswer, questionList, startColor });
</script>

<style scoped>
.left {
  display: block;
}

.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  padding: 28px;
  box-sizing: border-box;
}

.options-container {
  position: relative;
  width: 100%;
  height: calc(100% - 6vw);
  padding: 8vw 8.9vw;
  padding: 8vw 3.9vw 8vw 7.9vw;
  box-sizing: border-box;
  background-color: white;
  border-radius: 15px;
}

.options-container2 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  /* 让内容从顶部开始排列 */
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
  position: relative;
  scrollbar-width: none;
}

.option-pair {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 10px 0;
}

.side {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.option {
  padding: 10px 10px;
  border: 0.5px solid #a3a3a3;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s, box-shadow 0.3s;
  font-size: 3.0534vw;
}

.right-option {
  width: 31.2977vw;
  box-sizing: border-box;
}

.left-option {
  box-sizing: border-box;
  width: 7.3791vw;
  overflow-wrap: break-word;
  margin-left: 1vw;
}

.lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
}

.check-icon {
  width: 4vw;
  height: 4vw;
  position: absolute;
  right: 0vw;
}

.game-complete {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 3vw;
}

.game-complete button {
  background-color: #4caf50;
  color: white;
  padding: 1.5vw 2.5vw;
  font-size: 2vw;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 20px;
}
</style>
