<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="邮件标题" prop="noticeTitle">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入邮件标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发件人名称" prop="createBy">
        <el-input
          v-model="queryParams.from"
          placeholder="请输入发件人名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery" v-hasPermi="['cms:email:emailLog']">搜索</el-button>
        <!--<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
        <!--<el-button type="primary" size="mini" @click="handleUpdate('')">发送邮件</el-button>-->
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="noticeList" @selection-change="handleSelectionChange">
      <!--<el-table-column type="selection" width="55" align="center" />-->
      <el-table-column label="收件人" align="center" prop="toAddress" :show-overflow-tooltip="true"/>
      <el-table-column label="抄送人" align="center" prop="ccAddress" :show-overflow-tooltip="true"/>
      <el-table-column label="密送人" align="center" prop="bccAddress" :show-overflow-tooltip="true"/>
      <el-table-column label="邮件标题" align="center" prop="subject" :show-overflow-tooltip="true"/>
      <el-table-column label="发件人名称" align="center" prop="sendBy" />
      <el-table-column label="发件人地址" align="center" prop="sendAddress" />
      <el-table-column label="发送时间" align="center" prop="createTime" />
      <el-table-column label="发送状态" align="center" prop="sendCode">
        <template slot-scope="scope">
          <span>{{ scope.row.sendCode === '00' ? '成功' : '失败' }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:notice:edit']"
          >发送邮件</el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改公告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="16">
            <el-form-item label="发件人名称">
              <el-input v-model="form.senderName" placeholder="请输入发件人名称" />
            </el-form-item>
          </el-col>
          <div class="clearfix"></div>
          <div class="send-people">
            <el-col :span="16">
              <el-form-item label="发件人地址">
                <el-input v-model="form.from" placeholder="请输入发件人地址" />
              </el-form-item>
            </el-col>
            <span class="email-name">@haier.net</span>
          </div>
          <el-col :span="16">
            <el-form-item label="收件人" :span="18">
              <el-input v-model="form.tos" placeholder="请输入收件人，多个以“,”隔开，最多30个" @input="changeData('tos')" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="抄送人">
              <el-input v-model="form.cc" placeholder="请输入抄送人，多个以“,”隔开，最多30个" @input="changeData('cc')"/>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="密送人">
              <el-input v-model="form.bcc" placeholder="请输入密送人，多个以“,”隔开，最多30个" @input="changeData('bcc')" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="邮件标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入邮件标题" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="邮件内容" required>
              <editor v-model="form.content" :min-height="192"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">发 送</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listNotice, getNotice, delNotice, addNotice, updateNotice } from "@/api/system/notice";
  import { sendEmail, sendAllEmail, emailLog } from "@/api/publicFun/sendMail";

  export default {
    name: "sendMail",
    dicts: ['sys_notice_status', 'sys_notice_type'],
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 公告表格数据
        noticeList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          noticeTitle: undefined,
          createBy: undefined,
          status: undefined,
          tos: '',
          cc: '',
          bcc: '',
          title: '',
          from: ''
        },
        // 表单参数
        form: {
          appKey: 'APPNAME011',
          tos: '',
          cc: '',
          bcc: '',
          title: '',
          from: '',
          senderName: '',
          content: ''
        },
        // 表单校验
        rules: {
          title: [
            { required: true, message: "邮件标题不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询公告列表 */
      getList() {
        this.loading = true;
        let params = {
          appKey: 'APPNAME011',
          tos: this.queryParams.tos,
          cc: this.queryParams.cc,
          bcc: this.queryParams.bcc,
          title: this.queryParams.title,
          from: this.queryParams.from,
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize
        }
        emailLog(params).then(response => {
          this.noticeList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          appKey: 'APPNAME011',
          tos: '',
          cc: '',
          bcc: '',
          title: '',
          from: '',
          senderName: '',
          content: ''
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.noticeId)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加公告";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const noticeId = row.id;
        this.$set(this.form, 'senderName', row.sendBy);
        debugger
        if (row.sendAddress && row.sendAddress.includes('@')) {
          this.$set(this.form, 'from', row.sendAddress.split('@')[0]);
        } else {
          this.$set(this.form, 'from', row.sendAddress);
        }
        this.$set(this.form, 'tos', row.toAddress);
        this.$set(this.form, 'cc', row.ccAddress);
        this.$set(this.form, 'bcc', row.bccAddress);
        this.$set(this.form, 'title', row.subject);
        this.$set(this.form, 'content', row.content);
        this.open = true;
        this.title = "发送邮件";
      },
      /** 提交按钮 */
      submitForm: function() {
        let _this = this
        this.$refs["form"].validate(valid => {
          if (valid) {
            debugger
            let params = {
              appKey: _this.form.appKey,
              tos: _this.form.tos,
              cc: _this.form.cc,
              bcc: _this.form.bcc,
              content: _this.form.content,
              senderName: _this.form.senderName,
              title: _this.form.title,
              from: _this.form.from
            }
            if (!_this.form.tos) {
              _this.$confirm('确定全员发送该邮件吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                params.tos = 'all'
                sendAllEmail(params).then(response => {
                  debugger
                  console.log(response);
                  this.getList();
                  this.open = false;
                })
              }).catch(() => {
              });
            } else {
              sendEmail(params).then(response => {
                console.log(response);
                this.getList();
                this.open = false;
              })
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const noticeIds = row.noticeId || this.ids
        this.$modal.confirm('是否确认删除公告编号为"' + noticeIds + '"的数据项？').then(function() {
          return delNotice(noticeIds);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      // 监听输入邮箱名格式
      changeData (str) {
        if (this.form[str].includes('，')) {
          let data = this.form[str].replace(/，/g, ',')
          this.$set(this.form, str, data)
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .send-people {
    .email-name {
      margin-left: 20px;
      line-height: 36px;
      font-size: 14px;
    }
  }
</style>
