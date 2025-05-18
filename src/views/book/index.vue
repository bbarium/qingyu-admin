<template>
  <el-row>
    <el-col :xs="24" :sm="18">
      <div class="legend">
        <el-tag
          v-for="item in legends"
          :key="item.name"
          :type="item.type"
          effect="dark"
          size="large"
        >
          {{ item.name }}
        </el-tag>
        <el-check-tag>可预定</el-check-tag>
      </div>

      <div class="left-main">
        <el-radio-group
          v-model="selectDate"
          :size="isMinScreen ? 'small' : 'large'"
        >
          <el-radio-button
            v-for="item in nextThreeDays"
            :label="item.short"
            :value="item.long"
            class="date-radio-button"
          ></el-radio-button>
        </el-radio-group>
        <el-table
          class="my_table"
          :data="tableData"
          style="width: 100%"
          :row-class-name="getRowClassName"
        >
          <el-table-column fixed prop="timeValue" label="时间" width="110">
          </el-table-column>
          <el-table-column
            v-for="(column, index) in colNames"
            :label="column"
            :key="index"
            :prop="column"
            :highlight-current-row="true"
            width="130"
          >
            <template #default="scope">
              <div>
                <el-check-tag
                  v-if="scope.row[column].price"
                  class="el-check-box"
                  :checked="scope.row[column].checked"
                  @change="onTagChange(scope.row[column])"
                  :class="{ 'selected-tag': scope.row[column].checked }"
                >
                  {{ formatPrice(scope.row[column].price) }}
                </el-check-tag>
                <el-tag
                  v-else
                  class="el-check-box"
                  type="info"
                  effect="dark"
                  size="large"
                >
                  不可预定
                </el-tag>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
    <el-col :xs="24" :sm="6">
      <div class="book_info">
        <h3>场次信息</h3>
        <div class="book_site_list">
          <div class="book-site-box" v-for="item in showSeletSite">
            <div>{{ item.site }}</div>
            <div class="flex_box" v-for="data in item.data">
              <div>{{ data.time_value }}</div>
              <div style="color: #a23333">
                {{ formatPrice(data.price) }}
              </div>
            </div>
            <div>{{ selectDate }} 共{{ item.data.length }}场</div>
          </div>
        </div>
        <div class="book_total">
          <div class="flex_box">
            <h3>合计</h3>
            <h3 style="color: #a23333">{{ formatPrice(showTotal) }}</h3>
          </div>
          <el-button
            @click="submit(ruleFormRef)"
            class="settlement-button"
            style="width: 100%"
            >结算</el-button
          >
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { addOrder, wxPay } from '@/api/order'
import { getSiteReserve } from '@/api/site'
import { useEnumStore } from '@/stores/enum.ts'
import { ElMessage } from 'element-plus'
import { minScreenMaxWidth } from '@/config/app'
import { useMediaQuery } from '@vueuse/core'
import dayjs from 'dayjs'
import type { FormInstance, FormRules } from 'element-plus'

const isMinScreen = useMediaQuery(`(max-width: ${minScreenMaxWidth}px)`)

const timeEnums = useEnumStore().Enum.time_enum // 时间枚举
const colNames = ref([] as any)
const tableData = ref<any>([])
const seletSite = ref<any>([])
const showSeletSite = ref<any>([])
const showTotal = ref(0)
const nextThreeDays = ref([] as any)
const selectDate = ref('') //选择的日期

const legends = [
  { name: '不可预定', type: 'info' },
  { name: '已选择', type: 'success' }, // 修改颜色为深绿色
]

const ruleFormRef = ref<FormInstance>()
let form = reactive<RuleForm>({
  name: '',
  phone: '',
  remark: '',
})

interface RuleForm {
  name: string
  phone: string
  remark: string
}

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: '请输入预定人姓名', trigger: 'blur' },
    { min: 1, max: 15, message: '最长输入15个字符', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { min: 11, max: 11, message: '电话格式不正确', trigger: 'blur' },
  ],
})

// 获取未来三天日期
const initThreeDays = () => {
  let today = dayjs()
  for (let i = 0; i < 3; i++) {
    let futureDate = today.add(i, 'day')
    nextThreeDays.value.push({
      short: futureDate.format('MM-DD'),
      long: futureDate.format('YYYY-MM-DD'),
    })
  }
  selectDate.value = nextThreeDays.value[0].long
}

onMounted(() => {
  seletSite.value = []
  initThreeDays()
})

watch(
  () => selectDate.value,
  () => {
    updateData(selectDate.value)
    seletSite.value = []
    setShowSeletSite()
  }
)

const onTagChange = (item: any) => {
  item.checked = !item.checked
  if (item.checked) {
    seletSite.value.push(item)
  } else {
    seletSite.value.splice(seletSite.value.indexOf(item), 1)
  }
  setShowSeletSite()
}

// 设置侧栏选中的场地信息
const setShowSeletSite = () => {
  showSeletSite.value = []
  showTotal.value = 0
  colNames.value.forEach((item: any) => {
    let tmp = { site: item, data: [] as any }
    seletSite.value.forEach((element: any) => {
      const siteName = element.site_name

      if (siteName == item) {
        tmp.data.push({ time_value: element.time_value, price: element.price })
        showTotal.value += element.price
      }
    })
    if (tmp.data.length > 0) showSeletSite.value.push(tmp)
  })
}

