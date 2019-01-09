import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import * as d3 from "d3";

declare var  AMap: any;    // 一定要声明AMap，要不然报错找不到AMap
declare var  AMapUI: any;
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {

    
  array = [ "../../assets/images/1.jpg","../../assets/images/2.jpg", "../../assets/images/3.jpg", "../../assets/images/4.jpg" ];











  chartOption = {
    backgroundColor: '#260765',
    title: {
        text: '堆叠区域图'
    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
            name: '视频广告',
            type: 'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
            name: '直接访问',
            type: 'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
            name: '搜索引擎',
            type: 'line',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            areaStyle: {normal: {}},
            data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
    ]
}
option = {
    backgroundColor: '#260765',
  xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
      type: 'value'
  },
  series: [{
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      areaStyle: {}
  }]
};
  constructor() { }

  ngOnInit() {
    this.getMap();
   
  }

   //1.地图加载
   getMap(){ 
       //实例化一个地图对象
       let map = new AMap.Map('map1', { 
           resizeEnable: true, zoom:11, center: [115.063727,33.2698] 
        }); 
    }
    

    
    
    
   

    

}
