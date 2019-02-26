import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { LoginComponent } from './components/login/login.component';
import { IndexComponent } from './components/index/index.component';
import { CookieService } from 'ngx-cookie-service';
import { UserComponent } from './components/index/user/user.component';
import { MainComponent } from './components/index/main/main.component';
import {NgxEchartsModule} from 'ngx-echarts';
import {scaleLinear} from "d3-scale";
import { Main2Component } from './components/index/main2/main2.component';
import { RoleComponent } from './components/index/role/role.component';
import { ResourceComponent } from './components/index/resource/resource.component';
import { InnerHTMLPipePipe } from './pipe/inner-htmlpipe.pipe';
registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    IndexComponent,
    UserComponent,
    MainComponent,
    Main2Component,
    RoleComponent,
    ResourceComponent,
    InnerHTMLPipePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    NgxEchartsModule
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN },CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
