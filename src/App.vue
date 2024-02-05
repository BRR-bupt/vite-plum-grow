<script setup lang="ts">
import gsap from 'gsap'
import data from './assets/data'
const WIDTH = window.screen.width
const HEIGHT = window.screen.height
const LENGTH = 1
const DEEPTH_MIN = 4
const DEEPTH_MAX = 100
const RATIO_THIS = 0.1
const RATIO_LEFT_RIGHT = 0.45
const NODE_MAX_ON_SINGELDEEPTH = 15
interface Point {
  x: number
  y: number
}
interface Branch {
  length: number
  angel: number
  startPoint: Point
}
const initalPoint: Point = {
  x: WIDTH * 3 / 4,
  y: HEIGHT,
}
const initalBranch: Branch = {
  length: LENGTH,
  angel: -0.1,
  startPoint: initalPoint,
}

const initalBranch2: Branch = {
  length: LENGTH,
  angel: (Math.PI / 2) - 0.8,
  startPoint: {
    x: 0,
    y: HEIGHT * 2 / 3,
  },
}

const initalBranch3: Branch = {
  length: LENGTH,
  angel: Math.PI - 0.2,
  startPoint: {
    x: WIDTH * 2 / 3,
    y: 0,
  },
}

const initalBranch4: Branch = {
  length: LENGTH,
  angel: Math.PI * 3 / 2,
  startPoint: {
    x: WIDTH,
    y: HEIGHT * 2 / 3,
  },
}

const refCanvas = ref<HTMLCanvasElement>()

const ctx = computed(() => {
  return refCanvas.value!.getContext('2d')!
})

function getEndPoint(b: Branch): Point {
  const x = b.startPoint.x + b.length * Math.sin(b.angel)
  const y = b.startPoint.y - b.length * Math.cos(b.angel)

  return {
    x,
    y,
  }
}

function drawBranch(b: Branch, endPoint: Point) {
  ctx.value.beginPath()
  ctx.value.moveTo(b.startPoint.x, b.startPoint.y)
  ctx.value.lineTo(endPoint.x, endPoint.y)
  ctx.value.stroke()
}

const pendingTasks: Function[] = []

const nodes: any[] = []

for (let i = 0; i < 4; i++)
  nodes.push(new Array(DEEPTH_MAX + 1).fill(0))

function step(fatherBranch: Branch, deepth: number, count: number, id: number) {
  const endPoint = getEndPoint(fatherBranch)
  drawBranch(fatherBranch, endPoint)
  const thisBranch: Branch = {
    length: LENGTH + Math.random() * LENGTH,
    angel: fatherBranch.angel,
    startPoint: endPoint,
  }
  const leftChildBranch: Branch = {
    length: LENGTH + Math.random() * LENGTH,
    angel: fatherBranch.angel - Math.PI / 10 + Math.random() * 0.2,
    startPoint: endPoint,
  }
  const rightChildBranch: Branch = {
    length: LENGTH + Math.random() * LENGTH,
    angel: fatherBranch.angel + Math.PI / 10 - Math.random() * 0.2,
    startPoint: endPoint,
  }
  if (deepth > DEEPTH_MAX)
    return

  if (count % 4 !== 0) {
    pendingTasks.push(() => step(thisBranch, deepth, count + 1, id))
    return
  }
  if (nodes[id][deepth] > NODE_MAX_ON_SINGELDEEPTH) {
    console.log('max')
    return
  }

  if (Math.random() < RATIO_THIS) {
    nodes[id][deepth] += 1
    pendingTasks.push(() => step(thisBranch, deepth + 1, count + 1, id))
  }

  if (Math.random() < 0.5) {
    if (Math.random() < RATIO_LEFT_RIGHT || deepth < DEEPTH_MIN) {
      nodes[id][deepth] += 1
      pendingTasks.push(() => step(leftChildBranch, deepth + 1, count + 1, id))
    }

    if (Math.random() < RATIO_LEFT_RIGHT || deepth < DEEPTH_MIN) {
      nodes[id][deepth] += 1
      pendingTasks.push(() => step(rightChildBranch, deepth + 1, count + 1, id))
    }
  }
  else {
    if (Math.random() < RATIO_LEFT_RIGHT || deepth < DEEPTH_MIN) {
      nodes[id][deepth] += 1
      pendingTasks.push(() => step(rightChildBranch, deepth + 1, count + 1, id))
    }
    if (Math.random() < RATIO_LEFT_RIGHT || deepth < DEEPTH_MIN) {
      nodes[id][deepth] += 1
      pendingTasks.push(() => step(leftChildBranch, deepth + 1, count + 1, id))
    }
  }
}

function frame() {
  const tasks = [...pendingTasks]
  pendingTasks.length = 0
  tasks.forEach(fn => fn())
}

let frameCount = 0
function startFrame() {
  requestAnimationFrame(() => {
    frameCount += 1
    if (frameCount % 6 === 0)
      frame()
    startFrame()
  })
}

function initCtx() {
  ctx.value.lineWidth = 0.5
  ctx.value.strokeStyle = '#fff5'
}

onMounted(() => {
  initCtx()
  step(initalBranch3, 0, 0, 2)
  setTimeout(()=>{
    step(initalBranch2, 0, 0, 1)
  }, 1000)
  setTimeout(()=>{
    step(initalBranch, 0, 0, 0)
  }, 2000)
  
  // step(initalBranch3, 0, 0, 2)
  // step(initalBranch4, 0, 0, 3)
  startFrame()
  const tl1 = gsap.timeline()
  tl1
    .from('#title', {
      yPercent: 100,
      duration: 1.4,
      ease: 'power4.out',
    })
    .from('.line', {
      yPercent: 100,
      duration: 1.4,
      stagger: 1.4,
      ease: 'power4.out',
    })
})
</script>

<template>
  <div>
    <canvas
      ref="refCanvas"
      class="plum"
      :width="WIDTH"
      :height="HEIGHT"
      bg-hex-121212
    />
    <div text-white px-8 py-14>
      <div text-4xl mb-4 overflow-hidden>
        <div id="title">
          雨巷
        </div>
      </div>
      <div text-2xl>
        <div overflow-hidden v-for="(item, index) in data" :key="index">
          <div class="line">
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.plum {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
