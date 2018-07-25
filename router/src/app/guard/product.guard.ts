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