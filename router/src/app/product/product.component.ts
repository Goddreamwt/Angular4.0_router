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
