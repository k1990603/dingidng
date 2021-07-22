<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <!-- <el-input v-model="query.userName" clearable size="small" placeholder="输入用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" /> -->
    <treeselect
                v-model="query.deptId"
                :options="depts"
                placeholder="选择部门"
                class="filter-item"
                style="width: 290px;"
                :normalizer="normalizer"
                @change="crud.toQuery"
              >
              </treeselect>
    <el-select v-model="query.userId" clearable filterable size="small" placeholder="选择用户" class="filter-item" style="width: 110px" @change="crud.toQuery">
      <el-option v-for="item in userListTable" :key="item.id" :label="item.username" :value="item.id" />
    </el-select>
    <date-range-picker v-model="query.createTime" class="date-item" />
    <el-select v-model="query.isKpi" clearable size="small" placeholder="是否参与考核" class="filter-item" style="width: 110px" @change="crud.toQuery">
      <el-option v-for="item in assessmentStatus" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <rrOperation />
  </div>
</template>

<script>
import { header } from '@crud/crud'
import crudTemplate from "@/api/kpi/template";
import rrOperation from '@crud/RR.operation'
import DateRangePicker from '@/components/DateRangePicker'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";

export default {
  components: { rrOperation, DateRangePicker, Treeselect },
  mixins: [header()],
  props: {
    permission: {
      type: Object,
      required: true
    },
    depts: {
      type: Array,
      required: true
    }
  },
  data(){
    return {
      assessmentStatus: [
        { label: "参与考核", value: true },
        { label: "不参与考核", value: false },
      ],
      userListTable: [],
      normalizer(node) {
        return {
          id: node.id,
          label: node.label,
          children: node.children,
        }
      }
    }
  },
  mounted () {
    this.updateUserIdTable()
  },
  methods: {
    updateUserIdTable() {
      crudTemplate.getUsers()
        .then((res) => {
          this.userListTable = res;
        })
        .catch(() => {});
    },
    // 获取弹窗内部门数据
    loadDepts({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDepts({ enabled: true, pid: parentNode.id }).then((res) => {
          parentNode.children = res.content.map(function (obj) {
            if (obj.hasChildren) {
              obj.children = null;
            }
            return obj;
          });
          setTimeout(() => {
            callback();
          }, 200);
        });
      }
    }
    }
}
</script>
