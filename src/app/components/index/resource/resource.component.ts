import { Component, OnInit } from '@angular/core';
import { UtilService } from "../../../services/util.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import * as $ from "jquery";
import { Observable, Observer } from 'rxjs';
@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css']
})
export class ResourceComponent implements OnInit {

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
   resourceName="";
   resourceUrl="";
   createTime:any;
   
  //添加权限
  isResourceAddVisible = false;//弹出框是否显示
  isResourceAddOkLoading = false;//确定按钮异步加载是否显示
  validateAddResourceForm:FormGroup;
  //权限名称
  addResourceName:any=null;
  //菜单类型集合
  resourceTypes:any=null;
  //父节点集合
  paramaterIds:any=null
  //菜单类型
  addResourceTypeId:any=null;
  //父节点
  addResourceParmaterId:any=null;
  //权限URL
  addResourceUrl:any=null;
  //备注
  addRemark:any=null;


  constructor(private utilService:UtilService,private fb:FormBuilder) { }

  ngOnInit() {
    //分页表格查询
    this.searchData(false);
    //查询所有菜单类型
    this.getAllResourceType();
      //添加表单验证
      this.validateAddResourceForm = this.fb.group({
      addResourceName       : [ null, [ Validators.required,Validators.pattern ],[ this.checkResourceNameIsExist ] ],
      addResourceTypeId     : [ null, [ Validators.required ]],
      addRemark             : [ null, [ Validators.required] ],
      addResourceParmaterId : [ null, [ Validators.required] ],
      addResourceUrl        : [ null, [ Validators.required] ]
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
    
    var url="/getResourceByPage";
    var param:any={
      pageNo:this.pageIndex,
      pageSize:this.pageSize,
      resourceName:this.resourceName,
      resourceUrl:this.resourceUrl,
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
    this.resourceName="";
    this.resourceUrl="";
    this.createTime="";
  }
  //弹出添加的表单
  showResourceAddModal(){
    this.isResourceAddVisible=true;
    
  }

 
  //获取所有菜单类型
  getAllResourceType(){
    var that=this;
    var url="/getAllResourceType";
    this.utilService.doGet(url,null).then((data:any)=>{
      that.resourceTypes=data.result;
    });
  }
  //判断权限名称是否存在
  checkResourceNameIsExist = (control: FormControl) => Observable.create((observer: Observer<ValidationErrors>) => {
    var url1="/getResourceByResourceName";
    var params1={
      resourceName:$("#addResourceName").val()
    };
    this.utilService.doGet(url1,params1).then((data:any)=>{
      setTimeout(() => {
        if (data!=null) {
          observer.next({ error: true, checkResourceName: true });             
        }else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });
      
  });
  //菜单类型与父节点关联
  resourceTypeChange(value: string): void {
    console.log(value);
    var url="/getResourceByParamater";
    if (value == "2") {
      $("#parameterNode").css({display:"inline"});
      this.utilService.doGet(url,null).then((data:any)=>{
        console.log(data);
        if (data!=null) {
          this.paramaterIds=data;
        }
      });
    }else{
      $("#parameterNode").css({display:"none"});
      this.addResourceParmaterId="";
      this.paramaterIds=null;
    }
    // this.addResourceParmaterId = this.cityData[ value ][ 0 ];
  }
   //权限确认添加
   handleOk(){
    // this.isResourceAddOkLoading=true;
    //触发form表单验证事件
    for (const i in this.validateAddResourceForm.controls) {
      this.validateAddResourceForm.controls[ i ].markAsDirty();
      this.validateAddResourceForm.controls[ i ].updateValueAndValidity();
    }
    console.log("名称："+this.addResourceName+",类型："+this.addResourceTypeId+",url:"+this.addResourceUrl+",父节点："+this.addResourceParmaterId+",备注："+this.addRemark);
    var url1="/getResourceByResourceName";
    var params1={
      resourceName:$("#addResourceName").val()
    };
    var url2="";
    var params2={
      resourceName:this.addResourceName,
      resourceTypeId:this.addResourceTypeId,
      resourceUrl:this.addResourceUrl,
      resourceParameterId:this.addResourceParmaterId,
      remark:this.addRemark
    }
    this.utilService.doGet(url1,params1).then((data:any)=>{
        if (data==null && params2.resourceName != null && params2.resourceTypeId != null && params2.resourceUrl != null && params2.resourceParameterId != null && params2.remark !=null ) {
            //添加
        }else {
         
        }
    });
  }
  //权限取消添加
  handleCancel(e:MouseEvent): void {
    this.isResourceAddVisible = false;
    //表单验证重置
    this.validateAddResourceForm.reset();
    for (const key in this.validateAddResourceForm.controls) {
      this.validateAddResourceForm.controls[ key ].markAsPristine();
      this.validateAddResourceForm.controls[ key ].updateValueAndValidity();
    }
  }
}
