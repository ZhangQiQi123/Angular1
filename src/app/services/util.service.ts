import { Injectable } from '@angular/core';
//httpClient的get或post请求
import { HttpClient,HttpHeaders } from "@angular/common/http";
// 全局提示框
import { NzMessageService  } from 'ng-zorro-antd';

//引入PlatformLocation，获取当前URL
import { PlatformLocation} from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class UtilService {

  
  //域名（项目名）
  public api="http://127.0.0.1:8080/Springboot_Mybatis";
  //请求|响应头
  public httpHeaders=new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
  /**
   * 构造器
   * @param httpClient httpClient
   * @param message 提示框
   */
  constructor(private httpClient:HttpClient,private message:NzMessageService) { }

   /**
   * 给localStorage赋值（登录人信息）
   * @param key 
   * @param value 
   */
  setItem(key,value){
    localStorage.setItem(key,JSON.stringify(value));
  }
  /**
   * 根据存储的Key 得到对应的存储数据
   * @param key 
   */
  getItem(key){
    return JSON.parse(localStorage.getItem(key));
  }
  /**
   * 删除存储在localStorage中的数据
   * @param key 
   */
  removeItem(key){
    localStorage.removeItem(key);
  }

   /**
   * httpClient 的get请求
   * @param url 
   */
  doGet(url,json){
    var api=this.api+url;
    return new Promise((resolve,reject)=>{
      this.httpClient.get(api,{params:json}).subscribe((data) => {
        resolve(data);
      },(errorData)=>{
        this.createAlert("error","接口服务器连接异常，请检查！");
        reject(errorData);
      });
    });
  }
   /**
   * httpClient.post请求
   * @param url 
   * @param json 传入后台的数据
   */
  doPost(url,json){
    var api=this.api+url;
    return new Promise((resolve,reject)=>{
      this.httpClient.post(api,JSON.stringify(json),{headers:this.httpHeaders}).subscribe((data) => {
        resolve(data);
      },(errorData)=>{
        console.log(errorData);
        reject(errorData);
      });
    });
  } 
  //序列化对象或数组,返回字符串
  transformRequest(data) {
    var str = '';
    for (var i in data) {
      str += i + '=' + data[i] + '&';
    }
    str.substring(0, str.length - 1);
    return str;
  };

  /**
   * 格式化日期（分页查询的日期显示）
   * @param strTime 
   */
  FormatDate (strTime) {
    var date = new Date(strTime);
    return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
  }

  /**
   * 创建弹出提示框（表单提交完成使用）
   * @param type ：success：成功；error：错误；warning：警告
   * @param msg  : "操作成功！"；"操作失败！"；"警告！"；
   */
  createAlert(type: string,msg:string): void {
    this.message.create(type, msg,{ nzDuration: 1000 });
  }
   
  /**
   * 创建全局loading提示框
   * @param msg 执行中... eg：登陆中...
   * @param timeout 停留时间 单位：ms eg:300
   */
  createLoading(msg:any,timeout:any) {
    var id = this.message.loading(msg, { nzDuration: 0 }).messageId;
    setTimeout( ()=> {
      this.message.remove(id);
    }, timeout);
  }
  /**
   * 对字符串进行加密 
   * @param code :要加密的字符串
   */      
  compileStr(code){
    var c=String.fromCharCode(code.charCodeAt(0)+code.length);
    for(var i=1;i<code.length;i++)
      {      
      c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));
    }   
    return escape(c);   
  }

  
  /**
   * 对字符串进行解密 
   * @param code :要解密的字符串
   */
  unCompileStr(code){      
    code=unescape(code);      
    var c=String.fromCharCode(code.charCodeAt(0)-code.length);      
    for(var i=1;i<code.length;i++)
    {      
     c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));      
    }      
    return c;   
  }

  /**
   * 对JSON数据进行加密
   * @param json json数据
   */
  compileJson(jsonData:any){
    return escape(JSON.stringify(jsonData));
  }
  /**
   * 对加过密的json数据进行解密
   * @param compileJsonData json数据加过密的字符串
   */
  unCompileJson(compileJsonData:any){
    return JSON.parse(unescape(compileJsonData));
  }


}
