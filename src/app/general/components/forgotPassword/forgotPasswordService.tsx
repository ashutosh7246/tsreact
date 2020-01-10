import { Environment } from '../../services/environments';
import { Delegator } from '../../services/delegatorService';

export class ForgotPasswordService {
    forgotPassword(user: any, successCallback: any, errorCallback: any) {
        var delegator = new Delegator;
        const url = Environment.SERVER + Environment.RESTURL.myprofile + Environment.RESTURL.forgotUserPassword;
        delegator._post(user, url, successCallback, errorCallback);
    }
}