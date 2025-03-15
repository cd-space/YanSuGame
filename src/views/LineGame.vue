<template>
  <div class="container">
    <div class="options-container">
      <button @click="resetGame">重置</button>
      <!-- 左侧选项 -->
      <div class="side left">
        <div
          v-for="item in leftItems"
          :key="item.id"
          class="option"
          :style="getOptionStyle(item.id, 'left')"
          @click="handleLeftClick(item.id)"
          :ref="(el) => setLeftRef(item.id, el)"
        >
          {{ item.content }}
        </div>
      </div>

      <!-- 右侧选项 -->
      <div class="side right">
        <div
          v-for="item in rightItems"
          :key="item.id"
          class="option"
          :style="getOptionStyle(item.id, 'right')"
          @click="handleRightClick(item.id)"
          :ref="(el) => setRightRef(item.id, el)"
        >
          {{ item.content }}
        </div>
      </div>

      <!-- 连线画布 -->
      <svg class="lines" ref="svg">
        <line
          v-for="(line, index) in lines"
          :key="index"
          :x1="line.x1"
          :y1="line.y1"
          :x2="line.x2"
          :y2="line.y2"
          :stroke="line.isCorrect ? color : 'red'"
          stroke-width="2"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

// 模拟数据
const questionList = [
  { id: 0, left: 'Apple', right: '苹果' },
  { id: 1, left: 'Banana', right: '香蕉' },
  { id: 2, left: 'Orange', right: '橙子' }
]

// 控制选项是否打乱
const isShuffled = ref(true) // 默认打乱
const lines = ref<Array<{ leftId: number, rightId: number, isCorrect: boolean, x1: number, y1: number, x2: number, y2: number }>>([])
const leftRefs = ref<Record<number, HTMLElement>>({})
const rightRefs = ref<Record<number, HTMLElement>>({})
const selectedLeft = ref<number | null>(null)
const selectedRight = ref<number | null>(null)
const svg = ref<SVGSVGElement | null>(null)
const color = ref('#ACE2FF')

// 计算左侧选项
const leftItems = computed(() => 
  questionList.map(item => ({ id: item.id, content: item.left }))
)

// 计算右侧选项（打乱控制）
const rightItems = computed(() => {
  const items = questionList.map(item => ({ id: item.id, content: item.right }))
  return isShuffled.value ? [...items].sort(() => Math.random() - 0.5) : items
})

// 选项打乱控制方法
const shuffleOptions = (shuffle: boolean) => {
  isShuffled.value = shuffle
}

// 绑定元素
const setLeftRef = (id: number, el: HTMLElement) => {
  if (el) leftRefs.value[id] = el
}
const setRightRef = (id: number, el: HTMLElement) => {
  if (el) rightRefs.value[id] = el
}

// 处理点击
const handleLeftClick = (leftId: number) => {
  if (selectedRight.value !== null) {
    createLine(leftId, selectedRight.value)
    selectedRight.value = null
  } else {
    selectedLeft.value = leftId
  }
}

const handleRightClick = (rightId: number) => {
  if (selectedLeft.value !== null) {
    createLine(selectedLeft.value, rightId)
    selectedLeft.value = null
  } else {
    selectedRight.value = rightId
  }
}

// 创建连线（先清除旧连线，再创建新连线）
const createLine = (leftId: number, rightId: number) => {
  lines.value = lines.value.filter(line => line.leftId !== leftId && line.rightId !== rightId)

  const isCorrect = leftId === rightId
  lines.value.push({ leftId, rightId, isCorrect, x1: 0, y1: 0, x2: 0, y2: 0 })
  nextTick(updateLinePositions)
}

// 计算选项样式
const getOptionStyle = (id: number, side: 'left' | 'right') => {
  const line = lines.value.find(l => l[`${side}Id`] === id)
  const isSelected = (side === 'left' && selectedLeft.value === id) || (side === 'right' && selectedRight.value === id)

  return {
    backgroundColor: line ? (line.isCorrect ? color.value : 'red') : color.value,
    boxShadow: isSelected ? '0 0 10px rgba(0, 0, 0, 0.5)' : 'none'
  }
}

// 更新连线位置
const updateLinePositions = () => {
  if (!svg.value) return
  const svgRect = svg.value.getBoundingClientRect()

  lines.value.forEach(line => {
    const leftEl = leftRefs.value[line.leftId]
    const rightEl = rightRefs.value[line.rightId]
    if (leftEl && rightEl) {
      const leftRect = leftEl.getBoundingClientRect()
      const rightRect = rightEl.getBoundingClientRect()
      
      line.x1 = leftRect.right - svgRect.left
      line.y1 = leftRect.top + leftRect.height / 2 - svgRect.top
      line.x2 = rightRect.left - svgRect.left
      line.y2 = rightRect.top + rightRect.height / 2 - svgRect.top
    }
  })
}

// **重置游戏**
const resetGame = () => {
  lines.value = [] // 清空所有连线
  isShuffled.value = false // 先设置为 false
  nextTick(() => {
    isShuffled.value = true // 重新设置为 true，触发重新计算
  })
}


// 生命周期
onMounted(() => {
  window.addEventListener('resize', updateLinePositions)
  updateLinePositions()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateLinePositions)
})

// 暴露方法
defineExpose({ shuffleOptions, resetGame })
</script>



<style scoped>
.container {
  position: relative;
  padding: 20px;
}

.options-container {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.side {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.option {
  padding: 10px 20px;
  border: 2px solid #333;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
