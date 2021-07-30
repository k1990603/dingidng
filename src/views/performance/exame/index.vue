<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :depts="depts" :permission="permission" />
      <crudOperation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="deptName" align="center" label="考核人">
        <template slot-scope="scope">
          <a href="javascript:;" class="detailColor" @click="detailVisibleShow(scope)">{{ scope.row.username }}({{ scope.row.deptName }})</a>
        </template>
      </el-table-column>
      <el-table-column prop="kpiCreateName" align="center" label="KPI标题" />
      <el-table-column prop="isKpi" align="center" label="考核状态">
        <template slot-scope="scope">
          <!-- <el-tag :type="scope.row.isKpi?'success':'warning'">{{ scope.row.isKpi ? "是" : "否" }}</el-tag> -->
          <el-tag v-if="scope.row.status==0" type="info">未开始</el-tag>
          <el-tag v-if="scope.row.status==1" type="danger">进行中</el-tag>
          <el-tag v-if="scope.row.status==2" type="success">已结束</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="assessmentContent" align="center" label="考核内容"/> -->
      <el-table-column prop="jsFs" align="center" label="绩效分数" />
      <el-table-column prop="jsLevel" align="center" label="绩效等级" />
      <el-table-column prop="jsxs" align="center" label="绩效系数" />
      <el-table-column prop="createTime" align="center" label="创建日期" />
      <!--   编辑与删除   -->
      <el-table-column
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <!-- <el-button :disabled="disabledEdit" size="mini" type="primary" icon="el-icon-edit" @click="getDetail(scope.row.id)" /> -->
          <udOperation :data="scope.row" :permission="permission" />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
    <!--表单渲染-->
    <eForm :depts="depts" />
    <detail :detail-visible="detailVisible" :detail-id="detailId" :depts="depts" @cancel="cancel" />
  </div>
</template>

<script>
import crudTemplate from '@/api/kpi/performance'
// import { getDepts } from '@/api/kpi/other'
import eHeader from './module/header'
import eForm from './module/form'
import detail from './module/detail'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
export default {
  name: 'Template',
  components: { eHeader, eForm, crudOperation, pagination, udOperation, detail },
  cruds() {
    return CRUD({
      title: 'kpi模板',
      url: 'ding/kpi/create/detail',
      // sort: ['jobSort,asc', 'id,desc'],
      crudMethod: { ...crudTemplate }
    })
  },
  mixins: [presenter()],
  data() {
    return {
      detailVisible: false,
      detailId: null,
      permission: {
        edit: ['admin', 'exame:edit'],
        del: ['admin', 'exame:del']
      },
      depts: [],
      titleList: [],
      normalizer(node) {
        return {
          id: node.id,
          label: node.label,
          children: node.children
        }
      }
    }
  },
  created() {
    // let id = this.$route.query.id;
    // this.crud.params.kpiCreateId = id
  },
  mounted() {
    this.getdept()
    // console.log(crudTemplate.getDepts)
  },
  methods: {
    detailVisibleShow(scope) {
      this.detailId = scope.row.id
      this.detailVisible = true
    },
    cancel() {
      this.detailVisible = false
    },
    // getDepts,
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      if (crud.form.id) {
        this.getDetail(crud.form.id)
      }
    },
    [CRUD.HOOK.beforeRefresh](crud, form) {
      // let id = this.$route.query.id;
      // this.crud.params.kpiCreateId = id
      // this.getTitleAction(crud)
    },
    getTitleAction(crud) {
      const id = this.$route.query.id
      const params = {
        page: 0,
        size: 10000000
      }
      console.log(this.crud, 'crud')
      crudTemplate.getTitle(params)
        .then((res) => {
          this.titleList = res.content
          this.crud.page.kpiCreateId = id
        })
        .catch(() => {})
    },
    getDetail(id) {
      crudTemplate.detailTable(id).then((res) => {
        res.itemDtos.forEach((item, index) => {
          item.num = index + 1
        })
        this.$set(this.crud.form, 'itemDtos', res.itemDtos)
      })
        .catch(() => {})
    },
    // 获取弹窗内岗位数据
    getdept() {
      crudTemplate
        .getDepts()
        .then((res) => {
          this.depts = res
          console.log(this.depts, 'depts')
        })
        .catch(() => {})
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
