<template>
  <div class="home-container">
    <!-- 左侧：校区选择 -->
    <div class="campus-section">
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

    <!-- 右侧：通知公告 -->
    <div class="notice-section">
      <h2>通知公告</h2>
      <ul class="notice-list">
        <li v-for="notice in notices" :key="notice.title" @click="showNotice(notice)">
          📢 {{ notice.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
const campuses = [
  { name: '东校园', image: new URL('@/assets/east.jpg', import.meta.url).href },
  { name: '南校园', image: new URL('@/assets/south.png', import.meta.url).href },
  { name: '北校园', image: new URL('@/assets/north.jpg', import.meta.url).href },
  { name: '珠海校区', image: new URL('@/assets/zhuhai.jpg', import.meta.url).href },
  { name: '深圳校区', image: new URL('@/assets/shenzhen.jpg', import.meta.url).href },
]

const selectCampus = (name: string) => {
  ElMessage.success(`您选择了：${name}`)
  router.push('/book')
}

const notices = [
  {
    title: '关于端午节假期安排的通知',
    content: '端午节放假时间为6月8日至6月10日，请大家提前安排好学习和生活。',
  },
  {
    title: '体育馆设备维护公告',
    content: '南校区体育馆将于6月5日进行设备维护，期间暂停开放。',
  },
  {
    title: '新增羽毛球场馆预约功能',
    content: '现在可通过系统预约珠海和深圳校区的羽毛球场地，欢迎使用。',
  },
]

const showNotice = (notice: { title: string; content: string }) => {
  ElMessageBox.alert(notice.content, notice.title, {
    confirmButtonText: '我知道了',
    type: 'info',
  })
}
</script>

<style scoped>
.home-container {
  display: flex;
  gap: 40px;
  padding: 20px;
  flex-wrap: wrap;
}

/* 左侧校区 */
.campus-section {
  flex: 2;
  min-width: 300px;
}

.campus-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.campus-card {
  width: 260px;
  height: 220px;
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
  height: 140px;
  object-fit: cover;
}

.campus-name {
  padding: 14px;
  font-size: 18px;  
  font-weight: bold;
  background-color: #f9f9f9;
  text-align: center;
}

/* 右侧公告 */
.notice-section {
  flex: 1;
  min-width: 260px;
  background: #fefefe;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.notice-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notice-list li {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.notice-list li:hover {
  background-color: #f0f8ff;
}
</style>
