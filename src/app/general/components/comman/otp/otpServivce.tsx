import { Environment } from '../../../services/environments';
import { Delegator } from '../../../services/delegatorService';

export class OTPService {
    verifyOTP(user: any, successCallback: any, errorCallback: any) {
        var delegator = new Delegator;
        const url = Environment.SERVER + Environment.RESTURL.otp + Environment.RESTURL.verifyOtp;
        delegator._post(user, url, successCallback, errorCallback);
    }

    resendOtp(data: any, successCallback: any, errorCallback: any) {
        var delegator = new Delegator;
        const url = Environment.SERVER + Environment.RESTURL.otp + Environment.RESTURL.resendOtp;
        delegator._post(data, url, successCallback, errorCallback);
    }
}