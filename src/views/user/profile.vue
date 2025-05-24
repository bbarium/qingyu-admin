<template>
  <div class="profile-container">
    <h2 class="page-title">个人主页</h2>
    
    <div class="content-wrapper">
      <!-- 左栏 - 个人信息 -->
      <div class="left-column">
        <el-card class="info-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>个人信息</span>
            </div>
          </template>

          <el-descriptions :column="1" border>
            <el-descriptions-item label="姓名">{{ userInfo.name || '-' }}</el-descriptions-item>
            <el-descriptions-item label="学号">{{ userInfo.studentId || '-' }}</el-descriptions-item>
            <el-descriptions-item label="NETID">{{ userInfo.netId || '-' }}</el-descriptions-item>
            <el-descriptions-item label="身份">{{ userRoleMap[userInfo.role] || '-' }}</el-descriptions-item>
            <el-descriptions-item label="经费">
              <span class="highlight">¥ {{ userInfo.fund?.toFixed(2) || '0.00' }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="信用评级">
              <div class="credit-display">
                <span class="credit-value" :class="getCreditClass(userInfo.credit)">
                  {{ userInfo.credit ?? 0 }}
                </span>
                <span class="credit-max">/ 100</span>
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </div>

      <!-- 右栏 - 预约管理 -->
      <div class="right-column">
        <el-card class="reservation-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>我的预约</span>
              <el-button type="primary" size="small" @click="handleNewReservation">新建预约</el-button>
            </div>
          </template>

          <el-table :data="reservations" style="width: 100%" empty-text="暂无预约记录">
            <el-table-column prop="date" label="日期" width="120"/>
            <el-table-column prop="time" label="时间段" width="150"/>
            <el-table-column prop="facility" label="设备/场地"/>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="statusTagMap[row.status]">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <el-card class="queue-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>我的排队情况</span>
            </div>
          </template>

          <el-table :data="queues" style="width: 100%" empty-text="暂无排队记录">
            <el-table-column prop="position" label="当前位次" width="100"/>
            <el-table-column prop="facility" label="设备/场地"/>
            <el-table-column prop="waitTime" label="预计等待时间"/>
          </el-table>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface UserInfo {
  name: string
  studentId: string
  netId: string
  role: number
  fund: number
  credit: number
}

interface Reservation {
  date: string
  time: string
  facility: string
  status: 'pending' | 'confirmed' | 'canceled'
}

const userInfo = ref<UserInfo>({
  name: '张三',
  studentId: '20230001',
  netId: 'zhangsan',
  role: 1,
  fund: 1500.5,
  credit: 100  // 测试信用值
})

const reservations = ref<Reservation[]>([
  {
    date: '2025-05-24',
    time: '14:00-16:00',
    facility: '东校',
    status: 'confirmed'
  }
])

const queues = ref<any[]>([])

const userRoleMap: Record<number, string> = {
  0: '管理员',
  1: '普通用户',
  2: 'VIP用户'
}

const statusTagMap: Record<string, string> = {
  pending: 'warning',
  confirmed: 'success',
  canceled: 'danger'
}

const getCreditClass = (credit: number) => {
  if (credit >= 90) return 'excellent'
  if (credit >= 70) return 'good'
  if (credit >= 50) return 'medium'
  return 'poor'
}

const handleNewReservation = () => {
  console.log('打开预约对话框')
}
</script>

<style scoped>
.profile-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  margin-bottom: 24px;
  color: #303133;
}

.content-wrapper {
  display: flex;
  gap: 24px;
}

.left-column {
  flex: 1;
  min-width: 400px;
}

.right-column {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.highlight {
  color: #409EFF;
  font-weight: 500;
}

.credit-display {
  display: flex;
  align-items: baseline;
}

.credit-value {
  font-size: 18px;
  font-weight: 600;
  margin-right: 4px;
  
  &.excellent { color: #67C23A; }
  &.good { color: #E6A23C; }
  &.medium { color: #909399; }
  &.poor { color: #F56C6C; }
}

.credit-max {
  font-size: 12px;
  color: #C0C4CC;
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }
  
  .left-column,
  .right-column {
    min-width: auto;
  }
}
</style>