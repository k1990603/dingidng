<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="500px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-form-item
        label="标题"
        prop="title"
        placeholder="请输入标题"
      >
        <el-input
          v-model="form.title"
          style="width: 370px;"
        />
      </el-form-item>
      <el-form-item
        label="时间"
        prop="times"
      >
        <date-range-picker v-model="form.times" class="date-item" @change="timeChange" />
      </el-form-item>
      <!-- <el-form-item
        v-if="form.pid !== 0"
        label="状态"
        prop="enabled"
      >
        <el-radio
          v-for="item in jobStatus"
          :key="item.id"
          v-model="form.enabled"
          :label="item.value === 'true'"
        >
          {{ item.label }}
        </el-radio>
      </el-form-item> -->
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="text"
        @click="crud.cancelCU"
      >
        取消
      </el-button>
      <el-button
        :loading="crud.status.cu === 2"
        type="primary"
        @click="crud.submitCU"
      >
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { form } from '@crud/crud'
import DateRangePicker from '@/components/DateRangePicker'

const defaultForm = {
  id: null,
  title: '',
  startTime: null,
  endTime: null,
  times: []
  // jobSort: 999,
  // enabled: true
}
export default {
  components: { DateRangePicker },
  mixins: [form(defaultForm)],
  // props: {
  //   jobStatus: {
  //     type: Array,
  //     required: true
  //   }
  // },
  data() {
    return {
      rules: {
        title: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    timeChange(value) {
      if (value) {
        this.form.startTime = value[0]
        this.form.endTime = value[1]
      } else {
        this.form.startTime = null
        this.form.endTime = null
      }
      // console.log(value, 111111, this.form)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
