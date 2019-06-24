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
import { PlatformLocation } from '@angular/common';
//导入jquery
import * as $ from "jquery";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  validateForm: FormGroup;
  validateRegistForm: FormGroup;
  userName: any;
  password: any;
  remember: true;
  nowURL: any;
  //注册modal
  isRegistVisible = false;
  isOkLoading = false;

  resValidateCode;
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    console.log(this.validateForm.controls);
    this.utilService.createLoading("登录中...", 200);
    this.checkUser();
  }

  constructor(private fb: FormBuilder, private utilService: UtilService, private router: Router, private cookie: CookieService, private locationUrl: PlatformLocation) {

  }

  ngOnInit() {
    this.nowURL = this.locationUrl['location'].href;
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required, Validators.pattern]],
      password: [null, [Validators.required, Validators.pattern]],
      remember: [true]
    });
    this.validateRegistForm = this.fb.group({
      phoneNumberPrefix: ['+86'],
      userName: [null, [Validators.required, Validators.pattern]],
      password: [null, [Validators.required, Validators.pattern]],
      checkPassword: [null, [Validators.required, this.confirmationValidator, Validators.pattern]],
      phoneNumber: [null, [Validators.required, this.mobileValidator]],
      captcha: [null, [Validators.required]]
    });

  }

  //登陆验证
  checkUser() {
    var url: any = "/login";
    var json: any = {
      userName: this.userName,
      password: this.password
    };
    this.utilService.doGet(url, json).then((data: any) => {
      if (data != null) {
        //是否选中自动登录，如果选中
        if (this.remember) {
          //cookie中是否有数据
          if (this.cookie.get("beforLoginUser")) {
            //cookie中存放的历史登录用户数据
            var historyCookieData = this.cookie.get("beforLoginUser");
            //输入的登录用户数据
            var nowLoginData: any = {
              userName: data.result.userName,
              password: data.result.password
            }
            nowLoginData = JSON.stringify(nowLoginData);
            //判断cookie中的数据是否和输入的用户数据相等
            if (historyCookieData == nowLoginData) {
              this.utilService.createAlert("success", "自动登录成功！");
              //封装放入cookie的数据
              var beforLoginUser: any = {
                userName: data.result.userName,
                password: data.result.password
              }
              console.log("放入cookie的值：" + this.utilService.compileStr(JSON.stringify(beforLoginUser)));
              //把登录的用户信息放到localStorage
              this.utilService.setItem("afterLoginUser", this.utilService.compileStr(JSON.stringify(data.result)));
              this.router.navigate([this.nowURL]);
            } else {
              if (data.msg == "success") {
                this.utilService.createAlert("success", "登录成功！");
                //封装放入cookie的数据
                var beforLoginUser: any = {
                  userName: data.result.userName,
                  password: data.result.password
                }
                console.log("放入cookie的值：" + this.utilService.compileStr(JSON.stringify(beforLoginUser)));
                //放入cookie中，过期日为7天
                this.cookie.set("beforLoginUser", this.utilService.compileStr(JSON.stringify(beforLoginUser)), 1);
                //把登录的用户信息放到localStorage
                this.utilService.setItem("afterLoginUser", this.utilService.compileStr(JSON.stringify(data.result)));
                this.router.navigate(["/index/main"]);
              } else {
                this.utilService.createAlert("error", "用户名或密码错误，登录失败！");
              }
            }
          } else {
            if (data.msg == "success") {
              this.utilService.createAlert("success", "登录成功！");
              //封装放入cookie的数据
              var beforLoginUser: any = {
                userName: data.result.userName,
                password: data.result.password
              }
              console.log("放入cookie的值：" + this.utilService.compileStr(JSON.stringify(beforLoginUser)));
              //放入cookie中，过期日为7天
              this.cookie.set("beforLoginUser", this.utilService.compileStr(JSON.stringify(beforLoginUser)), 1);
              //把登录的用户信息放到localStorage
              this.utilService.setItem("afterLoginUser", this.utilService.compileStr(JSON.stringify(data.result)));
              this.router.navigate(["/index/main"]);
            } else {
              this.utilService.createAlert("error", "用户名或密码错误，登录失败！");
            }
          }

        } else {
          if (data.msg == "success") {
            this.utilService.createAlert("success", "登录成功！");
            //把登录的用户信息放到localStorage
            this.utilService.setItem("afterLoginUser", this.utilService.compileStr(JSON.stringify(data.result)));
            this.router.navigate(["/index/main"]);
          } else {
            this.utilService.createAlert("error", "用户名或密码错误，登录失败！");
          }
        }
      } else {
        this.utilService.createAlert("error", "接口服务器连接异常，请检查！");
      }
    });
  }
  //显示注册Modal
  showRegistModal(): void {
    this.isRegistVisible = true;
  }
  //单击确定按钮提交
  handleOk(): void {

    this.submitRegistForm();
    this.isOkLoading = true;

    this.isRegistVisible = false;
    this.isOkLoading = false;

  }
  //单击取消按钮或×号
  handleCancel(): void {
    this.isRegistVisible = false;
  }
  //手机号验证
  mobileValidator(control: FormControl): any {
    const mobileReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))|(17[0-9]{1})+\d{8})$/;
    const result = mobileReg.test(control.value);
    if (!control.value) {
      return { required: true };
    } else if ( !mobileReg.test(control.value)) {
      return { checkMobile: true, error: true };
    }
    // const mobileReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))|(17[0-9]{1})+\d{8})$/;
    // const result = mobileReg.test(control.value);
    return {};
  };

  //两次密码验证
  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateRegistForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };
  //注册提交
  submitRegistForm() {
    for (const i in this.validateRegistForm.controls) {
      this.validateRegistForm.controls[i].markAsDirty();
      this.validateRegistForm.controls[i].updateValueAndValidity();
    }
    console.log(this.resValidateCode + "-------" + $("#captcha").val());
    if (this.resValidateCode == $("#captcha").val()) {
      this.utilService.createAlert("success", "验证码匹配成功！");
      this.validateRegistForm.reset();
      this.handleCancel();

    } else {
      this.utilService.createAlert("error", "验证码匹配失败！");
    }
  }
  //单击获取验证码
  getCaptcha() {
    var url = "/sendValidateCode";
    var params = {
      mobile: $("#phoneNumber").val()
    }
    this.utilService.doGet(url, params).then((data: any) => {
      if (data.result == "success") {
        this.utilService.createAlert("success", "验证码已发送成功！");
        this.resValidateCode = data.resCode;
      }
    });
    var that = $("#getCodeBtn");
    var timeS = 60;
    var timeStop = setInterval(function () {
      timeS--;
      if (timeS > 0) {
        that.text('重新发送' + timeS + 's');
        that.attr('disabled', 'disabled');
        //禁止点击 
      } else {
        //当减到0时赋值为60
        timeS = 60;
        that.text('获取验证码');
        //清除定时器 
        clearInterval(timeStop);
        //移除属性，可点击
        that.removeAttr('disabled');
      }
    }, 1000)
  }
}
