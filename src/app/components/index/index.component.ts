import { Component, OnInit } from '@angular/core';
//引入PlatformLocation，获取当前URL
import { PlatformLocation} from '@angular/common';
import { UtilService } from 'src/app/services/util.service';
//引入cookie
import { CookieService } from 'ngx-cookie-service';

import { Router } from "@angular/router";
//创建确认对话框
import { NzModalService } from 'ng-zorro-antd';
//引入jquery
import * as $ from "jquery";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})

export class IndexComponent implements OnInit {
  isUpUserPwdLoading=false;
  nowURL:any;
  loginUser:any;
  cookieUser:any;
  //我的信息弹出框
  visible = false;
  //修改密码弹出框
  visibleUpPwd=false;
  placement = 'right';

  validateUpPwdForm: FormGroup;

  constructor(private locationUrl:PlatformLocation,private utilService:UtilService,private cookieService:CookieService,
    private router:Router,private modalService:NzModalService,private fb: FormBuilder,) { }

  ngOnInit() {
    //获取输入的URL
    this.nowURL=this.locationUrl['location'].hash;
    this.nowURL=this.nowURL.replace("#","");
    //获取登录时放入localstorage中的用户信息
    this.loginUser=this.utilService.getItem("afterLoginUser") ;
    //获取cookie中的信息
    this.cookieUser=this.cookieService.get("beforLoginUser");
    if (this.loginUser==null) {
      this.checkHasCookie(this.cookieUser);
      this.utilService.createAlert("error","对不起，您还未登录！");
      this.router.navigate(["/login"]);
    }else{
      this.router.navigate([this.nowURL]);
      this.loginUser=JSON.parse(this.utilService.unCompileStr(this.loginUser))
    }

    //修改密码验证
    this.validateUpPwdForm = this.fb.group({
      password         : [ null, [ Validators.required, Validators.pattern] ],
      checkPassword    : [ null, [ Validators.required,  Validators.pattern,this.confirmRePwd ] ]
    });
  }
  //检查是否有用户的cookie信息
  checkHasCookie(cookieData){ 
    if (cookieData!="") {
      this.utilService.createLoading("自动登录中...",100);
      this.router.navigate([this.nowURL]);
    }
  }
  //打开我的信息
  openMyInfo(){
    this.visible = true;

  }
  //关闭我的信息
  closeMyInfo(){
    this.visible = false;
  }
  //打开修改密码
  openUpPwd(){
    this.validateUpPwdForm.reset();
    this.visibleUpPwd=true;
  }
  closeUpPwd(){
    this.visibleUpPwd=false;
  }
    /**
   * 创建确认对话框
   */
  createConfirm(){

    this.modalService.confirm({
      nzTitle     : '退出提示',
      nzContent   : '<b style="color: red;">你确定要退出本系统吗？</b>',
      nzOkText    : '确定',
      nzOkType    : 'primary',
      nzOnOk      :()=>this.logOut(),
      nzCancelText: '取消',
      nzOnCancel  : () => console.log('你已取消退出！')
    });
  }
  /**
   * 退出本系统
   */
  logOut(){
    var url:any="/logOut";
    this.utilService.doGet(url,null).then((data:any)=>{
      console.log(data);
      if (data.msg=="success") {
        this.router.navigate(["/login"]);
      }
    });
  }

  //修改密码
  submitForm(): void {
    
    for (const i in this.validateUpPwdForm.controls) {
      this.validateUpPwdForm.controls[ i ].markAsDirty();
      this.validateUpPwdForm.controls[ i ].updateValueAndValidity();
    }
    var userId=$("#userId").val();
    var password=$("#password").val();
    var repassword=$("#checkPassword").val();
    var url="/updateUserPwdById";
    var param:any={
      userId:userId,
      password:password
    };
    
    if (password==repassword && password != "" && repassword != "") {
      this.isUpUserPwdLoading=true;
      this.utilService.doGet(url,param).then((data:any)=>{
        if (data.msg=="success") {
        setTimeout(_ => {
          this.isUpUserPwdLoading = false;
        }, 1500);
          this.utilService.createAlert("success","密码修改成功！");
          this.closeUpPwd();
        }else{
          this.utilService.createAlert("error","密码修改失败，请刷新重试！");
        }
      });
    }
    
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateUpPwdForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmRePwd = (control: FormControl): { [ s: string ]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateUpPwdForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  };

  


   
  
}
