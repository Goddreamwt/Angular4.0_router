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
重定向路由
-----

重定向路由：用户访问一个特定的地址时，将其重定向到另一个指定的地址。

```
www.aaa.com  =>  www.aaa.com/products
或者
www.aaa.com/x => www.aaa.com/y
```

修改app.component.html

```

<a [routerLink]="['/home']">主页</a>
<!--<a [routerLink]="['/product']" [queryParams]="{id:1}">商品详情</a>-->
<a [routerLink]="['/product',2]">商品详情</a>
<input type="button" value="商品详情" (click)="toProductDetails()">
<router-outlet></router-outlet>

```

app-routing.module.ts

```
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ProductComponent} from "./product/product.component";
import {Code404Component} from "./code404/code404.component";

const routes: Routes = [
{path: '', redirectTo:'/home',pathMatch:'full'},//路由重定向
{path: 'home', component: HomeComponent},
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

子路由
---

```
{path: 'home', component: HomeComponent}
```

```
{path: 'home', component: HomeComponent,
children:[
{
path:"",component:XxxComponent
},{
path:'/yyy' component:YyyComponent
}
]
}
```

代码示例：

创建两个新的组件

- ng g component productDesc
- ng g component sellerInfo

在app-routing.module.ts中添加子路由信息

```
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ProductComponent} from "./product/product.component";
import {Code404Component} from "./code404/code404.component";
import {ProductDescComponent} from "./product-desc/product-desc.component";
import {SellerInfoComponent} from "./seller-info/seller-info.component";

const routes: Routes = [
{path: '', redirectTo:'/home',pathMatch:'full'},//路由重定向
{path: 'home', component: HomeComponent},
{path: 'product/:id', component: ProductComponent,children:[
{path: '', component: ProductDescComponent},
{path: 'seller/:id', component: SellerInfoComponent},
]},
{path: '**', component: Code404Component},
];

@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule {
}

```

product-desc.component.html

```
<p>
这是一个牛X的商品
</p>

```

seller-info.component.html

```
<p>
销售员ID是{{sellerId}}
</p>

```
seller-info.component.ts

```
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
selector: 'app-seller-info',
templateUrl: './seller-info.component.html',
styleUrls: ['./seller-info.component.css']
})
export class SellerInfoComponent implements OnInit {

private sellerId:number;

constructor(private routeInfo:ActivatedRoute) { }

ngOnInit() {
this.sellerId = this.routeInfo.snapshot.params["id"];
}

}

```

然后在product.component.html中添加路由插座`router-outlet`

```
<p>
这里是商品信息组件
</p>

<p>
商品ID是：{{productId}}
</p>

<a [routerLink]="['./']">商品描述</a>
<a [routerLink]="['./seller',99]">销售员信息</a>

<router-outlet></router-outlet>
```
辅助路由
----
上篇文章中我们介绍了Angular的父子关系的子路由，这里我们介绍兄弟关系的辅助路由。

1.除了在控件中声明`router-outlet`插座外，还需要声明一个带有name属性的插座。
```
<router-outlet></router-outlet>
<router-outlet name="aux"></router-outlet>
```


2.在路由配置里面，需要配置名字为aux的组件上可以配置的组件

```
{path: 'xxx', component: XxxComponent,outlet:"aux"},
{path: 'yyy', component: YyyComponent,outlet:"aux"}
```

3.

```
<a [routerLink]="['/home',{outlet:{aux:'xxx'}}]">Xxx</a>
<a [routerLink]="['/product',{outlet:{aux:'yyy'}}]">Yyy</a>
```

辅助路由案例整体思路

在app组件的模板上再定义一个插座来显示聊天面板
单独开发一个聊天室组件，只显示在新定义的插座上
通过路由参数来控制新插座是否显示聊天面板


代码示例：新建一个聊天组件

> ng g component chat

在app.component.html中添加名为aux的辅助路由

```

<a [routerLink]="['/home']">主页</a>
<!--<a [routerLink]="['/product']" [queryParams]="{id:1}">商品详情</a>-->
<a [routerLink]="['/product',2]">商品详情</a>
<input type="button" value="商品详情" (click)="toProductDetails()">
<router-outlet></router-outlet>
<router-outlet name="aux"></router-outlet>
```

改造整体的代码，使聊天组件局左，占据整个页面30%
chat.component.html

```
<textarea placeholder="请输入聊天内容" class="chat"></textarea>

```
chat.component.css

```
.chat{
background: greenyellow;
height: 100px;
width: 30%;
float:left;
box-sizing: border-box;
}
```

product.component.html

```
<div class="product">
<p>
这里是商品信息组件
</p>

<p>
商品ID是：{{productId}}
</p>

