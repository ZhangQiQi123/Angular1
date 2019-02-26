import { Component, OnInit } from '@angular/core';
import { UtilService } from "../../../services/util.service";
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import * as $ from "jquery";
import { parse } from 'url';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  validateAddUserForm: FormGroup;
  userInfoIsVisible = false;
  isUpUserLoading = false;
  userAddIsVisible=false;
  isAddUserLoading=false;
  indexUserInfo:any={};
  // addUser:any={};
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
  userName="";
  roleId="";
  createTime:any;
  //多条件查询表单
  validateForm: FormGroup;
  controlArray = [];
  isCollapse = true;
  //所有角色
  roles=[];

  //添加表单
  addUserName:any;
  addRoleId:any;
  addPassword:any;
  addRePassword:any;
  addPhone:any;
  addPrice:any;

  constructor(private utilService:UtilService,private fb: FormBuilder) { }

  ngOnInit() {
    //获取所有角色
    this.getAllRoles();
    //查询所有数据
    this.searchData(false);
    //添加表单验证
    this.validateAddUserForm = this.fb.group({
      addUserName : [ null, [ Validators.required,Validators.pattern ],[ this.checkUserNameIsExist ] ],
      addRoleId   : [ null, [ Validators.required ] ],
      addPhone    : [ null, [ Validators.required,Validators.pattern ] ],
      addPwd      : [ null, [ Validators.required,Validators.pattern ] ],
      addRePwd    : [ null, [ Validators.required,Validators.pattern,this.confirmRePwd ] ],
      addPrice    : [ null, [ Validators.required,Validators.pattern ] ]
    });
   
  }
  searchData(reset:any) {
    this.loading = true;
    this.createTime= $("#createTime input").val();
    if (this.createTime==undefined  || this.createTime=="") {
      this.createTime="";
    }
    if (reset) {
      this.pageIndex = 1;
    }
 
    var url="/getAllUserByPage";
    var param:any={
      pageNo:this.pageIndex,
      pageSize:this.pageSize,
      userName:this.userName,
      roleId:this.roleId,
      createTime:this.createTime
    };
    this.utilService.doGet(url,param).then((data:any)=>{
      console.log(data);
      this.loading=false;
      this.total=data.total;
      this.dataSet=data.list
    });
    this.userName="";
    this.roleId="";
    this.createTime="";
  }


  //获取所有角色
  getAllRoles(){
    var url="/getAllRoles";
    this.utilService.doGet(url,null).then((data:any)=>{
      this.roles=data.result;
    });
  }
  //显示用户信息
  showUserInfoModal(userId) {
    this.userInfoIsVisible = true;
    var url="/getUserById";
    this.utilService.doGet(url,{userId:userId}).then((data:any)=>{
      console.log(data);
      if (data.msg=="success") {
        this.indexUserInfo={
          userId:data.result.userId,
          userName:data.result.userName,
          roleId:(data.result.role.roleId).toString(),
          phone:data.result.phone,
          createTime:data.result.createTime,
          updateTime:data.result.updateTime,
          password:data.result.password,
          price:data.result.price
        };  
      }
    });
  }

  //修改确认
  upUserOk(userId): void {
    this.isUpUserLoading = true;
    var url="/updateUserInfoById";
      this.utilService.doGet(url,this.indexUserInfo).then((data:any)=>{
        if(data.msg=="success"){
          this.utilService.createAlert("success","修改用户信息成功！");
          this.searchData(true);
        }else{
          this.utilService.createAlert("error","修改用户信息失败！");
        }
      });
    window.setTimeout(() => {
      this.userInfoIsVisible = false;
      this.isUpUserLoading = false;

    }, 500);
  }
  //修改取消
  upUserCancel(): void {
    this.userInfoIsVisible = false;
  }
  //删除取消
  deleteCancel(): void {
    this.utilService.createAlert("warning","你已取消删除操作！")
  }
  //删除确认
  deleteConfirm(userId,userName): void {
    var url="/deleteUserById";
    var param={
      userId:userId
    }
    this.utilService.doGet(url,param).then((data:any)=>{
      if (data.msg=="success") {
        this.utilService.createAlert("success",userName+"用户删除成功！");
        this.searchData(true);
      }
    });
  }
  //显示用户录入
  showUserAddModal(){
    this.userAddIsVisible=true;
    this.isAddUserLoading=false;
  }
  //判断用户名是否已经存在
  checkUserNameIsExist= (control: FormControl) => Observable.create((observer: Observer<ValidationErrors>) => {
    var url="/getUserByUserName";
    var aaa=$("#addUserName").val();
    var param={
      userName:aaa
    };    
    this.utilService.doGet(url,param).then((data:any)=>{
      // console.log(data.msg);
      setTimeout(() => {
        if (data.msg == 'success') {
          observer.next({ error: true, checkUserName: true });
        } else {
          //添加用户
         var param={
          userName:this.addUserName,
          roleId:this.addRoleId,
          password:this.addPassword,
          phone:this.addPhone,
          price:this.addPrice
        };
        //如果两次密码输入一致
        if (this.addPassword==this.addRePassword && this.addRoleId!=undefined && this.addPhone!=undefined && this.addPrice!=undefined && this.addPassword!=undefined && this.addRePassword!=undefined) {
          this.isAddUserLoading = true;
          this.utilService.doGet("/addUser",param).then((data2:any)=>{
            if (data2.msg=="success") {
              this.utilService.createAlert("success","用户录入成功！");
              setTimeout(() => {
                this.userAddIsVisible=false;
                this.isAddUserLoading=false;
              }, 1000);
              this.searchData(true);
            }
          });       
        }
          observer.next(null);     
        }         
        observer.complete();
      },1000);
    });
    
  });
  //验证两次密码是否一致
  confirmRePwd = (control: FormControl): { [ s: string ]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateAddUserForm.controls.addPwd.value) {
      return { checkRePwd: true, error: true };
    }
  };

  //确定添加
  addUserOk(){
    //触发form表单验证事件
    for (const i in this.validateAddUserForm.controls) {
      this.validateAddUserForm.controls[ i ].markAsDirty();
      this.validateAddUserForm.controls[ i ].updateValueAndValidity();
    }
    
  }
  //取消添加
  addUserCancel(e:MouseEvent){
    this.userAddIsVisible=false;
    //表单验证重置
    this.validateAddUserForm.reset();
    for (const key in this.validateAddUserForm.controls) {
      this.validateAddUserForm.controls[ key ].markAsPristine();
      this.validateAddUserForm.controls[ key ].updateValueAndValidity();
    }
  }
}
