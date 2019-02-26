import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Router } from "@angular/router";
//引入service工具包
import { UtilService } from "../../services/util.service";
//引入cookie
import { CookieService } from 'ngx-cookie-service';
//引入PlatformLocation，获取当前URL
import { PlatformLocation} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

   validateForm: FormGroup;
   userName:any;
   password:any;
   remember:true;
   nowURL:any;
   
   
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    console.log(this.validateForm.controls);
    this.utilService.createLoading("登录中...",200);
    this.checkUser();
  } 

  constructor(private fb: FormBuilder,private utilService:UtilService,private router:Router,private cookie:CookieService,private locationUrl:PlatformLocation) { 

  }

  ngOnInit() {
    this.nowURL=this.locationUrl['location'].href;   
    this.validateForm = this.fb.group({    
      userName: [ null, [ Validators.required,Validators.pattern] ],
      password: [ null, [ Validators.required,Validators.pattern ] ],
      remember: [ true ]
    });
  }

  //登陆验证
  checkUser(){
    var url:any="/login";
    var json:any={
      userName:this.userName,
      password:this.password
    };
    this.utilService.doGet(url,json).then((data:any)=>{
      if (data!=null) {
          //是否选中自动登录，如果选中
        if(this.remember){
          //cookie中是否有数据
          if (this.cookie.get("beforLoginUser")) {
            //cookie中存放的历史登录用户数据
            var historyCookieData=this.cookie.get("beforLoginUser");
            //输入的登录用户数据
            var nowLoginData:any={
              userName:data.result.userName,
              password:data.result.password
            }
            nowLoginData=JSON.stringify(nowLoginData);
            //判断cookie中的数据是否和输入的用户数据相等
            if (historyCookieData==nowLoginData) {
              this.utilService.createAlert("success","自动登录成功！");
              //封装放入cookie的数据
              var beforLoginUser:any={
                userName:data.result.userName,
                password:data.result.password
              }
              console.log("放入cookie的值："+this.utilService.compileStr(JSON.stringify(beforLoginUser) ) );
              //把登录的用户信息放到localStorage
              this.utilService.setItem("afterLoginUser",this.utilService.compileStr(JSON.stringify(data.result)));
              this.router.navigate([this.nowURL]);
            }else{
              if (data.msg=="success") {
                this.utilService.createAlert("success","登录成功！");
                //封装放入cookie的数据
                var beforLoginUser:any={
                  userName:data.result.userName,
                  password:data.result.password
                }
                console.log("放入cookie的值："+this.utilService.compileStr(JSON.stringify(beforLoginUser) ) );
                //放入cookie中，过期日为7天
                this.cookie.set("beforLoginUser",this.utilService.compileStr(JSON.stringify(beforLoginUser)),1);
                //把登录的用户信息放到localStorage
                this.utilService.setItem("afterLoginUser",this.utilService.compileStr(JSON.stringify(data.result)));
                this.router.navigate(["/index/main"]);
              }else{
                this.utilService.createAlert("error","用户名或密码错误，登录失败！");
              }
            }
          }else{
            if (data.msg=="success") {
              this.utilService.createAlert("success","登录成功！");
              //封装放入cookie的数据
              var beforLoginUser:any={
                userName:data.result.userName,
                password:data.result.password
              }
              console.log("放入cookie的值："+this.utilService.compileStr(JSON.stringify(beforLoginUser) ) );
              //放入cookie中，过期日为7天
              this.cookie.set("beforLoginUser",this.utilService.compileStr(JSON.stringify(beforLoginUser)),1);
              //把登录的用户信息放到localStorage
              this.utilService.setItem("afterLoginUser",this.utilService.compileStr(JSON.stringify(data.result)));
              this.router.navigate(["/index/main"]);
            }else{
              this.utilService.createAlert("error","用户名或密码错误，登录失败！");
            }
          }
          
        }else{
          if (data.msg=="success") {
            this.utilService.createAlert("success","登录成功！");
            //把登录的用户信息放到localStorage
            this.utilService.setItem("afterLoginUser",this.utilService.compileStr(JSON.stringify(data.result)));
            this.router.navigate(["/index/main"]);
          }else{
            this.utilService.createAlert("error","用户名或密码错误，登录失败！");
          }
        }
      }else{
        this.utilService.createAlert("error","接口服务器连接异常，请检查！");
      }
    });
  }

}
