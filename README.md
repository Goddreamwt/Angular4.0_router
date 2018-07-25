Angular Route 导航

路由基础
----

创建一个新的项目Demo，介绍路由知识

> ng new router --routing

我们会发现多生成的一个文件app-routing.module.ts,这个文件就是当前应用的路由配置

生成一个home组件
> ng g component home
> ng g component product

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

在路由时传递数据
-----

- 在查询参数中传递数据

```
/product?id=1&name=2  => ActivatedRoute.queryParams[id]
```

- 在路由路径中传递数据

```
{path:/product,component:ProductComponent,data:[{isProd:true}]}
=> ActivatedRoute.data[0][isProd]
```

- 在路由配置中传递数据


代码演示
----

方式一：

在路由中配置：在查询参数中传递数据
app.component.html

```

<a [routerLink]="['/']">主页</a>
<a [routerLink]="['/product']" [queryParams]="{id:1}">商品详情</a>
<input type="button" value="商品详情" (click)="toProductDetails()">
<router-outlet></router-outlet>

```

在组件中接收数据：
product.component.ts

```
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
selector: 'app-product',
templateUrl: './product.component.html',
styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

private productId:number;

constructor(private routeInfo:ActivatedRoute) { }

ngOnInit() {
this.productId = this.routeInfo.snapshot.queryParams["id"];
}

}

```

在组件中显示
product.component.html
```
<p>
这里是商品信息组件
</p>

<p>
商品ID是：{{productId}}
</p>
```

方式二：在路由路径中传递数据

在app-routing.module.ts修改path,后面添加一个id参数

```
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ProductComponent} from "./product/product.component";
import {Code404Component} from "./code404/code404.component";

const routes: Routes = [
{path: '', component: HomeComponent},
{path: 'product/:id', component: ProductComponent},
{path: '**', component: Code404Component},
];

@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule {
}

```

app.component.html

在routerLink中的数组中添加数据信息
```

<a [routerLink]="['/']">主页</a>
<!--<a [routerLink]="['/product']" [queryParams]="{id:1}">商品详情</a>-->
<a [routerLink]="['/product',2]">商品详情</a>
<input type="button" value="商品详情" (click)="toProductDetails()">
<router-outlet></router-outlet>

```

product.component.ts

修改获取属性方式`this.routeInfo.snapshot.params["id"]`  注意方式一用的是 `this.routeInfo.snapshot.queryParams["id"];`
```
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
selector: 'app-product',
templateUrl: './product.component.html',
styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

private productId:number;

constructor(private routeInfo:ActivatedRoute) { }

ngOnInit() {
this.productId = this.routeInfo.snapshot.params["id"];
}

}

```

参数快照和参数订阅
---------

在app.component.ts中的点击事件toProductDetails中增加一个参数，它实际上跟上面的方式二的功能相同

```
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
selector: 'app-root',
templateUrl: './app.component.html',
styleUrls: ['./app.component.css']
})
export class AppComponent {
title = 'app';

constructor(private router:Router){

}

toProductDetails(){
this.router.navigate(['./product',3]);
}
}

```
在组件product.component.ts中依旧可以接收到参数

但是有个问题我们看一下，我们先点击主页，再点击商品详情


再点击主页再点击商品详情的按钮


我们发现数据被替换了，但是从商品详情直接点击商品详情按钮，发现数据是不会变化的


因为在product.component.ts中的`ngOnInit() {
this.productId = this.routeInfo.snapshot.params["id"];
}`中仅仅是从主页加载到本页的时候加载一次，从其他页面尽量不会再次加载，解决这种问题的方式就叫参数订阅。而我们现在使用的这种方式叫做参数快照`snapshot`。


使用参数订阅的方式就能完美解决这个问题
product.component.ts

```
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
selector: 'app-product',
templateUrl: './product.component.html',
styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

private productId:number;

constructor(private routeInfo:ActivatedRoute) { }

ngOnInit() {

//参数订阅
this.routeInfo.params.subscribe(
(params:Params)=>this.productId = params["id"]
);

//参数快照
// this.productId = this.routeInfo.snapshot.params["id"];
}

}

```




