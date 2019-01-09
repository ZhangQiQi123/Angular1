import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import { UtilService } from 'src/app/services/util.service';


declare var  AMap: any;    // 一定要声明AMap，要不然报错找不到AMap
declare var  AMapUI: any;

@Component({
  selector: 'app-main2',
  templateUrl: './main2.component.html',
  styleUrls: ['./main2.component.css']
})
export class Main2Component implements OnInit {

  constructor(private utilService:UtilService) { }

  
  ngOnInit() {
    this.initMap();  
  }
 //初始化地图
  initMap(){
    //创建地图
    var map = new AMap.Map('container', {
      zoom: 4
    });
    //加载相关组件
    AMapUI.load(['ui/geo/DistrictCluster', 'lib/$'], function(DistrictCluster, $) {
      DistrictCluster = DistrictCluster;
      //启动页面
      var distCluster = new DistrictCluster({
          map: map, //所属的地图实例
          zIndex:11,
          getPosition: function(item) {

              if (!item) {
                  return null;
              }

              var parts = item.split(',');

              //返回经纬度
              return [parseFloat(parts[0]), parseFloat(parts[1])];
          }
      });

      distCluster = distCluster;

      $('<div id="loadingTip">加载数据，请稍候...</div>').appendTo(document.body);
      //根据经纬度，自动统计省，市数据
      $.get('assets/earth/10w.txt', function(csv) {
          $('#loadingTip').remove();
          var data = csv.split('\n');
          distCluster.setData(data);
      });
    });
  }
    





 

}
