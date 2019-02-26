import { Component, OnInit } from '@angular/core';
import { UtilService } from "../../../services/util.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import * as $ from "jquery";
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  //验证角色添加的表单
  validateAddRoleForm:FormGroup;
  //日期格式化
  dateFormat = 'yyyy-MM-dd';
  //当前页码
  pageIndex = 1;
  //每页显示记录数
  pageSize = 10;
  //总记录数
  total = 1;
  //数据集合
  dataSet = [];
  //是否加载...
  loading = true;
  roleName="";
  createTime:any;
  //添加角色
  isRoleAddVisible = false;//弹出框是否显示
  isRoleAddOkLoading = false;//确定按钮异步加载是否显示
  //角色授权
  isRoleResourceVisible=false;
  //默认选中的Key
  defaultCheckedKeys = [ "111","111_1" ];
  //指定选中的节点
  // defaultSelectedKeys = [ "111","111_1" ];

  nodes:any =[];
  checkEvent:any=null;
  roleId;
  constructor(private utilService:UtilService,private fb:FormBuilder) { }

  ngOnInit() {
    //分页表格查询
    this.searchData(false);
    //添加表单验证
    this.validateAddRoleForm = this.fb.group({
      addRoleName : [ null, [ Validators.required,Validators.pattern ],[ this.checkRoleNameIsExist ] ],
      addRemark   : [ null, [ Validators.required,Validators.pattern ] ]
    });

    
  }
  searchData(reset:any) {
    this.createTime= $("#createTime input").val();
    if (this.createTime==undefined  || this.createTime=="") {
      this.createTime="";
    }
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    var url="/getRolesByPages";
    var param:any={
      pageNo:this.pageIndex,
      pageSize:this.pageSize,
      roleName:this.roleName,
      createTime:this.createTime
    };
    this.utilService.doGet(url,param).then((data:any)=>{
      console.log(data);
      this.loading=false;
      //总记录数
      this.total=data.total;
      //数据记录
      this.dataSet=data.list
    });
    this.roleName="";
    this.createTime="";
  }
  
  showRoleAddModal(): void {
    this.isRoleAddVisible = true;
    this.isRoleAddOkLoading=false;
  }
  //判断角色名称是否存在
  checkRoleNameIsExist = (control: FormControl) => Observable.create((observer: Observer<ValidationErrors>) => {
    
    var url1="/getRoleByRoleName";
    var params1={
      roleName:$("#addRoleName").val()
    };
    this.utilService.doGet(url1,params1).then((data:any)=>{
      setTimeout(() => {
        if (data.msg=="success") {
          observer.next({ error: true, checkRoleName: true });             
        }else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });
      
  });
  //确定添加
  handleOk(): void {
    //触发form表单验证事件
    for (const i in this.validateAddRoleForm.controls) {
      this.validateAddRoleForm.controls[ i ].markAsDirty();
      this.validateAddRoleForm.controls[ i ].updateValueAndValidity();
    }
    var url1="/getRoleByRoleName";
    var params1={
      roleName:$("#addRoleName").val()
    };
    this.utilService.doGet(url1,params1).then((data:any)=>{
      if (data.msg=="error" && $("#addRemark").val() != "") {
        var url2="/addRole";
        var params2={
          roleName:$("#addRoleName").val(),
          remark:$("#addRemark").val()
        }
        this.utilService.doGet(url2,params2).then((data2:any)=>{
          this.isRoleAddOkLoading=true;
          if (data2.msg=="success") {
            this.isRoleAddOkLoading=false;
            this.utilService.createAlert("success","角色录入成功！");
            this.isRoleAddVisible =false;//关闭弹出框
            this.searchData(true);
          }
        });
      }
    });
    
    
  }

  handleCancel(e:MouseEvent): void {
    this.isRoleAddVisible = false;
    //表单验证重置
    this.validateAddRoleForm.reset();
    for (const key in this.validateAddRoleForm.controls) {
      this.validateAddRoleForm.controls[ key ].markAsPristine();
      this.validateAddRoleForm.controls[ key ].updateValueAndValidity();
    }
  }
  //确认删除
  deleteConfirm(roleId,roleName){
    var url="/deleteRoleById";
    var param={
      roleId:roleId
    }
    this.utilService.doGet(url,param).then((data:any)=>{
      if (data.msg=="success") {
        this.utilService.createAlert("success",roleName+"用户删除成功！");
        this.searchData(true);
      }
    });
  }
  //取消删除
  deleteCancel(){
    this.utilService.createAlert("warning","你已取消删除操作！");
  }
  //显示角色授权
  showRoleResourceModal(roleId){
    this.roleId=roleId;
    this.isRoleResourceVisible = true;
    this.getAllResource(roleId);
  }
  //角色授权取消
  roleResourceCancel(){
    this.isRoleResourceVisible=false;
  }
  //角色授权按确定
  roleResourceOk(){
    console.log(this.checkEvent );
    if (this.checkEvent!=null) {
      var url1="/deleteRoleResourceByRoleId";
      var param1={
        roleId:this.roleId
      };
      this.utilService.doGet(url1,param1).then((data:any)=>{
        if (data.msg=="success") {
          var url2="/addRoleResource";
          var param= {
            roleId:this.roleId,
            resourceId:null
          };
          for (let i = 0; i < this.checkEvent.keys.length; i++) {
            const resourceId = this.checkEvent.keys[i];
            param.resourceId=resourceId;
            this.utilService.doGet(url2,param).then((data:any)=>{
              this.isRoleResourceVisible=false;
            });
          }
          this.utilService.createAlert("success","角色授权成功！");
        }
      });
     
    }else{
      this.isRoleResourceVisible=false;
    }

  }
  
  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
    this.checkEvent=event;
  }
  //获取所有权限
  getAllResource(roleId){
    var url="/getAllResource";
    this.utilService.doGet(url,null).then((data:any)=>{
      if (data.msg=="success") {
        var a=[];
        var resource1:any=[];
        var resource2:any=[];
        for (let i = 0; i < data.result.length; i++) {
          var resource=data.result[i];
          if (resource.resourceId.length==3) {
           resource1.push(resource);
          }else{
            resource2.push(resource);
          }
        }
        for (let m = 0; m < resource1.length; m++) {
          const resource11 = resource1[m];
          var b={
            title   : null,
            key     : null,
            children: []
          }
          var title1=resource11.resourceName;
          var key1=resource11.resourceId;        
          b.title=title1;
          b.key=key1;
          var children=[];
          for (let n = 0; n < resource2.length; n++) {           
            const resource21 = resource2[n];
            var title2=resource21.resourceName;
            var key2=resource21.resourceId;
            var isLeaf2=true;          
            if (resource21.parmaterId==resource11.resourceId) {
              b.children.push({title:title2,key:key2,isLeaf:isLeaf2});
            }
          }
          a.push(b);  
        }
        this.nodes=a;
        var url2="/getRoleResourceByRoleId";
        var params2={
              roleId:roleId
        };
        var selectKeys=[];
        this.utilService.doGet(url2,params2).then((data2:any)=>{
          if (data2.msg=="success") {
            for (let i = 0; i < data2.result.length; i++) {
              const element = data2.result[i].resourceId;
              if (element.length!=3) {
                selectKeys.push(element);
              }
            }
            this.defaultCheckedKeys = selectKeys;
          }
          
        });
        
      }  
    });
   
    
  }

}
