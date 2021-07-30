<template>
  <el-drawer
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    :size="sizePercent"
    direction="rtl"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      style="padding: 0 15px"
      label-width="80px"
    >
      <el-form-item label="考核部门" prop="name" class="half-form">
        {{ form.deptName }}
        <!-- <treeselect
          v-model="form.deptId"
          :options="depts"
          style="width: 178px"
          placeholder="选择部门"
          :normalizer="normalizer"
          @input="updateValue"
        >
        </treeselect> -->
      </el-form-item>
      <el-form-item label="考核人员" prop="name" class="half-form">
        {{ form.username }}
        <!-- <el-select
          :disabled="!form.deptId"
          v-model="form.userId"
          style="width: 178px"
          placeholder="请选择"
        >
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.username"
            :value="item.id"
          />
        </el-select> -->
      </el-form-item>
      <el-form-item label-width="0">
        <!-- <div class="btnWrap">
          <el-button
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="toAdd"
          >
            新增
          </el-button>
          <el-button
            class="filter-item"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="selections.length === 0"
            @click="toDelete(selections)"
          >
            删除
          </el-button>
        </div> -->
        <el-table
          ref="table"
          v-loading="loading"
          :data="form.itemDtos"
          style="width: 100%"
        >
          <!-- <el-table-column type="selection" width="35" /> -->
          <el-table-column prop="num" label="序号" align="center" />
          <el-table-column
            prop="indicatorsName"
            label="指标名称"
          />
          <el-table-column
            prop="indicatorsType"
            label="指标类型"
            align="center"
          >
            <template slot-scope="scope">
              {{ dictDetailList[scope.row.indicatorsType].label || "" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="assessmentContent"
            label="考核内容"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.assessmentContent }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="targetValue"
            label="目标值"
            align="center"
          />
          <el-table-column
            prop="weight"
            label="权重"
            align="center"
          />
          <el-table-column prop="pf" label="评分" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.pf"
                :min="0"
                style="width: 90px; textalign: center"
                size="mini"
                class="edit-input"
                placeholder="请填写"
                @input="pfChange"
              />
            </template>
          </el-table-column>
          <el-table-column prop="descStr" label="填写说明" align="center">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.descStr"
                :disabled="!scope.row.isDesc"
                type="textarea"
                size="mini"
                class="edit-input"
                placeholder="请填写说明"
              />
              <!-- <span>{{ scope.row.desc }}</span> -->
            </template>
          </el-table-column>
          <el-table-column prop="files" label="上传附件" align="center">
            <template slot-scope="scope">
              <!-- <el-upload
                class="upload-demo"
                drag
                :action="baseUploadUrl+scope.row.id"
                @crop-upload-success="cropUploadSuccess"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload> -->
              <button v-if="scope.row.isFj" @click="uploadSelect(scope)">
                附件
              </button>
              <myUpload
                v-model="show"
                :headers="headers"
                :url="baseUploadUrl + scope.row.id"
                :data-num="scope.num"
                @crop-upload-success="cropUploadSuccess"
              />
              <!-- <el-upload
                class="upload-demo"
                :disabled="!scope.row.isFj"
                ref="upload"
                :action="baseUploadUrl+scope.row.id"
                :file-list="fileList"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
              </el-upload> -->
              <!-- <el-input
                :disabled="!scope.row.isFj"
                type="textarea"
                v-model="scope.row.files"
                size="mini"
                class="edit-input"
                placeholder="请填写说明"
              /> -->
              <!-- <span>{{ scope.row.files }}</span> -->
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="isDesc"
            label="填写说明"
            width="55"
            align="center"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isDesc"
                active-color="#409EFF"
                inactive-color="#F56C6C"
              />
            </template>
          </el-table-column>
          <el-table-column prop=" isFj" label="上传附件" width="55" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isFj"
                active-color="#409EFF"
                inactive-color="#F56C6C"
              />
            </template>
          </el-table-column> -->
        </el-table>
        <!--分页组件-->
        <!-- <pagination /> -->
      </el-form-item>
      <el-form-item label="评分" prop="jsFs">
        <span>{{ form.jsFs || 0 }}</span>
      </el-form-item>
      <el-form-item label="等级" prop="jsLevel">
        <span>{{ form.jsLevel }}</span>
      </el-form-item>
      <el-form-item label="系数" prop="jsxs">
        <span>{{ form.jsxs }}</span>
      </el-form-item>
    </el-form>
    <!-- <div slot="footer" class="dialog-footer"> -->
    <div class="demo-drawer__footer">
      <!-- <span>{{ crud.status.cu }}</span> -->
      <el-button size="large" @click="crud.cancelCU"> 取消 </el-button>
      <el-button
        :loading="crud.status.cu === 2"
        type="primary"
        size="large"
        @click="crud.submitCU"
      >
        确认
      </el-button>
    </div>
  </el-drawer>
</template>

<script>
import { form } from '@crud/crud'
import { getDeptId } from '@/api/kpi/template'
import { getDepts } from '@/api/system/dept'
import myUpload from 'vue-image-crop-upload'
import { getToken } from '@/utils/auth'

const defaultForm = {
  id: null,
  isKpi: '0',
  deptId: null,
  userId: null,
  totalScore: 0,
  itemDtos: [
    {
      num: 1,
      indicatorsName: '',
      indicatorsType: null,
      dictDetailId: null,
      assessmentContent: '',
      targetValue: null,
      weight: null,
      deptId: null,
      userId: null,
      isDesc: false,
      isFj: false,
      pf: '0',
      jsFs: '0',
      jsLevel: '',
      jsxs: null,
      userList: []
    }
  ]
  // name: "",
  // jobSort: 999,
  // enabled: true,
}
export default {
  components: { myUpload },
  mixins: [form(defaultForm)],
  props: {
    depts: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      fileList: [],
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
      show: false,
      num: 0,
      headers: {
        Authorization: getToken()
      },
      // userListList: [],
      // userListTable: [],
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
  computed: {
    baseUploadUrl() {
      return process.env.VUE_APP_BASE_API + '/ding/kpi/create/updateFj/'
    }
  },
  // mounted() {
  // console.log(this.form, 'form')
  // this.getDeptsAction()
  // this.deptss = this.depts
  // },
  methods: {
    getDepts,
    getDeptId,
    getDeptIdAction() {
      // console.log(!!this.form.deptId, 'this.form.deptId')
      if (this.form.deptId) {
        getDeptId(this.form.deptId)
          .then((res) => {
            this.userList = res
          })
          .catch(() => {})
      } else {
        this.userList = []
      }
    },
    updateValue() {
      this.getDeptIdAction()
    },
    updateUserIdTable(scope) {
      if (scope.row.deptId) {
        getDeptId(scope.row.deptId)
          .then((res) => {
            // this.userListTable = res;
            this.$set(this.form.itemDtos[scope.$index], 'userList', res)
          })
          .catch(() => {})
      }
    },
    selectionChangeHandler(val) {
      // console.log(val);
      this.selections = val
    },
    // submitUpload() {
    //     this.$refs.upload.submit();
    //   },
    // search() {},
    pfChange() {
      let num = 0
      this.form.itemDtos.forEach((item) => {
        console.log(item)
        num += item.pf || 0
      })
      this.$set(this.form, 'jsFs', num)
      // this.form.jsFs = num;
      console.log('conmoi', num)
      this.count(num)
      // console.log(val, this.form, this.form.totalScore);
    },
    count(num) {
      // var that = this
      // that.F0000012.BindChange( "key", function() {
      // var zf = that.F0000012.GetValue();
      if (num > 110) {
        this.form.jsLevel = 'A级'
        this.form.jsxs = '1.1'
      }
      if (num <= 110 && num >= 100) {
        this.form.jsLevel = 'B级'
        this.form.jsxs = '1.05'
      }
      if (num <= 100 && num >= 90) {
        this.form.jsLevel = 'C级'
        this.form.jsxs = '1.0'
      }
      if (num < 90 && num >= 80) {
        this.form.jsLevel = 'D级'
        this.form.jsxs = '0.9'
      }
      if (num < 80 && num >= 70) {
        this.form.jsLevel = 'E级'
        this.form.jsxs = '0.8'
      }
      if (num < 70) {
        this.form.jsLevel = 'F级'
        this.form.jsxs = '0'
      }
      // }
    },
    toAdd() {
      const len = this.form.itemDtos.length
      const lens = this.form.itemDtos[len - 1].num + 1
      const obj = {
        num: lens,
        indicatorsName: '',
        dictDetailId: null,
        assessmentContent: '',
        targetValue: null,
        weight: null,
        deptId: null,
        userId: null,
        isDesc: false,
        isFj: false,
        pf: '0',
        jsFs: '0',
        jsLevel: '',
        jsxs: null,
        userList: []
      }
      this.form.itemDtos.push(obj)
    },
    toDelete(section) {
      const num = section.map((item) => item.num)
      num.forEach((items) => {
        this.form.itemDtos = this.form.itemDtos.filter(
          (item) => item.num !== items
        )
      })
      console.log(num, this.form.itemDtos)
    },
    uploadSelect(scope) {
      this.show = true
      this.num = scope.row.num
      // this.id = scope.row.id
    },
    cropUploadSuccess(value) {
      this.$set(this.form.itemDtos[this.num], 'avatar', value.fjName)
      // console.log(value, 44444)
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
