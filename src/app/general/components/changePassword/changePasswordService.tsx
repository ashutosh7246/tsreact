import { Environment } from '../../services/environments';
import { Delegator } from '../../services/delegatorService';

export class ChangePasswordService {
    changePassword = (data: any, successCallBack: any, errorCallBack: any) => {
        var delegator = new Delegator;
        const url = Environment.SERVER + Environment.RESTURL.myprofile + Environment.RESTURL.changePassword;
        delegator._put(data, url, successCallBack, errorCallBack);
    }
}