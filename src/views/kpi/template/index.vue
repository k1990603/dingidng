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
      <el-table-column prop="deptName" align="center" label="考核部门">
        <template slot-scope="scope">
          <a href="javascript:;" @click="detailVisibleShow(scope)">{{ scope.row.deptName }}</a>
          
        </template>
      </el-table-column>
      <el-table-column prop="username" align="center" label="考核人" />
      <el-table-column prop="isKpi" align="center" label="是否参加考核">
        <template slot-scope="scope">
          <span>{{ scope.row.isKpi === "0" ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalScore" align="center" label="总分" />
      <el-table-column prop="createTime" align="center" label="创建日期" />
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin', 'template:edit', 'template:del'])"
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
    <detail :detailVisible="detailVisible" :detailId="detailId" @cancel="cancel" :depts="depts" />
  </div>
</template>

<script>
import crudTemplate from "@/api/kpi/template";
// import { getDepts } from '@/api/kpi/other'
import eHeader from "./module/header";
import eForm from "./module/form";
import detail from "./module/detail";
import CRUD, { presenter } from "@crud/crud";
import crudOperation from "@crud/CRUD.operation";
import pagination from "@crud/Pagination";
import udOperation from "@crud/UD.operation";
export default {
  name: "Template",
  components: { eHeader, eForm, crudOperation, pagination, udOperation, detail },
  cruds() {
    return CRUD({
      title: "kpi模板",
      url: "ding/kpi/getModels",
      // sort: ['jobSort,asc', 'id,desc'],
      crudMethod: { ...crudTemplate },
    });
  },
  mixins: [presenter()],
  data() {
    return {
      detailVisible: false,
      detailId: null,
      permission: {
        add: ["admin", "template:add"],
        edit: ["admin", "template:edit"],
        del: ["admin", "template:del"],
      },
      depts: [],
      normalizer(node) {
        return {
          id: node.id,
          label: node.label,
          children: node.children,
        }
      }
    };
  },
  mounted() {
    this.getdept();
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
      if(crud.form.id) {
        this.getDetail(crud.form.id)
      } else {
        // let obj = {
        // num: 1,
        // indicatorsName: "",
        // dictDetailId: null,
        // assessmentContent: "",
        // targetValue: null,
        // weight: null,
        // deptId: null,
        // userId: null,
        // isDesc: false,
        // isFj: false,
        // userList: []
        // }
        // this.$set(this.crud.form, 'detailReqParams', obj)
      }
    },
    getDetail(id){
      crudTemplate.detailTable(id).then((res) => {
          res.kpiDetailDtos.forEach((item, index) => {
            item.num = index+1
          }) 
          // this.$nextTick(() => {
            this.$set(this.crud.form, 'detailReqParams', res.kpiDetailDtos)
            // })
          // this.crud.form.detailReqParams.forEach(item => {
          //   this.$set(item,'userList',item.userList)
          // })
          // console.log(this.crud.form)
        })
        .catch(() => {});
    },
    // 获取弹窗内岗位数据
    getdept() {
      crudTemplate
        .getDepts()
        .then((res) => {
          this.depts = res;
          // document.write(JSON.stringify(this.depts))
        })
        .catch(() => {});
    },
    // toEdit() {
    //   console.log(1111111)
    // },
    // 改变状态
    // changeEnabled(data, val) {
    //   this.$confirm(
    //     '此操作将 "' +
    //       this.dict.label.job_status[val] +
    //       '" ' +
    //       data.name +
    //       "岗位, 是否继续？",
    //     "提示",
    //     {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning",
    //     }
    //   )
    //     .then(() => {
    //       // eslint-disable-next-line no-undef
    //       crudTemplate
    //         .edit(data)
    //         .then(() => {
    //           // eslint-disable-next-line no-undef
    //           this.crud.notify(
    //             this.dict.label.job_status[val] + "成功",
    //             "success"
    //           );
    //         })
    //         .catch((err) => {
    //           data.enabled = !data.enabled;
    //           console.log(err.data.message);
    //         });
    //     })
    //     .catch(() => {
    //       data.enabled = !data.enabled;
    //     });
    // },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
