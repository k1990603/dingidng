<template>
  <el-drawer
    append-to-body
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible="detailVisible"
    title="详情"
    :size="sizePercent"
    direction="rtl"
  >
    <el-form
      ref="params"
      :model="params"
      :rules="rules"
      size="small"
      style="padding: 0 15px"
      label-width="80px"
    >
      <el-form-item label="考核部门" prop="deptName" class="half-form">
        <span>{{ dataTable.deptName }}</span>
      </el-form-item>
      <el-form-item label="考核人员" prop="username" class="half-form">
        <span>{{ dataTable.username }}</span>
      </el-form-item>
      <el-form-item label-width="0">
        <div class="tableKpi">
          <h2>考核指标</h2>
          <el-input
            v-model="params.indicatorsName"
            clearable
            size="small"
            placeholder="输入指标名称搜索"
            style="width: 200px"
            class="filter-item"
            @keyup.enter.native="getDetail()"
          />
          <el-select
            v-model="params.indicatorsType"
            filterable
            class="edit-input"
            clearable
            size="mini"
            placeholder="选择指标类型搜索"
            @keyup.enter.native="getDetail()"
          >
            <el-option
              v-for="(item, index) in dictDetailList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model="params.assessmentContent"
            clearable
            size="small"
            placeholder="输入考核内容搜索"
            style="width: 200px"
            class="filter-item"
            @keyup.enter.native="getDetail()"
          />
          <treeselect
            v-model="params.deptId"
            style="width: 130px;display: inline-block; vertical-align: bottom;"
            :options="depts"
            placeholder="选择审核部门搜索"
            :normalizer="normalizer"
          />
          <el-select
            v-model="params.userId"
            clearable
            filterable
            size="small"
            placeholder="选择用户"
            class="filter-item"
            style="width: 110px"
            @change="getDetail()"
          >
            <el-option
              v-for="item in userListTable"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            />
          </el-select>
          <el-input-number
            v-model="params.weight"
            clearable
            size="small"
            placeholder="输入权重搜索"
            style="width: 100px;text-align: center"
            class="filter-item"
            @keyup.enter.native="getDetail()"
          />
          <el-button
            size="mini"
            plain
            type="info"
            icon="el-icon-search"
            @click="getDetail()"
          >搜索</el-button>
          <el-button
            size="mini"
            icon="el-icon-refresh"
            @click="refresh()"
          >重置</el-button>
        </div>
        <!-- table -->
        <el-table
          ref="table"
          v-loading="loading"
          :data="dataTable.kpiDetailDtos"
          style="width: 100%"
        >
          <el-table-column prop="num" width="45" label="序号" />
          <el-table-column prop="indicatorsName" label="指标名称" />
          <el-table-column
            prop="indicatorsType"
            label="指标类型"
            align="center"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.indicatorsType"
                disabled
                filterable
                class="edit-input"
                clearable
                size="mini"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in dictDetailList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="deptName"
            label="考核部门"
            align="center"
            width="165"
          />
          <el-table-column prop="userName" label="考核人员" align="center" />
          <el-table-column
            prop="assessmentContent"
            width="115"
            label="考核内容"
          />
          <el-table-column prop="targetValue" label="目标值" />
          <el-table-column prop="weight" label="权重" />
          <el-table-column
            prop="isDesc"
            label="填写说明"
            width="45"
            align="center"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isDesc"
                disabled
                active-color="#409EFF"
                inactive-color="#F56C6C"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop=" isFj"
            label="上传附件"
            width="45"
            align="center"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isFj"
                disabled
                active-color="#409EFF"
                inactive-color="#F56C6C"
              />
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <!-- <pagination /> -->
      </el-form-item>
      <el-form-item label="总分" prop="totalScore">
        <span>{{ dataTable.totalScore }}</span>
      </el-form-item>
      <el-form-item label="状态" prop="isKpi">
        <el-radio
          v-for="(item, index) in assessmentStatus"
          :key="index"
          v-model="dataTable.isKpi"
          disabled
          :label="item.value"
        >
          {{ item.label }}
        </el-radio>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
import { getDeptId } from '@/api/kpi/template'
import { getDepts } from '@/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import crudTemplate from '@/api/kpi/template'

export default {
  components: { Treeselect },
  props: {
    depts: {
      type: Array,
      required: true
    },
    detailVisible: {
      type: Boolean,
      required: true
    },
    detailId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      dataTable: {},
      params: {
        indicatorsName: '',
        indicatorsType: '',
        assessmentContent: '',
        deptId: null,
        userId: null,
        weight: []
      },
      sizePercent: '80%',
      normalizer(node) {
        return {
          id: node.id,
          label: node.label,
          children: node.children
        }
      },
      loading: false,
      userList: [],
      userListTable: [],
      assessmentStatus: [
        { label: '参与考核', value: true },
        { label: '不参与考核', value: false }
      ],
      dictDetailList: [
        { label: '基础指标', value: '0' },
        { label: '重点指标', value: '1' },
        { label: '加分项', value: '2' },
        { label: '扣分项', value: '3' }
      ],
      selections: [],
      rules: {
        indicatorsName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        dictDetailId: [
          { required: true, message: '请选择指标', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    detailVisible(value) {
      if (value) {
        this.getDetail()
        this.getUserList()
      }
    }
  },
  methods: {
    getDepts,
    getDeptId,
    cancel() {
      this.$emit('cancel')
    },
    getDetail() {
      crudTemplate
        .detailTable(this.detailId, this.params)
        .then((res) => {
          console.log(res, 'res')
          this.dataTable = res
        })
        .catch(() => {})
    },
    refresh() {
      this.params.indicatorsName = ''
      this.params.indicatorsType = ''
      this.params.assessmentContent = ''
      this.params.deptId = ''
      this.params.userId = ''
      this.params.weight = []
      this.getDetail()
    },
    getUserList() {
      crudTemplate
        .getUsers()
        .then((res) => {
          this.userListTable = res
        })
        .catch(() => {})
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-table {
  overflow: visible;
}
::v-deep .el-table .cell {
  overflow: visible;
}
::v-deep .el-table__body-wrapper {
  overflow: visible;
}
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
.btnWrap {
  margin-top: 15px;
}
.tableKpi h2 {
  font-weight: normal;
  font-size: 16px;
  border-bottom: 1px solid #ccc;
}
.half-form {
  display: inline-block;
  vertical-align: top;
  width: 49%;
}

.demo-drawer__footer {
  position: absolute;
  bottom: 50px;
  right: 50px;
}
</style>
