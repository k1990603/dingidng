<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <el-input v-model="query.title" clearable size="small" placeholder="输入标题名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
    <el-select v-model="query.status" clearable size="small" placeholder="状态" class="filter-item" style="width: 90px" @change="crud.toQuery">
      <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <rrOperation />
  </div>
</template>

<script>
import { header } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
export default {
  components: { rrOperation },
  mixins: [header()],
  props: {
    // dict: {
    //   type: Object,
    //   required: true
    // },
    permission: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      statusList: [
        { value: 0, label: '未开始' },
        { value: 1, label: '进行中' },
        { value: 2, label: '已结束' }
      ]
    }
  }
}
</script>
