Angular Route 导航

路由基础
----

创建一个新的项目Demo，介绍路由知识

> ng new router --routing

![这里写图片描述](https://img-blog.csdn.net/20180723141231287?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3d0ZGFzaw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

我们会发现多生成的一个文件app-routing.module.ts,这个文件就是当前应用的路由配置

![这里写图片描述](https://img-blog.csdn.net/20180723161149866?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3d0ZGFzaw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

生成一个home组件
> ng g component home
> ng g component product

![这里写图片描述](https://img-blog.csdn.net/20180723174628525?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3d0ZGFzaw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

修改home.component.html和product.component.html

```
<p>
  这里是主页组件
</p>

```

app-routing.module.ts
设置路由，把对应组件的文件配置进去

```
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ProductComponent} from "./product/product.component";

const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'product',component:ProductComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

```

app.component.html
填写对应文件的routerLink属性

```

<a [routerLink]="['/']">主页</a>
<a [routerLink]="['/product']">商品详情</a>
<input type="button" value="商品详情" (click)="toProductDetails()">
<router-outlet></router-outlet>

```

![这里写图片描述](https://img-blog.csdn.net/20180723174949651?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3d0ZGFzaw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

`(click)="toProductDetails()"` 是angular的第三者绑定方式：事件绑定

为了解决用户点击不存在的路径信息

创建一个新的组件

>  ng g component code404


就是当在页面上输入一个不存在的路径的时候，要显示的页面

code404.component.html

```
<p>
  页面不存在
</p>

```
app-routing.module.ts
```
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ProductComponent} from "./product/product.component";
import {Code404Component} from "./code404/code404.component";

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'product', component: ProductComponent},
    {path: '**', component: Code404Component},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

```

![这里写图片描述](https://img-blog.csdn.net/20180723175455135?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3d0ZGFzaw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
