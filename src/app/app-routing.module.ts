import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/components/login/login.component';
import { IndexComponent } from './components/index/index.component';
import { UserComponent } from './components/index/user/user.component';
import { MainComponent } from './components/index/main/main.component';
import { Main2Component } from './components/index/main2/main2.component';
import { RoleComponent } from './components/index/role/role.component';
import { ResourceComponent } from './components/index/resource/resource.component';


const routes: Routes = [
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'index',
    component:IndexComponent,
    children:[
      {
        path:'main',
        component:MainComponent
      },
      {
        path:'main2',
        component:Main2Component
      },
      {
        path:'user',
        component:UserComponent
      },
      {
        path:'role',
        component:RoleComponent
      },
      {
        path:'resource',
        component:ResourceComponent
      }
    ]
  },
  
  {
    path:'**',
    component:LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
