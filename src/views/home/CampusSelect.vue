<template>
  <div class="campus-select-container">
    <h2>请选择您的校区</h2>
    <div class="campus-grid">
      <div
        class="campus-card"
        v-for="campus in campuses"
        :key="campus.name"
        @click="selectCampus(campus.name)"
      >
        <img :src="campus.image" alt="campus" />
        <div class="campus-name">{{ campus.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
const campuses = [
  {
    name: '东校园',
    image: new URL('@/assets/east.jpg', import.meta.url).href,
  },
  {
    name: '南校园',
    image: new URL('@/assets/south.png', import.meta.url).href,
  },
  {
    name: '北校园',
    image: new URL('@/assets/north.jpg', import.meta.url).href,
  },
]

const selectCampus = (name: string) => {
  ElMessage.success(`您选择了：${name}`)
  // 可跳转或记录选择
  // router.push('/book') 或 emit('selected', name)
}
</script>

<style scoped>
.campus-select-container {
  padding: 20px;
  text-align: center;
}

.campus-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
}

.campus-card {
  width: 200px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.campus-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.campus-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.campus-name {
  padding: 12px;
  font-weight: bold;
  background-color: #f9f9f9;
}
</style>