<a [routerLink]="['./']">商品描述</a>
<a [routerLink]="['./seller',99]">销售员信息</a>

<router-outlet></router-outlet>
</div>

```
product.component.css

```
.product{
background: cadetblue;
height: 100px;
width: 70%;
float:left;
box-sizing: border-box;
}
```

home.component.html

```
<div class="home">
<p>
这里是主页组件
</p>
</div>


```

home.component.css

```
.home{
background: cadetblue;
height: 100px;
width: 70%;
float:left;
box-sizing: border-box;
}
```
修改完成，然后在app-routing.module.ts中，添加插件

```
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ProductComponent} from "./product/product.component";
import {Code404Component} from "./code404/code404.component";
import {ProductDescComponent} from "./product-desc/product-desc.component";
import {SellerInfoComponent} from "./seller-info/seller-info.component";
import {ChatComponent} from "./chat/chat.component";

const routes: Routes = [
{path: '', redirectTo:'/home',pathMatch:'full'},//路由重定向
{path: 'chat', component: ChatComponent,outlet:'aux'},
{path: 'home', component: HomeComponent},
{path: 'product/:id', component: ProductComponent,children:[
{path: '', component: ProductDescComponent},
{path: 'seller/:id', component: SellerInfoComponent},
]},
{path: '**', component: Code404Component},
];

@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule {
}

```
`outlet:'aux'`表示在定义辅助路由aux的页面才显示，没有定义的则不显示


app.component.html

```

<a [routerLink]="['/home']">主页</a>
<!--<a [routerLink]="['/product']" [queryParams]="{id:1}">商品详情</a>-->
<a [routerLink]="['/product',2]">商品详情</a>
<input type="button" value="商品详情" (click)="toProductDetails()">

<a [routerLink]="[{outlets:{aux:'chat'}}]" [queryParams]="{id:1}">开始聊天</a>
<a [routerLink]="[{outlets:{aux: null}}]">结束聊天</a>
<router-outlet></router-outlet>
<router-outlet name="aux"></router-outlet>
```

还有一个属性primary，如果设置primary属性，那么不管在哪个页面，当点击开始聊天的时候，都会跳回到home页面中

app.component.html
```

<a [routerLink]="['/home']">主页</a>
<!--<a [routerLink]="['/product']" [queryParams]="{id:1}">商品详情</a>-->
<a [routerLink]="['/product',2]">商品详情</a>
<input type="button" value="商品详情" (click)="toProductDetails()">

<a [routerLink]="[{outlets:{primary:'home', aux:'chat'}}]" [queryParams]="{id:1}">开始聊天</a>
<a [routerLink]="[{outlets:{aux: null}}]">结束聊天</a>

<router-outlet></router-outlet>
<router-outlet name="aux"></router-outlet>
```
路由守卫
----

只有当用户已经登录并拥有某些权限时，才能进入某些路由。

一个由多个表单组成的向导，例如注册流程，用户只有在当前路由的组件中填写了满足要求的信息才可以导航到下一个路由。

当用户未执行保存操作，而试图离开当前导航时，提醒用户。

- CanActivate:处理导航到某路由的情况。
- CanDeactivate：处理当前路由离开的情况。
- Resolve：在路由激活之前获取路由数据。

下面编写一个伪代码示例

创建登录守卫
创建目录文件guard，在其下面创建login.guard.ts

```
import {CanActivate} from "@angular/router";

export class LoginGuard implements CanActivate {
canActivate() {
let loggedIn: boolean = Math.random() < 0.5;
if (!loggedIn) {
console.log("用户未登录");
}

return loggedIn;
}
}
```

我们模拟的是产生一个随机数，当小于0.5的时候显示，否则log


app-routing.module.ts

```
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ProductComponent} from "./product/product.component";
import {Code404Component} from "./code404/code404.component";
import {ProductDescComponent} from "./product-desc/product-desc.component";
import {SellerInfoComponent} from "./seller-info/seller-info.component";
import {ChatComponent} from "./chat/chat.component";
import {LoginGuard} from "./guard/login.guard";

const routes: Routes = [
{path: '', redirectTo:'/home',pathMatch:'full'},//路由重定向
{path: 'chat', component: ChatComponent,outlet:'aux'},
{path: 'home', component: HomeComponent},
{path: 'product/:id', component: ProductComponent,children:[
{path: '', component: ProductDescComponent},
{path: 'seller/:id', component: SellerInfoComponent},
],canActivate:[LoginGuard]},
{path: '**', component: Code404Component},
];

@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule],
providers:[LoginGuard]
})
export class AppRoutingModule {
}

