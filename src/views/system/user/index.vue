<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <!-- <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col> -->
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" class="header-search-form" label-width="90px">
          <el-form-item label="应用名称" prop="appId">
             <el-select
              v-model="queryParams.appId"
              placeholder="应用名称"
              clearable
              filterable
              size="small"
              @change="appChangeEvent"
            >
              <el-option
                v-for="item in AppList"
                :key="item.appId"
                :label="item.appName"
                :value="item.appId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="客户端名称" prop="clientId" >
            <el-select
              v-model="queryParams.clientId"
              placeholder="客户端名称"
              clearable
              filterable
              size="small"
            >
              <el-option
                v-for="item in clientList"
                :key="item.clientId"
                :label="item.clientName"
                :value="item.clientId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="用户账号" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入用户账号"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="用户名称" prop="nickName">
            <el-autocomplete
              v-model="queryParams.nickName"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入用户名称"
              size="small"
              clearable
              style="width:215px;"
              @clear="selectClear()"
              @select="handleSelect"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="手机号码" prop="phoneNumber">
            <el-input
              v-model="queryParams.phoneNumber"
              placeholder="请输入手机号码"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="用户状态"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in dict.type.sys_normal_disable"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item  label="用户类型" prop="userType" >
            <el-select v-model="queryParams.userType" size="small" clearable placeholder="请选择" @change="userTypechange">
              <el-option
                v-for="dict in dict.type.sys_user_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 215px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:user:add']"
            >新增</el-button>
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:user:edit']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:user:remove']"
            >删除</el-button>
          </el-col> -->
          <!-- <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-upload2"
              size="mini"
              @click="handleImport"
              v-hasPermi="['system:user:import']"
            >导入</el-button>
          </el-col> -->
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['system:user:export']"
            >导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange" >
          <!-- <el-table-column type="selection" width="50" align="center" /> -->
          <el-table-column label="用户编号" width="100" align="center" key="userId" prop="userId" v-if="columns[0].visible" />
          <el-table-column label="用户账号" width="160" key="userName" prop="userName" v-if="columns[1].visible" :show-overflow-tooltip="true" />
          <el-table-column label="用户名称" width="140"  key="nickName" prop="nickName" v-if="columns[2].visible" :show-overflow-tooltip="true" />
          <el-table-column label="所属应用" width="280"  key="clientId" prop="userContent" v-if="columns[3].visible" >
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark"  placement="top">
                <div class="text-ellipsis text-w280 text-copy" v-clipboard:copy="scope.row.userContent" v-clipboard:success="clipboardSuccess">
                  {{ scope.row.userContent }}
                </div>
                <span slot="content">
                  {{ scope.row.userContent}}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <!-- <el-table-column label="部门" align="center" key="deptName" prop="dept.deptName" v-if="columns[3].visible" :show-overflow-tooltip="true" /> -->
          <el-table-column label="手机号码" align="center" key="initPhoneNumber" prop="initPhoneNumber" width="120" />
          <el-table-column label="邮箱" align="left" key="email" prop="initEmail"  width="220" :show-overflow-tooltip="true" />
          <el-table-column label="用户类型" align="center" key="userType" prop="userType"  width="120" >
            <template slot-scope="scope">
            <dict-tag  :options="dict.type.sys_user_type" :value="scope.row.userType"/>
          </template>
          </el-table-column>
          <el-table-column label="状态" align="center" key="status" v-if="columns[5].visible">
            <template slot-scope="scope">
              <el-switch
                v-if="userId === 1"
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                :disabled="scope.row.userId === 1"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
              <dict-tag v-else :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[6].visible" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="240"
            fixed="right"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope" v-if="scope.row.userId !== 1">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:user:edit']"
              >修改</el-button>
              <!-- <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:user:remove']"
              >删除</el-button> -->
              <!-- v-hasPermi="['system:user:resetPwd', 'system:user:disable']" -->

              <el-button
                size="mini"
                type="text"
                icon="el-icon-key"
                v-if="!(scope.row.userType === '01')"
                v-hasPermi="['system:user:resetPwd']"
                 @click="handleCommand('handleResetPwd', scope.row)"
                >重置密码</el-button>
               <el-button
                size="mini"
                type="text"
                v-if="$store.getters.userId === 1 || !(scope.row.userAccounts.length === 0)"
                icon="el-icon-circle-check"
                @click="handleCommand('handleAuthCancel', scope.row)"
                v-hasPermi="['system.user.disable']"
                >取消授权</el-button>
             <!--  <el-dropdown size="mini"
               @command="(command) => handleCommand(command, scope.row)"
               v-hasPermi="['system:user:resetPwd', 'system:user:disable']"
               >
                <span class="el-dropdown-link">
                  <i class="el-icon-d-arrow-right el-icon--right"></i>更多
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                  command="handleResetPwd" icon="el-icon-key"
                  :disabled="scope.row.userType === '01' || scope.row.userType === '02'"
                  v-hasPermi="['system:user:resetPwd']">重置密码</el-dropdown-item>
                  <el-dropdown-item command="handleAuthRole" icon="el-icon-circle-check"
                    v-hasPermi="['system:user:edit']">分配角色</el-dropdown-item>
                     <el-dropdown-item
                      :disabled="scope.row.userAccounts.length === 0"
                      command="handleAuthCancel" icon="el-icon-circle-check"
                    v-hasPermi="['system.user.disable']">取消授权</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body :destroy-on-close="true">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="应用角色" prop="appRolesList">
              <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'app')">展开/折叠</el-checkbox>
              <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'app')">全选/全不选</el-checkbox>
              <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'app')">父子联动</el-checkbox>
              <el-tree
                class="tree-border"
                :data="appOptions"
                show-checkbox
                ref="appTree"
                node-key="id"
                :check-strictly="!form.menuCheckStrictly"
                empty-text="暂无数据"
                :props="defaultProps"
              ></el-tree>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <!-- <el-form-item v-if="form.userId == undefined" label="用户账号" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入用户账号" maxlength="50" />
            </el-form-item> -->
            <el-form-item v-if="formStatus === 'add'" label="用户账号" prop="userName">
              <NameOrIdAuto ref="nameOrIdAuto_2" styleCss="width:auto;"  @blurHandler="blurHandler" size="medium" @clearResultHandler="clearResultHandler" @selectResultHandler="selectResultHandler" :formData="form" bindKey="userName" realKey="userName" />
            </el-form-item>
            <el-form-item v-if="formStatus === 'edit'" label="用户账号" prop="userName">
              {{form.userName}}
            </el-form-item>
            <!-- <el-form-item v-if="form.userId" label="用户账号" prop="userName">
              {{form.userName}}
            </el-form-item> -->

          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined && form.userType !== '01' && form.userType !== '02'" label="用户密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码" type="password" maxlength="20" auto-complete="new-password" show-password/>
            </el-form-item>
          </el-col>
        </el-row>

          <!-- <el-col :span="12">
            <el-form-item label="归属部门" prop="deptId">
              <treeselect v-model="form.deptId" :options="deptOptions" :show-count="true" placeholder="请选择归属部门" />
            </el-form-item>
          </el-col> -->

        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入用户名称" maxlength="30" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" :prop="form.userType === '01'? 'phoneNumber' :''">
              <el-input v-model="form.phoneNumber" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" :prop="form.userType === '01'? 'email' :''">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="40" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  label="用户类型" prop="userType" >
              <el-select v-model="form.userType" placeholder="请选择"
              @change="userTypechange">
                <el-option
                  v-for="dict in dict.type.sys_user_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.sys_user_sex"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" label="用户账号" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入用户账号" maxlength="50" />
            </el-form-item>
            <el-form-item v-if="form.userId" label="用户账号" prop="userName">
              {{form.userName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined && form.userType !== '01' && form.userType !== '02'" label="用户密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码" type="password" maxlength="20" auto-complete="new-password" show-password/>
            </el-form-item>
          </el-col>
        </el-row> -->
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="form.roleIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的用户数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 取消授权 （去除用户在某个端的权限） -->
    <el-dialog title="取消授权" :visible.sync="authorizeFlag" width="600px" class="cancleDialog" append-to-body>
        <el-form ref="authorform" :model="authorizeParams" :rules="authorizeRules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="应用" prop="authoClientList">
              <el-checkbox v-model="authExpand" @change="handleCheckedTreeExpand($event, 'auth')">展开/折叠</el-checkbox>
              <el-checkbox v-model="authNodeAll" @change="handleCheckedTreeNodeAll($event, 'auth')">全选/全不选</el-checkbox>
              <el-checkbox v-model="authorizeParams.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'auth')">父子联动</el-checkbox>
              <el-tree
                class="tree-border"
                :data="authOptions"
                show-checkbox
                ref="authTree"
                node-key="id"
                :check-strictly="!authorizeParams.menuCheckStrictly"
                empty-text="加载中，请稍候"
                :props="defaultProps"
              ></el-tree>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAuthorize">确 定</el-button>
        <el-button @click="authorizeFlag = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUser, getUser, delUser, addUser, updateUser, resetUserPwd, changeUserStatus, getAppInfo, getUserClient, cancleAuthorize } from "@/api/system/user";
import NameOrIdAuto from '@/components/form-components/NameOrIdAuto/NameOrIdAuto'
import { getToken } from "@/utils/auth";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";


export default {
  name: "User",
  dicts: ['sys_normal_disable', 'sys_user_sex', 'sys_user_type'],
  components: { Treeselect, NameOrIdAuto },
  data() {
    var validatePass = (rule, value, callback) => {
      let arr = this.$refs.appTree.getCheckedKeys()
      if (arr.length == 0 || !arr) {
        callback(new Error("请勾选应用角色"));
      } else {
        callback();
      }
    }

    var validateClient = (rule, value, callback) => {
      let arr = this.$refs.authTree.getCheckedKeys()
      if (arr.length == 0 || !arr) {
        callback(new Error("请勾选需要取消都应用及客户端"));
      } else {
        callback();
      }
    }
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
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {
        clientId:''
      },
      formStatus: '', // 当前表单状态
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nickName: undefined, // 用户名称
        userName: undefined,
        phoneNumber: undefined,
        status: undefined,
        deptId: undefined,
        clientId: undefined,
        appId: undefined,
        userType: undefined
      },
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `用户账号`, visible: true },
        { key: 2, label: `用户名称`, visible: true },
        { key: 3, label: `所属应用`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `状态`, visible: true },
        { key: 6, label: `创建时间`, visible: true }
      ],
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户账号不能为空", trigger: "blur" },
          { min: 2, max: 50, message: '用户账号长度必须介于 2 和 50 之间', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" }
        ],
        appId: [
          { required: true, message: "应用名称不能为空", trigger: "blur" }
        ],
        clientId: [
          { required: true, message: "客户端名称不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" },
          { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
        ],
        email: [
          {
            required: true,
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur"]
          }
        ],
        phoneNumber: [
          {
            required: true,
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        appRolesList: [{ required: true, validator: validatePass, trigger: "change" }]
      },
      // 应用信息
      AppList: [],
      // 端信息
      clientList: [],
      // 应用下的端和角色
      appOptions: [],
      userAccounts: [],
      menuExpand: false,
      menuNodeAll: false,
      userInit: '',
      authorizeFlag: false,
      authorizeParams: {
        menuCheckStrictly: true
      },
      authorizeRules: {
        authoClientList: [{ required: true, validator: validateClient, trigger: "change" }]
      },
      authOptions: [],
      authExpand: false,
      authNodeAll: false,
      nickNameList: [],
      timeout: '' // 节流
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getAppList()
    this.getAppRolesList({dataLevel: 3})
    this.getList();
    this.getTreeselect();
    this.getConfigKey("sys.user.initPassword").then(response => {
      this.initPassword = response.msg;
    });
    setTimeout(() => {
      this.form.userName = '111111111'
    }, 5000)
    console.log('useruseruser')
  },
  computed: {
    userId() {
      return this.$store.getters.userId
    }
  },
  methods: {
    clipboardSuccess () {
      this.$modal.msgSuccess("复制成功");
    },
    selectClear () {
      document.activeElement.blur()
    },
    selectResultHandler (item) {
      this.form.nickName = item.nickName
      this.form.phoneNumber = item.phoneNumber
      this.form.email = item.email
      this.form.sex = item.sex
      this.form.remark = item.remark
      this.form.userId = item.userId
      this.form.userType = item.userType
      this.$refs.form.validateField('userName')
    },
    inputHandler () {
      console.log('inputHandler')
      this.$refs.form.validateField('userName')
    },
    blurHandler () {
      debugger
      console.log('ccccccccccccccc')
      console.log(this.form);
      this.$refs.form.validateField('userName')
    },
    clearResultHandler () {
      this.form.nickName = ''
      this.form.phoneNumber = ''
      this.form.email = ''
      this.form.sex = ''
      this.form.remark = ''
      this.form.userId = ''
      this.$refs.form.validateField('userName')
      this.$refs.form.validateField('nickName')
      this.$refs.form.validateField('phoneNumber')
      this.$refs.form.validateField('email')
    },
    querySearchAsync(queryString, cb) {
      clearTimeout(this.timeout)
      if (queryString) {
        console.log('1')
        this.timeout = setTimeout(async () => {
        let res = await this.getListByNickname()
        res && res.forEach((item) => {
          item.value = item.nickName + '/' + item.userName
        })
        var results = queryString ? res.filter(this.createStateFilter(queryString)) : res;
        cb(results);
      }, 200)
      } else {
        cb([])
      }
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log(item);
      this.queryParams.nickName = item.nickName
    },
    async getListByNickname () {
      let res = await listUser({
        nickName: this.queryParams.nickName
      })
      if (res && res.rows) {
        return res.rows
      }
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.userList = response.rows;
          console.log('this.userList',this.userList);
          this.userList.forEach (el => {
            el.userContent = ''
            if (el.phoneNumber) {
              el.initPhoneNumber = el.phoneNumber.slice(0,3) + "****" + el.phoneNumber.slice(7)
            }
            if (el.email) {
              console.log(el.email,);
              el.initEmail = el.email.slice(0,el.email.indexOf('@')-3) + "***" + el.email.slice(el.email.indexOf('@'))
            }
            if(el.userAccounts.length > 0) {
              el.userAccounts.forEach((item, index) => {
                item.content = item.appName + '-' + item.clientName + (index === el.userAccounts.length -1 ? '' : '，')
                el.userContent += item.content
              })
            }
          })
          this.total = response.total;
          this.loading = false;
          console.log(this.userList , '//////');
        }
      );
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      console.log(data, 'data');
      this.queryParams.deptId = data.id;
      this.handleQuery();
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$modal.confirm('确认要"' + text + '""' + row.userName + '"用户吗？').then(function() {
        return changeUserStatus(row.userId, row.status);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
       if (this.$refs.appTree != undefined) {
        this.$refs.appTree.setCheckedKeys([]);
      }
      this.menuExpand = false,
      this.menuNodeAll = false,
      this.form = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phoneNumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        userType: "01",
        remark: undefined,
        postIds: [],
        roleIds: [],
        clientId:undefined,
        userAccounts:[],
        menuCheckStrictly: true,
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
      this.dateRange = [];
      this.clientList = []
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        case "handleAuthRole":
          this.handleAuthRole(row);
          break;
        case "handleAuthCancel":
          this.handleAuthCancel(row);
          break;
        default:
          break;
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.appOptions = JSON.parse(JSON.stringify(this.appOptions))
      this.formStatus = 'add'
      getUser().then(response => {
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.open = true;
        this.$forceUpdate()
        this.$nextTick(() => {
          debugger
          setTimeout(() => {
            console.log('AAAAAAAAAAAAAAAAA')
            console.log(this.$refs.form.rules)
            this.$refs.form.rules.appRolesList[0].required = true
            this.$refs.form.rules.appRolesList[0].validator = (rule, value, callback) => {
              let arr = this.$refs.appTree.getCheckedKeys()
              if (arr.length == 0 || !arr) {
                callback(new Error("请勾选应用角色"));
              } else {
                callback();
              }
            }
          }, 100)
        })
        this.title = "添加用户";
        this.form.password = this.initPassword;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // 修改操作，取消应用授权验证
      this.reset();
      this.formStatus = 'edit'
      this.appOptions = JSON.parse(JSON.stringify(this.appOptions))
      const userId = row.userId || this.ids;
      getUser(userId).then(response => {
        debugger
        this.form = response.data;
        this.form.menuCheckStrictly = true
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.form.postIds = response.postIds;
        let roleIds = response.roleIds;
        roleIds.forEach((v) => {
          this.$nextTick(()=>{
              this.$refs.appTree.setChecked(v, true ,false);
          })
        })
        this.open = true;
        this.$nextTick(() => {
          debugger
          console.log('111111')
          this.$refs.form.rules.appRolesList[0].required = false
          this.$refs.form.rules.appRolesList[0].validator = undefined
          console.log(this.$refs['form'])
        })
        
        this.title = "修改用户";
        // this.form.password = "";
        this.userInit = this.form.userType
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        inputPattern: /^.{5,20}$/,
        inputErrorMessage: "用户密码长度必须介于 5 和 20 之间"
      }).then(({ value }) => {
          resetUserPwd(row.userId, value).then(response => {
            this.$modal.msgSuccess("修改成功，新密码是：" + value);
          });
        }).catch(() => {});
    },
    /** 分配角色操作 */
    handleAuthRole: function(row) {
      const userId = row.userId;
      this.$router.push("/system/user-auth/role/" + userId);
    },
    /** 提交按钮 */
    submitForm: function() {
      debugger
      console.log('this.form')
      console.log(this.form)
      this.$refs["form"].validate(valid => {
        debugger
        if (valid) {
          if (this.formStatus === 'edit') {
            console.log(this.form);
            this.form.roleIds = this.getAppAllCheckedKeys()
            this.form.userAccounts = this.userAccounts
            updateUser(this.form).then(response => {
              console.log(response, '编辑');
              if (response.userType === 1) {
                this.$modal.msgSuccess("修改成功，初始密码是：" + this.initPassword);
              }else {
                this.$modal.msgSuccess("修改成功");
              }
              this.open = false;
              this.getList();
            });
          } else {
            if (this.form.userType === '01' || this.form.userType === '02') {
              this.form.password = ''
            }
            this.form.roleIds = this.getAppAllCheckedKeys()
            this.form.userAccounts = this.userAccounts
            addUser(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      this.$modal.confirm('是否确认删除用户编号为"' + userIds + '"的数据项？').then(function() {
        return delUser(userIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/user/export', {
        ...this.queryParams
      }, `user_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('system/user/importTemplate', {
      }, `user_template_${new Date().getTime()}.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    /** 查询所有应用和端信息 dataLevel:2 (后端默认查询2)*/
    getAppList () {
      getAppInfo({dataLevel:2}).then(res => {
        console.log('获取所有应用信息', res);
        this.AppList = JSON.parse(JSON.stringify(res.data))
      })
    },
    /** 查询所有应用和端以及角色信息 dataLevel:3 */
    getAppRolesList (data) {
      getAppInfo(data).then(res => {
        console.log('获取所有应用端和角色信息dataLevel:3', res);
        this.appOptions = res.data
        // 修改数据格式；适应树形结构
        this.appOptions.forEach(el => {
          el.id = el.appId
          el.children = el.clientList || []
          el.label = el.appName
          el.children.forEach(j => {
            j.id = j.clientId
            j.label = j.clientName
            j.children = j.roleList || []
            j.children.forEach(k => {
              k.id = k.roleId
              k.label = k.roleName
            })
          })
        })
      })
    },
    /** 应用变化更换对应的端 */
    appChangeEvent (val) {
      console.log(val, 'val');
      this.queryParams.clientId = ''
      if (val) {
        this.clientList = this.AppList.filter(x => x.appId === val)[0].clientList
      } else {
        this.clientList = []
      }
      console.log(this.queryParams.clientId);
    },
    /** 点击应用树形节点 */
    getAppAllCheckedKeys () {
      let checkedNodes = this.$refs.appTree.getCheckedNodes()
      let checkedKeys = checkedNodes.filter(x=> !x.children)
      console.log(checkedKeys, 'checkedKeys');
      let checkedKeysIds = []
      let clientIdsArr = []
      this.userAccounts = []
      checkedKeys.forEach(el => {
        checkedKeysIds.push(el.id)
        if(clientIdsArr.indexOf(el.clientId) === -1) {
          clientIdsArr.push(el.clientId)
          this.userAccounts.push({
            appId:el.appId,
            clientId:el.clientId
          })
        }
      })
      return checkedKeysIds
    },
      // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type == 'app') {
        let treeList = this.appOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.appTree.store.nodesMap[treeList[i].id].expanded = value;
          console.log(treeList[i]);
          treeList[i].children.forEach(el => {
            this.$refs.appTree.store.nodesMap[el.id].expanded = value;
          })
        }
      } else if (type == 'auth') {
        let treeList = this.authOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.authTree.store.nodesMap[treeList[i].id].expanded = value;
          console.log(treeList[i]);
          treeList[i].children.forEach(el => {
            this.$refs.authTree.store.nodesMap[el.id].expanded = value;
          })
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == 'app') {
        this.$refs.appTree.setCheckedNodes(value ? this.appOptions: []);
      } else if (type == 'auth') {
        this.$refs.authTree.setCheckedNodes(value ? this.appOptions: []);
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type == 'app') {
        console.log(this.form.menuCheckStrictly, value)
        this.form.menuCheckStrictly = value ? true: false;
      } else if (type == 'auth') {
        this.authorizeParams.deptCheckStrictly = value ? true: false;
      }
    },
    /** 用户类型变化 00 普通用户 ；01 Portal 用户 02 HUC 用户 */
    userTypechange (val) {
      if (val === '00') {
        this.form.password = this.initPassword;
      }
    },
    /** 取消授权（删除的操作） */
    handleAuthCancel (row) {
      console.log(row, 'row');
      this.authOptions = []
      this.getUserAppClient(row.userId)
      this.authorizeParams.menuCheckStrictly = true
      this.authorizeParams.userId = row.userId
      this.authorizeFlag = true
      if (this.$refs.authTree != undefined) {
        this.$refs.authTree.setCheckedKeys([]);
      }
      this.authExpand = false
      this.authNodeAll = false
      this.resetForm("authorform")
    },
    /** 获取当前用户的授权应用和端 */
    getUserAppClient (userId) {
      getUserClient({userId: userId}).then(res => {
        console.log(res, '当前用户下应用和端');
        // 修改数据格式；适应树形结构
        this.authOptions = res.data
        this.authOptions.forEach(el => {
          el.id = el.appId
          el.children = el.clientList || []
          el.label = el.appName
          el.children.forEach(j => {
            j.id = j.clientId
            j.label = j.clientName
          })
        })
      })
    },
    // 取消授权提交
    submitAuthorize () {
      this.$refs["authorform"].validate(valid => {
        if (valid) {
          let params = {
            userId: this.authorizeParams.userId,
            appId:'',
            clientId:''
          }
          let checkedNodes = this.$refs.authTree.getCheckedNodes()
          let checkedKeys = checkedNodes.filter(x=> !x.children)
          let appIds = []
          let clientIds = []
          console.log(checkedKeys, 'checkedKeys',checkedNodes);
          checkedKeys.forEach(el => {
            appIds.push(el.appId)
            clientIds.push(el.clientId)
          })
          params.appId = appIds.join(',')
          params.clientId = clientIds.join(',')
          console.log(params, 'checkedNodes');
          cancleAuthorize(params).then(res => {
            console.log(res);
            this.$modal.msgSuccess("修改成功");
            this.authorizeFlag = false
            this.getList();
          })
        }
      })
    }
  }
};
</script>
<style>
.poperClass{
  position: absolute;
  background: #303133;
  min-width: 100px;
  max-width: 300px;
  border-radius: 4px;
  border: 1px solid #303133;
  padding: 10px;
  z-index: 2000;
  color: #fff;
  line-height: 1.2;
  text-align: justify;
  font-size: 12px;
  -webkit-box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  word-break: break-all;
}
.el-popper[x-placement^=top] .popper__arrow::after{
  border-top-color: #303133;
}
.el-popper[x-placement^=top] .popper__arrow {
  border-top-color: #303133;
}
.cancleDialog .el-dialog {
  margin-top: 20vh !important;
}
.app-title-name, .title-name{
  width: 220px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.app-title-name {
  width: 280px;
}
</style>
