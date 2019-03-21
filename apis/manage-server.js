
import {MSUrl} from "../common/AjaxUrl"
import Api from "../common/Api"
export default {
    getManageInfo(cb){
        Api.get(MSUrl,cb)
    }
}