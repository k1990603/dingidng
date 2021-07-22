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
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      style="padding: 0 15px"
      label-width="80px"
    >
      <el-form-item label="考核部门" prop="name" class="half-form">
        <span>{{ dataTable.deptName }}</span>
      </el-form-item>
      <el-form-item label="考核人员" prop="name" class="half-form">
        <span>{{ dataTable.userName }}</span>
      </el-form-item>
      <el-form-item label-width="0">
        <div class="tableKpi">
          <h2>考核指标</h2>
          <el-input
            v-model="dataTable.name"
            clearable
            size="small"
            placeholder="输入岗位名称搜索"
            style="width: 200px"
            class="filter-item"
            @keyup.enter.native="searchQuery"
          />
          <el-button
            size="mini"
            plain
            type="info"
            icon="el-icon-search"
            @click="toggleSearch()"
            >搜索</el-button
          >
          <el-button size="mini" icon="el-icon-refresh" @click="refresh()"
            >重置</el-button
          >
        </div>
        <!-- table -->
        <el-table
          ref="table"
          v-loading="loading"
          :data="form.detailReqParams"
          style="width: 100%"
        >
          <el-table-column prop="num" width="45" label="序号" />
          <el-table-column prop="indicatorsName" label="指标名称">
          </el-table-column>
          <el-table-column prop="indicatorsType" label="指标类型" align="center">
            <template slot-scope="scope">
              <el-select
              disabled
                v-model="scope.row.indicatorsType"
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
          <el-table-column prop="dictDetailId" label="考核部门" align="center" width="165">
            <template slot-scope="scope">
              <treeselect
              disabled
                v-model="scope.row.deptId"
                :options="depts"
                placeholder="选择部门"
                :normalizer="normalizer"
                @input="updateUserIdTable(scope)"
              >
              </treeselect>
            </template>
          </el-table-column>
          <el-table-column prop="userId" label="考核人员" align="center">
            <template slot-scope="scope">
              <el-select
                disabled
                v-model="scope.row.userId"
                filterable
                class="edit-input"
                clearable
                size="mini"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in scope.row.userList"
                  :key="item.id"
                  :label="item.username"
                  :value="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="assessmentContent" width="115" label="考核内容">
          </el-table-column>
          <el-table-column prop="targetValue" label="目标值">
          </el-table-column>
          <el-table-column prop="weight" label="权重">
          </el-table-column>
          <el-table-column
            prop="isDesc"
            label="填写说明"
            width="45"
            align="center"
          >
            <template slot-scope="scope">
              <el-switch
                disabled
                v-model="scope.row.isDesc"
                active-color="#409EFF"
                inactive-color="#F56C6C"
              />
            </template>
          </el-table-column>
          <el-table-column prop=" isFj" label="上传附件" width="45" align="center">
            <template slot-scope="scope">
              <el-switch
                disabled
                v-model="scope.row.isFj"
                active-color="#409EFF"
                inactive-color="#F56C6C"
              />
            </template>
          </el-table-column>
          <!-- <el-table-column prop="createTime" label="创建日期" /> -->
          <!--   编辑与删除   -->
          <!-- <el-table-column
            v-if="checkPer(['admin', 'job:edit', 'job:del'])"
            label="操作"
            width="130px"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <udOperation :data="scope.row" :permission="permission" />
            </template>
          </el-table-column> -->
        </el-table>
        <!--分页组件-->
        <!-- <pagination /> -->
      </el-form-item>
      <el-form-item label="总分" prop="totalScore">
        <span>{{ form.totalScore }}</span>
      </el-form-item>
      <el-form-item label="状态" prop="isKpi">
        <el-radio
        disabled
          v-for="(item,index) in assessmentStatus"
          :key="index"
          v-model="form.isKpi"
          :label="item.value"
        >
          {{ item.label }}
        </el-radio>
      </el-form-item>
    </el-form>
    <!-- <div slot="footer" class="dialog-footer"> -->
    <div class="demo-drawer__footer">
      <el-button size="large" @click="cancel"> 取消 </el-button>
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
import { form } from "@crud/crud";
import { getDeptId } from "@/api/kpi/template";
import { getDepts, getDeptSuperior } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import pagination from "@crud/Pagination";
import crudTemplate from "@/api/kpi/template";

