import { Environment } from '../../services/environments';
import { Delegator } from '../../services/delegatorService';

export class LoginService {
    registerClientId = (params: any, successCallBack: any, errorCallBack: any) => {
        var delegator = new Delegator;
        const url = Environment.SERVER + Environment.apiUrl + Environment.RESTURL.registerClientId + '?clientId=' + params.clientId;
        delegator._post(params, url, successCallBack, errorCallBack);
    }

    authenticateUser(user: any, successCallback: any, errorCallback: any) {
        var delegator = new Delegator;
        const url = Environment.SERVER + Environment.RESTURL.myprofile + Environment.RESTURL.authenticate;
        delegator._post(user, url, successCallback, errorCallback);
    }

    loginUser(user: any, successCallback: any, errorCallback: any) {
        var delegator = new Delegator;
        const url = Environment.SERVER + Environment.apiUrl + Environment.RESTURL.loginUrl + '?email=' + user.email + '&getImg=true';
        delegator._get(url, successCallback, errorCallback);
    }
}