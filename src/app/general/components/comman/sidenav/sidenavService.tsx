import { Environment } from '../../../services/environments';
import { Delegator } from '../../../services/delegatorService';

export class SideNavService {
    deleteClientId(modal: any, successCallback: any, errorCallback: any) {
        var delegator = new Delegator;
        const url = Environment.SERVER + Environment.apiUrl + Environment.RESTURL.deleteClientId;
        delegator._post(modal, url, successCallback, errorCallback);
    }

    logoutUser(user: any, successCallback: any, errorCallback: any) {
        var delegator = new Delegator;
        const url = Environment.SERVER + Environment.RESTURL.myprofile + Environment.RESTURL.logout;
        delegator._post(user, url, successCallback, errorCallback);
    }
}