const defaultForm = {
  id: null,
  isKpi: "0",
  deptId: null,
  userId: null,
  totalScore: 0,
  detailReqParams: [
        {
          num: 1,
          indicatorsName: "",
          indicatorsType: null,
          dictDetailId: null,
          assessmentContent: "",
          targetValue: null,
          weight: null,
          deptId: null,
          userId: null,
          isDesc: false,
          isFj: false,
          userList: []
        }
      ]
  // name: "",
  // jobSort: 999,
  // enabled: true,
};
export default {
  mixins: [form(defaultForm)],
  props: {
    depts: {
      type: Array,
      required: true,
    },
    detailVisible: {
      type: Boolean,
      required: true,
    },
    detailId: {
      type: Number,
      required: true,
    },
  },
  components: { Treeselect, pagination },
  data() {
    return {
      dataTable:{},
      // form: {
      //   isKpi: '0',
      //   deptId: null,
      //   userId: null,
      //   totalScore: 0
      // },
      sizePercent: '80%',
      normalizer(node) {
        return {
          id: node.id,
          label: node.label,
          children: node.children,
        }
      },
      loading: false,
      // form.detailReqParams: [
      //   {
      //     num: 1,
      //     indicatorsName: "",
      //     dictDetailId: null,
      //     assessmentContent: "",
      //     targetValue: null,
      //     weight: null,
      //     deptId: null,
      //     userId: null,
      //     isDesc: false,
      //     isFj: false,
      //   },
      // ],
      userList: [],
      // userListList: [],
      // userListTable: [],
      assessmentStatus: [
        { label: "参与考核", value: true },
        { label: "不参与考核", value: false },
      ],
      dictDetailList: [
        { label: "基础指标", value: "0" },
        { label: "重点指标", value: "1" },
        { label: "加分项", value: "2" },
        { label: "扣分项", value: "3" },
      ],
      selections: [],
      rules: {
        indicatorsName: [{ required: true, message: "请输入名称", trigger: "blur" }],
        dictDetailId: [{ required: true, message: "请选择指标", trigger: "blur" }],
      },
    };
  },
  watch: {
    detailVisible(value) {
      if (value) {
        this.getDetail()
        // document.body.addEventListener('click', this.close)
      }
    }
  },
  methods: {
    getDepts,
    getDeptId,
    cancel(){
      this.$emit('cancel')
    },
    getDetail(){
      crudTemplate.detailTable(this.detailId).then((res) => {
        console.log(res.data, 'res.data')
        this.dataTable = res.data
          // res.kpiDetailDtos.forEach((item, index) => {
          //   item.num = index+1
          // }) 
            // this.$set(this.crud.form, 'detailReqParams', res.kpiDetailDtos)
        })
        .catch(() => {});
    },
    // getDeptIdAction() {
    //   console.log(!!this.form.deptId, 'this.form.deptId')
    //   if(!!this.form.deptId) {
    //     getDeptId(this.form.deptId)
    //     .then((res) => {
    //       this.userList = res;
    //     })
    //     .catch(() => {});
    //   }else{
    //     this.userList = []
    //   }
      
    // },
    // updateValue() {
    //   this.getDeptIdAction();
    // },
    // updateUserIdTable(scope) {
    //   if(!!scope.row.deptId) {
    //     getDeptId(scope.row.deptId)
    //       .then((res) => {
    //         // this.userListTable = res;
    //         this.$set(this.form.detailReqParams[scope.$index],'userList',res)
    //       })
    //       .catch(() => {});
    //   }
    // },
    // 获取弹窗内部门数据
    // loadDepts({ action, parentNode, callback }) {
    //   if (action === LOAD_CHILDREN_OPTIONS) {
    //     getDepts({ enabled: true, pid: parentNode.id }).then((res) => {
    //       parentNode.children = res.content.map(function (obj) {
    //         if (obj.hasChildren) {
    //           obj.children = null;
    //         }
    //         return obj;
    //       });
    //       setTimeout(() => {
    //         callback();
    //       }, 200);
    //     });
    //   }
    // },
    // selectionChangeHandler(val) {
    //   // console.log(val);
    //   this.selections = val;
    // },
    // // search() {},
    // weightChange(val) {
    //   let num = 0
    //   this.form.detailReqParams.forEach(item=>{
    //     num+=item.weight
    //   })
    //   this.form.totalScore = num;
    //   // console.log(val, this.form, this.form.totalScore);
    // },
    // toAdd() {
    //   let len = this.form.detailReqParams.length;
    //   let lens = this.form.detailReqParams[len - 1].num + 1;
    //   let obj = {
    //     num: lens,
    //     indicatorsName: "",
    //     dictDetailId: null,
    //     assessmentContent: "",
    //     targetValue: null,
    //     weight: null,
    //     deptId: null,
    //     userId: null,
    //     isDesc: false,
    //     isFj: false,
    //     userList: []
    //   };
    //   this.form.detailReqParams.push(obj);
    // },
    // toDelete(section) {
    //   let num = section.map((item) => item.num);
    //   num.forEach((items) => {
    //     this.form.detailReqParams = this.form.detailReqParams.filter((item) => item.num != items);
    //   });
    //   console.log(num, this.form.detailReqParams);
    // },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-table{
 overflow: visible;
}
 ::v-deep .el-table .cell{
 overflow: visible;
}
 ::v-deep .el-table__body-wrapper{
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