```
添加登录守卫`canActivate:[LoginGuard]`，注意：我们在这里添加了路由守卫，但是这个canActivate在什么地方被初始化呢？Angular给我们一种依赖注入的方式，在以下的文章会介绍。在这我们只要做一件事，就是在`@NgModule`的中填写`providers:[LoginGuard]`



接下来我们创建保存守卫在guard文件下创建unSave.guard.ts

```
import {ProductComponent} from "../product/product.component";
/**
* Created by mac on 2018/7/24.
*/
export class UnSaveGuard implements CanDeactivate<ProductComponent>{
canDeactivate(component:ProductComponent){
return window.confirm("你还没有保存，确定要离开嘛？");
}
}
```


resolve守卫
---------
在实际开发中，我们会在`ngOnInit`时，进行网络请求获取数据，展示给用户。但是一般数据没有及时返回的话，页面没有及时渲染，会有不好的用户体验，所以使用resolve守卫，在进行路由跳转之前，获取数据，并由守卫把获取到的数据传递到相应的页面中。

在guard文件目录下创建product.guard.ts

```
import {Resolve,ActivatedRouteSnapshot, RouterStateSnapshot,Router} from "@angular/router";
import {Observable} from "rxjs";
import {Product} from "../product/product.component";
import {Injectable} from "@angular/core";

@Injectable()
export class ProductResolve implements Resolve<Product> {

constructor(private router:Router){

}
resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product> | Promise<Product> | Product{
let productId: number = route.params["id"];
console.log(productId);
if (productId == 1) {
return new Product(1,"iPhone7");
}else {
this.router.navigate(['/home']);
}
}
}
```
这里的意思是：我传一个id为1的数据时，返回一个新的Product。`new Product(1,"iPhone7");`如果不是就跳转到首页

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
private productName:string;

constructor(private routeInfo:ActivatedRoute) { }

ngOnInit() {

//参数订阅
this.routeInfo.params.subscribe(
(params:Params)=>this.productId = params["id"]
);
this.routeInfo.data.subscribe(
(data:{product:Product}) =>{
this.productId = data.product.id;
this.productName = data.product.name;
}
);
//参数快照
// this.productId = this.routeInfo.snapshot.params["id"];
}

}

//声明此类
export class Product{
constructor(public id:number,public name:string){

}
}
```
此时我们获取的定义就不是`params`了，而是`data`

product.component.html

```
<div class="product">
<p>
这里是商品信息组件
</p>

<p>
商品ID是：{{productId}}
</p>

<p>
商品名称是：{{productName}}
</p>


<a [routerLink]="['./']">商品描述</a>
<a [routerLink]="['./seller',99]">销售员信息</a>
<router-outlet></router-outlet>
</div>


```

在页面上接收显示productName

app-routing.module.ts

```
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ProductComponent} from "./product/product.component";
import {Code404Component} from "./code404/code404.component";
import {ProductDescComponent} from "./product-desc/product-desc.component";
import {SellerInfoComponent} from "./seller-info/seller-info.component";
import {ChatComponent} from "./chat/chat.component";
import {LoginGuard} from "./guard/login.guard";
import {UnSaveGuard} from "./guard/unSave.guard";
import {ProductResolve} from "./guard/product.guard";

const routes: Routes = [
{path: '', redirectTo:'/home',pathMatch:'full'},//路由重定向
{path: 'chat', component: ChatComponent,outlet:'aux'},
{path: 'home', component: HomeComponent},
{path: 'product/:id', component: ProductComponent,children:[
{path: '', component: ProductDescComponent},
{path: 'seller/:id', component: SellerInfoComponent},
],resolve:{
product:ProductResolve
}
},
{path: '**', component: Code404Component},
];

@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule],
providers:[LoginGuard,UnSaveGuard,ProductResolve]
})
export class AppRoutingModule {
}

```

同时把守卫添加进去路由。

app.component.html

```
<a [routerLink]="['/home']">主页</a>
<!--<a [routerLink]="['/product']" [queryParams]="{id:1}">商品详情</a>-->
<a [routerLink]="['/product',1]">商品详情</a>
<input type="button" value="商品详情" (click)="toProductDetails()">

<a [routerLink]="[{outlets:{primary:'home', aux:'chat'}}]">开始聊天</a>
<a [routerLink]="[{outlets:{aux: null}}]">结束聊天</a>

<router-outlet></router-outlet>
<router-outlet name="aux"></router-outlet>

```

记得把参数改为1

当我点击商品详情的a标签时，传递参数1，返回productName为iPhone7的Product



当我点击商品详情按钮的时候，传递参数为3，直接跳转到首页


![image](https://github.com/Goddreamwt/Angular4.0_router/blob/master/imge/1.png)




