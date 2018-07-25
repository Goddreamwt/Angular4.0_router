import {ProductComponent} from "../product/product.component";
/**
 * Created by mac on 2018/7/24.
 */
export class UnSaveGuard implements CanDeactivate<ProductComponent>{
    canDeactivate(component:ProductComponent){
        return window.confirm("你还没有保存，确定要离开嘛？");
    }
}