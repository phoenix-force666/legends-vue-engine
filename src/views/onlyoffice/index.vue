<template>
  <div class="app-container" style="height: 88vh">
    <remote-js js-url="http://192.168.2.104:9001/web-apps/apps/api/documents/api.js"/>
    <div v-show="editorVisible" style="height: 95%">
      <el-button v-waves type="primary" icon="el-icon-upload" class="filter-item" style="float: left" @click="handleClose">保存并关闭</el-button>
      <div id="editor-container"/>
    </div>
    <div v-show="!editorVisible">
      <div class="filter-container">
        <el-input
          v-model="listQuery.fileName"
          placeholder="文件名"
          class="filter-item"
          style="width: 200px;float: left"
          @keyup.enter.native="handleFilter"/>
        <el-button v-waves type="primary" icon="el-icon-search" class="filter-item" style="float: left" @click="handleFilter">查 询</el-button>
        <el-button v-waves type="primary" icon="el-icon-refresh" class="filter-item" style="float: left" @click="resetForm">重 置</el-button>
        <el-upload
          :limit="3"
          :on-success="uploadFinish"
          :action="uploadUrl"
          :show-file-list="false"
          class="upload-demo"
          style="float: left; margin-left: 10px"
          multiple>
          <el-button v-waves type="primary" icon="el-icon-upload2" class="filter-item">上传</el-button>
        </el-upload>
      </div>

      <el-table
        v-loading="listLoading"
        :data="objList"
        border
        style="width: 100%">
        <el-table-column label="序号" type="index" align="center" width="95"/>
        <el-table-column label="文件名" prop="fileName" align="center" sortable show-overflow-tooltip/>
        <el-table-column label="文件扩展名" prop="fileExtension" align="center" show-overflow-tooltip/>
        <el-table-column width="0" label="" align="center" fixed="right"/>
        <el-table-column width="250" label="操作" align="center" fixed="right">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.current"
        :limit.sync="listQuery.size"
        @pagination="getList"/>
    </div>
  </div>
</template>

<style>
  .filter-container {
    padding-bottom: 10px;
  }

  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }

  table {
    border-collapse: collapse;
  }
</style>

<script>
import RemoteJs from '@/components/RemoteJs'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { officeService } from '@/api/office/office'
export default {
  name: 'Office',
  components: { Pagination, RemoteJs },
  directives: { waves },
  data() {
    return {
      objList: [],
      office: {},
      listLoading: true,
      listQuery: {
        current: 1,
        size: 20
      },
      total: 0,
      editorVisible: false,
      docEditor: null
    }
  },
  computed: {
    uploadUrl() {
      return process.env.BASE_API + '/oss/upload/office'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      officeService.list(this.listQuery).then(res => {
        this.objList = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }, err => {
        console.log(err)
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    resetForm() {
      this.listQuery = {
        current: 1,
        size: 20
      }
    },
    uploadFinish(res, file, fileList) {
      if (res.code === 20000) {
        this.createData(res.data, file)
      } else if (res.code === 50000) {
        this.notifyError(res.message)
      } else {
        this.notifyError('')
      }
    },
    convertType(extension) {
      switch (extension) {
        case 'docx': case 'doc': case 'odt': case 'txt': case 'pdf':
          return 'text'
        case 'xlsx': case 'xls': case 'ods': case 'csv':
          return 'spreadsheet'
        case 'pptx': case 'ppt': case 'odp':
          return 'presentation'
        default :
          return ''
      }
    },
    handleEdit(item) {
      this.editorVisible = true
      this.docEditor = new DocsAPI.DocEditor('editor-container', { //eslint-disable-line
        'document': {
          'fileType': item.fileExtension,
          'title': item.fileName + '.' + item.fileExtension,
          'url': item.fileUrl
        },
        'documentType': this.convertType(item.fileExtension),
        'editorConfig': {
          'mode': 'edit',
          'callbackUrl': 'http://192.168.2.104/office/onlyoffice/save/' + item.fileId
        }
      })
    },
    handleDelete(item) {
      this.$confirm('请确认是否删除该文件?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await officeService.delete(item.fileId).then(res => {
            this.notifySuccess('删除成功')
            const index = this.objList.indexOf(item)
            this.objList.splice(index, 1)
          })
        })
        .catch(err => {
          console.error(err)
        })
    },
    handleClose() {
      this.docEditor.destroyEditor()
      const loading = this.$loading({
        lock: true,
        text: '正在上传',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      setTimeout(() => {
        loading.close()
        this.editorVisible = false
        this.getList()
      }, 12000)
    },
    notifySuccess(msg) {
      this.$notify({
        title: '成功',
        message: msg,
        type: 'success',
        duration: 2000
      })
    },
    notifyError(msg) {
      this.$notify({
        title: '上传失败',
        message: msg,
        type: 'error',
        duration: 2000
      })
    },
    createData(url, file) {
      const name = file.name
      const fileName = name.substring(0, name.lastIndexOf('.'))
      const fileExtension = name.substring(name.lastIndexOf('.') + 1)
      this.office = {
        fileUrl: url,
        fileName: fileName,
        fileExtension: fileExtension,
        fileSize: file.size,
        fileContenttype: file.raw.type
      }
      officeService.create(this.office).then(res => {
        this.getList()
        this.notifySuccess('上传成功')
      })
    }
  }
}
</script>
