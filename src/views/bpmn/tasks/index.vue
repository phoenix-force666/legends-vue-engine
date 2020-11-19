<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        :placeholder="$t('flowModel.name')"
        style="width: 120px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        type="primary"
        icon="el-icon-search"
        class="filter-item"
        @click="handleFilter"
        >查 询</el-button
      >
      <el-button
        type="primary"
        class="filter-item"
        icon="el-icon-refresh"
        @click="resetForm"
        >重 置</el-button
      >
    </div>

    <el-table
      v-loading="listLoading"
      :data="objList"
      border
      style="width: 100%;"
    >
      <el-table-column label="id" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('flowModel.taskName')"
        prop="name"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('flowModel.assignee')"
        prop="assignee"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.assignee }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('flowModel.description')"
        prop="description"
        align="center"
        width="160"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('flowModel.tenantId')"
        prop="tenantId"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.tenantId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('flowModel.createTime')"
        prop="createTime"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column width="250" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="complete(scope.row)"
            >办理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"/>

      <el-dialog
        title="scope.row"
        :v-if="dialogVisible"
        :visible.sync="dialogVisible">
        <div class="formData" v-html="form"></div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit()">提 交</el-button>
        </div>
      </el-dialog>

  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { tasksService } from "@/api/flow/tasks";
import BpmnDrawer from "@/views/bpmn/bpmnDrawer.vue";
export default {
  name: "Model",
  components: {
    Pagination,
    BpmnDrawer
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        T: "success",
        F: "danger"
      };
      return statusMap[status];
    }
  },
  data: function() {
    return {
      form: "",
      id:"",
      showCheckBox: true,
      dialogVisible: false,
      editable: false,
      defaultChecked: { checkedpermissions: [], checkedrouters: [] },
      objList: [],
      dialogFormVisible: false,
      listLoading: true,
      total: 0,
      xmlmodel: undefined,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        createDate: undefined,
        latest: true
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.dialogFormVisible = false;
      this.listLoading = true;
      var _this = this;
        tasksService.count(this.listQuery).then(function(cres) {
        _this.listQuery.firstResult =(_this.listQuery.pageNo - 1) * _this.listQuery.pageSize;
        _this.listQuery.maxResults = _this.listQuery.pageNo * _this.listQuery.pageSize;
        tasksService.list(_this.listQuery).then(
          res => {
            _this.objList = res;
            _this.total = 10;
            _this.listLoading = false;
          },
          err => {
            console.log(err);
            _this.listLoading = false;
          }
        );
      });
    },
    handleFilter() {
      this.listQuery.pageNo = 1;
      this.getList();
    },
    complete: function(item) {
      tasksService.renderedForm(item.id, {}).then(res => {
        console.log(res);
        this.form = res;
        this.id=item.id;
        this.dialogVisible = true;
      },
      err => {
        console.log(err);
        console.log('走我了吗');
        this.form ='';
        this.id=item.id;
        this.dialogVisible = true;
      }
      );
    },
    submit(){
      //获取from 参数
      var　parameter=getParameter(".form-control");
      //组装请求报文
      var params={};
      params["variables"]=parameter;
      var _this = this;
      tasksService.complete(this.id, params).then(function(res) {
        console.log(res);
        _this.getList();
      });

      this.dialogVisible = false;
    },
    resetForm() {
      this.listQuery = {};
    },
    dateRangeChange(data) {
      if (data) {
        this.listQuery.start_time = data[0];
        this.listQuery.end_time = data[1];
      }
    }
  }
};

// 封装方法，获取到form表单的数据。使用此方法，表单元素必须存在name属性。
  //el:元素的class名称。
  function getParameter(el){
      var obj={};
      $(el).each(function(index,item){
          var temp={};
          console.log("我是"+item.type);

          // 判断元素的类型
          if(item.type=="text" || item.type=="password" || item.type=="select-one"  || item.type=="tel"  || 
              item.type=="search" || item.type=="range" || item.type=="number" || item.type=="month" || 
              item.type=="email" || item.type=="datetime-local" || item.type=="datetime" || item.type=="date" || 
              item.type=="color"){
              //获取到name的值,name的值就是向后台传递的数据
              obj[$(this).attr("name")]=$(this).val();
              temp["value"]=$(this).val();
              temp["type"]=$(this).attr("cam-variable-type");
              temp["valueInfo"]={};
          }else if(item.type=="checkbox"){
              var stamp=true;
              console.log($(this).attr("name"))
              if($(this).attr("name") && stamp){
                  stamp=false;
                  // 获取到复选框选中的元素
                  var checkboxEl=$("input[name="+$(item).attr('name')+"]:checked");
                  console.log("checkboxEl:"+checkboxEl);
                  if(checkboxEl){
                      var checkboxArr=[];
                      // 取出复选框选中的值
                      checkboxEl.each(function(idx,itm){
                          // checkboxArr.push($(itm).val());
                          checkboxArr.push(true);
                          console.log("选中的值："+$(itm).val());
                      });

                      if(checkboxArr.length===0){
                        checkboxArr.push(false);
                         console.log('未选中'); 
                      }
                      obj[$(this).attr("name")]=checkboxArr.join(",");
                      temp["value"]=checkboxArr.join(",");
                      temp["type"]=$(this).attr("cam-variable-type");
                      temp["valueInfo"]={};
                  }
                  
              }
          }else if(item.type=="radio"){
              // 获取到单选框选中的值
              var radio_val=$("input[name="+$(item).attr('name')+"]:checked").val();
              if(radio_val){
                  obj[$(item).attr("name")]=radio_val;
                  temp["value"]=radio_val;
                  temp["type"]=$(this).attr("cam-variable-type");
                  temp["valueInfo"]={};
              }
          }

          obj[$(this).attr("name")]=temp;
      });
      return obj;
  }
</script>
<style>
.filter-container {
  padding-bottom: 10px;
}
.filter-item {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 10px;
}
</style>