// 刷新数据
const updateData = (date: any) => {
  const sites = Array.from({ length: 14 }, (_, i) => `场地${i + 1}`)
  const times = [
    ...Array.from({ length: 4 }, (_, i) => `08:${i * 2}0`), // 8:00 - 12:00
    ...Array.from({ length: 8 }, (_, i) => `14:${i * 2}0`), // 14:00 - 22:00
  ]

  colNames.value = sites
  tableData.value = []

  times.forEach((time) => {
    const row = { timeValue: time }
    sites.forEach((site) => {
      row[site] = {
        price: 30,
        checked: false,
        site_name: site,
        time_value: time,
      }
    })
    tableData.value.push(row)
  })
}

// 价格格式化
const formatPrice = (price: number) => {
  return '￥' + price.toFixed(2)
}

const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl || seletSite.value.length == 0) return
  await formEl.validate((valid) => {
    if (valid) {
      var data = reactive<any>({
        user_name: 'admin1',
        user_phone: '138****6663',
        remark: form.remark,
        shop_id: 1,
        gmt_site_use: selectDate,
        reserve_name: form.name,
        reserve_phone: form.phone,
        site_detail: [],
      })

      colNames.value.forEach((value: any) => {
        let tmpSite = { site_id: 0, time_enum: [] as any }
        seletSite.value.forEach((element: any) => {
          if (element.site_name == value) {
            tmpSite.site_id = element.site_id
            tmpSite.time_enum.push(element.time_enum)
          }
        })
        if (tmpSite.time_enum.length > 0) data.site_detail.push(tmpSite)
      })

      addOrder(data).then((res: any) => {
        if (res.data.code == 200) {
          ElMessage({
            type: 'success',
            message: '提交成功',
          })

          // 顺便模拟支付
          let order = res.data.data.order
          wxPay({ order_no: order })

          formEl.resetFields()
          seletSite.value = []
          setShowSeletSite()
          updateData(selectDate.value)
        } else {
          ElMessage({
            type: 'error',
            message: '提交失败',
          })
        }
      })
    } else {
      // console.log('error submit!', fields)
    }
  })
}

// 设置表格行的样式
const getRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (rowIndex % 2 === 0) {
    return 'even-row'
  } else {
    return 'odd-row'
  }
}
</script>

<style lang="scss">
.legend {
  display: flex;
  margin: 20px 10px;
  grid-gap: 0.5rem;
  gap: 0.5rem;
}

.el-check-box {
  width: 90px;
  height: 48px;
  line-height: 35px;
  text-align: center;
}

.left-main {
  margin: 0 10px;
  .my_table {
    padding: 10px 0;
    --el-table-border-color: '#FFFFFF' !important;
    --el-table-row-hover-bg-color: #fff;
    height: calc(100vh - 220px);
    border-collapse: collapse;
    th,
    td {
      border: 1px solid #ddd;
    }
  }
}

.book_info {
  background-color: #f6f6f6;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  height: calc(100vh - 110px);
  .book_site_list {
    overflow-y: auto;
    flex-grow: 1;
    .book-site-box {
      padding: 10px 20px;
      border-radius: 10px;
      font-size: 14px;
      background-color: #e6f0eb; // 修改选中的底色
      line-height: 2rem;
      margin-bottom: 10px;
    }
  }
  .book_total {
    margin-top: auto;
    padding: 10px;
  }
}

.flex_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

// 自定义深绿色样式
.el-tag--success {
  background-color: #006633 !important;
  border-color: #006633 !important;
}

// 自定义已选择样式
.selected-tag {
  background-color: #006633 !important;
  color: #fff !important;
}

// 自定义日期按钮样式
.date-radio-button {
  background-color: #006633 !important; /* 深绿色背景 */
  color: #ffffff !important; /* 文字颜色为白色 */
  border-color: #006633 !important; /* 边框颜色也为深绿色 */
}

.date-radio-button:hover {
  background-color: #005a2e !important; /* 鼠标悬停时的深绿色背景 */
  border-color: #005a2e !important; /* 鼠标悬停时的边框颜色 */
}

// 自定义选中的日期按钮样式
.selected-date {
  background-color: #005a2e !important; /* 选中状态的深绿色背景 */
  border-color: #005a2e !important; /* 选中状态的边框颜色 */
}

// 自定义表格行样式
.even-row {
  background-color: #f0f9eb;
}

.odd-row {
  background-color: #fff;
}

// 自定义结算按钮样式
.settlement-button {
  background-color: #006633 !important; /* 深绿色背景 */
  border-color: #006633 !important; /* 边框颜色也为深绿色 */
  color: #ffffff !important; /* 文字颜色为白色 */
}

.settlement-button:hover {
  background-color: #005a2e !important; /* 鼠标悬停时的深绿色背景 */
  border-color: #005a2e !important; /* 鼠标悬停时的边框颜色 */
}
</style>