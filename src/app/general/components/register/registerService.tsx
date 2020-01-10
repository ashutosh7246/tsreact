import { Environment } from '../../services/environments';
import { Delegator } from '../../services/delegatorService';

export class RegisterService {
    registerUser = (params: any, successCallBack: any, errorCallBack: any) => {
        var delegator = new Delegator;
        const url = Environment.SERVER + Environment.RESTURL.myprofile + Environment.RESTURL.register;
        delegator._post(params, url, successCallBack, errorCallBack);
    }
}