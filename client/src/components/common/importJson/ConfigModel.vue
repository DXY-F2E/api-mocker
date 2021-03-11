<template>
  <div>
    <el-dialog title="导入设置" :visible.sync="dialogVisible" :center="true" :close-on-click-modal="false"  >
      <el-form ref="form" :model="form" :rules="rules" label-width="160px">
        <el-form-item label="导入源">
          <el-select v-model="form.importSource">
            <el-option v-for="(source, index) in importSourceList" :key="index" :value="index" :label="source" />
          </el-select>
          <el-tooltip v-if="form.importSource === 0" content="Api Mocker导出的数据格式" placement="top" style="margin-left: 5px;">
            <i class="el-icon-question" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="导入类型">
          <el-radio v-for="(category, index) in importCategoryList" :key="index" v-model="form.importCategory" :label="index">{{category}}</el-radio>
        </el-form-item>
        <el-form-item label="本地文件：" required prop="fileList" v-if="form.importCategory === 0">
          <el-upload action="" drag :auto-upload="false" :limit="limit" :file-list="form.fileList"
            :on-change="selectedFile" :on-exceed="handleExceed" :on-remove="handleRemove">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">最多上传{{limit}}个json文件，而且文件列表中不能有重复文件名</div>
          </el-upload>
        </el-form-item>
        <template v-if="form.importCategory === 1">
          <el-form-item label="Remote Url：" prop="url">
            <el-input v-model="form.url"  placeholder="请输入Remote Url" />
          </el-form-item>
          <el-form-item label="Cookie：">
            <el-input v-model="form.extraCookie" placeholder="请输入额外Cookie参数, 适用于进行了登录校验或者权限校验的接口" />
          </el-form-item>
        </template>
        <el-form-item label="导入方式：">
          <el-select v-model="form.importType">
            <template v-for="(importType, index) in importTypeList" >
               <el-option :key="index" :label="importType" :value="index" v-if="index !== 1" />
            </template>
          </el-select>
          <el-tooltip placement="top" style="margin-left: 5px;">
            <i class="el-icon-question" />
            <div slot="content">
              <p>追加导入：根据方法和接口路径确定唯一接口。如果发现要导入的接口已经存在则忽略，否则直接增加接口</p>
              <!-- <p>覆盖导入：不保留旧接口数据，完全使用新接口数据</p> -->
              <p>智能合并：根据方法和接口路径确定唯一接口。如果发现要导入的接口已经存在就覆盖已有接口，否则直接增加接口</p>
            </div>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="测试环境域名：">
          <el-input v-model="form.devUrl"  placeholder="请输入测试环境链接" />
        </el-form-item>
        <el-form-item label="线上环境域名：">
          <el-input v-model="form.prodUrl"  placeholder="请输入测试环境链接" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    showConfigModel: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      limit: 3,
      form: { url: '', prodUrl: '', extraCookie: '', importType: 0, devUrl: '', fileList: [], importSource: 0, importCategory: 0 },
      importCategoryList: ['本地文件', 'Remote Url'],
      importSourceList: ['Swagger', 'Api Mocker Doc', 'Rap', 'Har', 'EasyMockHTML', 'YapiJson'],
      importTypeList: ['追加导入', '覆盖导入', '智能合并'],
      rules: {
        url: [{required: true, pattern: /(http|https):\/\/([\w.]+\/?)\S*/, message: '请输入正确的链接地址', trigger: ['blur', 'change']}],
        fileList: [{validator: (rule, value, callback) => {
          let length = value && value.length
          if (length === 1) {
            callback()
          } else if (length > 1) {
            let nameList = value.map(file => file.name).sort()
            for (let i = 0; i < length - 1; i++) {
              if (nameList[i] === nameList[i + 1]) {
                callback(new Error('文件列表中不能有重复文件名，请修改文件名之后重新上传'))
                break
              }
            }
          } else {
            callback(new Error('文件列表不能为空'))
          }
        }}]
      }
    }
  },
  watch: {
    'form.importCategory' (val) {
      this.$refs.form.clearValidate()
    }
  },
  computed: {
    dialogVisible: {
      set (val) {
        this.$emit('update:showConfigModel', val)
      },
      get () {
        return this.showConfigModel
      }
    }
  },
  methods: {
    selectedFile (file, fileList) {
      this.form.fileList = fileList
      this.$refs.form.validateField('fileList')
    },
    handleExceed (files, fileList) {
      let {limit} = this
      this.$message.error(`当前限制选择 ${limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleRemove (file, fileList) {
      this.form.fileList = fileList
      this.$refs.form.validateField('fileList')
    },
    handleConfirm () {
      let validateResult = true
      this.$refs.form.validate((valid) => { validateResult = valid })
      if (validateResult) {
        this.$emit('submit', this.form)
      }
    }
  }
}
</script>
