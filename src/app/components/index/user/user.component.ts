import { Component, OnInit } from '@angular/core';
import { UtilService } from "../../../services/util.service";
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup
} from '@angular/forms';
import * as $ from "jquery";
import { parse } from 'url';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userInfoIsVisible = false;
  isUpUserLoading = false;
  indexUserInfo:any={};
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
  constructor(private utilService:UtilService,private fb: FormBuilder) { }

  ngOnInit() {
    //获取所有角色
    this.getAllRoles();
    //查询所有数据
    this.searchData(false);

   
  }
  searchData(reset:any) {
    this.createTime= $("#createTime input").val();
    if (this.createTime==undefined  || this.createTime=="") {
      this.createTime="";
    }
    console.log(this.userName+"  "+this.roleId+"  "+this.createTime); 
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
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
      if (data.msg=="success") {
        this.indexUserInfo={
          userId:data.result.userId,
          userName:data.result.userName,
          roleId:(data.result.role.roleId).toString(),
          phone:data.result.phone,
          createTime:data.result.createTime,
          updateTime:data.result.updateTime
        };  
      }else{
        this.utilService.createAlert("error","数据连接异常，请刷新后重试!");
      }
    });
  }

  
  handleOk(userId): void {
    this.isUpUserLoading = true;
    var url="/updateUserPwdById";
      this.utilService.doGet(url,this.indexUserInfo).then((data:any)=>{
        console.log(data);
      });
    window.setTimeout(() => {
      this.userInfoIsVisible = false;
      this.isUpUserLoading = false;
      this.searchData(false);
    }, 1500);
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.userInfoIsVisible = false;
  }


}
