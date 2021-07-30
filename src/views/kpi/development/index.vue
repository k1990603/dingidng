<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :permission="permission" />
      <crudOperation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="title" label="标题">
        <template slot-scope="scope">
          <a href="javascript:;" class="detailColor" @click="toPerformance(scope)">{{ scope.row.title }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==0" type="info">未开始</el-tag>
          <el-tag v-if="scope.row.status==1" type="danger">进行中</el-tag>
          <el-tag v-if="scope.row.status==2" type="success">已结束</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="countNum" label="考核人数" />
      <el-table-column prop="openStatus" label="生效">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.openStatus"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="switchChange(scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column prop="startTime" label="开始日期" />
      <el-table-column prop="endTime" label="结束日期" />
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','dev:edit','dev:del'])"
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
    <!--表单渲染-->
    <eForm />
  </div>
</template>

<script>
import crudDev from '@/api/kpi/development'
import eHeader from './module/header'
import eForm from './module/form'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
export default {
  name: 'Dev',
  components: { eHeader, eForm, crudOperation, pagination, udOperation },
  cruds() {
    return CRUD({
      title: 'kpi拟定',
      url: 'ding/kpi/create/page',
      // sort: ['DevSort,asc', 'id,desc'],
      crudMethod: { ...crudDev }
    })
  },
  mixins: [presenter()],
  // 数据字典
  // dicts: ['job_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'dev:add'],
        edit: ['admin', 'dev:edit'],
        del: ['admin', 'dev:del']
      }
    }
  },
  methods: {
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      if (crud.form.id) {
        const times = []
        times[0] = crud.form.startTime
        times[1] = crud.form.endTime
        this.$set(crud.form, 'times', times)
      }
    },
    switchChange(data) {
      console.log(data.openStatus, 'openStatus')
      const msg = data.openStatus ? '生效' : '失效'
      this.$confirm(`确认操作${msg}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!data.openStatus) {
          this.toClose(data)
        } else {
          this.toAction(data)
        }
      }).catch(() => {
        data.openStatus = !data.openStatus
      })
    },
    toPerformance(scope) {
      this.$router.push({
        path: '/performance/exame',
        query: {
          id: scope.row.id,
          key: Date.now()
        }
      })
    },
    toAction(data) {
      crudDev.toAction(data.id).then((res) => {
        this.crud.notify('操作成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.crud.refresh()
      })
        .catch(() => {
          data.openStatus = !data.openStatus
        })
    },
    toClose(data) {
      crudDev.toClose(data.id).then((res) => {
        this.crud.notify('操作成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.crud.refresh()
      })
        .catch(() => {
          data.openStatus = !data.openStatus
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
  .detailColor {
  color: #1890ff;
}
</style>
