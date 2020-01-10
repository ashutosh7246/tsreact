import { Environment } from './environments';
import { UtilityService } from './utilityService';
import { LocalStorageService } from "./localStorageService";

export class Delegator {


    props: any;
    lockedForRefresh: any = false;
    delayRequests: any = {};
    runningRequests: any = {};
    requestCounter: any = 0;
    localStorageService: any = new LocalStorageService;


    _fetch = (config: any) => {
        var status: any;

        if (this.lockedForRefresh && !config.noDelay) {
            this.storeDelayedRequest(config);
        } else {
            const requestId = this.nextRequestId();

            // store request's config and store it in runningRequests
            const tracker = {
                requestId: requestId,
                config: config
            };
            this.runningRequests[requestId] = tracker;

            if (config.method === 'get' || config.method === 'delete') {
                fetch(config.url, {
                    method: config.method,
                    headers: config.header
                })
                    .then((response) => {
                        status = response.status;
                        return response.json()
                    })
                    .then((response) => {
                        this._handleResponse(response, status, tracker)
                    })
                    .catch(err => {
                        this._handleError(err, tracker)
                    })
            } else {
                console.log('==========>', config.data);
                fetch(config.url, {
                    method: config.method,
                    headers: config.header,
                    body: JSON.stringify(config.data)
                })
                    .then((response) => {
                        status = response.status;
                        return response.json()
                    })
                    .then((response) => {
                        this._handleResponse(response, status, tracker)
                    })
                    .catch(err => {
                        this._handleError(err, tracker)
                    })
            }
        }
    }

    _buildConfig = (url: any, data: any, method: any, successCallBack: any, errorCallBack: any) => {

        const config: any = {};

        const header = this._prepareHeader(data);

        if (data.clientId) {
            config.url = url;
            config.data = data;
            config.method = method;
            config.successCallBack = successCallBack;
            config.errorCallBack = errorCallBack;
        } else {
            config.url = url;
            config.header = header;
            config.data = data;
            config.method = method;
            config.successCallBack = successCallBack;
            config.errorCallBack = errorCallBack;
        }
        if (data.refreshToken) {
            config.noDelay = true;
        }

        return config;
    }

    _prepareHeader = (data: any) => {

        let headers: any;
        let Basic: any;
        let Bearer: any;

        if (data.email && data.password) {
            Basic = 'Basic ' + window.btoa(data.email + ':' + data.password)
            headers = { 'Authorization': Basic };
        } else if (data.refreshToken) {
            Bearer = 'Bearer ' + data.refreshToken;
            headers = { 'Authorization': Bearer };
        } else {
            Bearer = 'Bearer ' + this.localStorageService.getValue('accessToken');
            headers = { 'Authorization': Bearer };
        }
        headers['Content-Type'] = 'application/json';

        return headers;

    }

    _post = (data: any, url: any, successCallBack: any, errorCallBack: any) => {
        const config = this._buildConfig(url, data, 'post', successCallBack, errorCallBack);
        this._fetch(config);
    }

    _put = (data: any, url: any, successCallBack: any, errorCallBack: any) => {
        const config = this._buildConfig(url, data, 'put', successCallBack, errorCallBack);
        this._fetch(config);
    }

    _get = (url: any, successCallBack: any, errorCallBack: any) => {
        const config = this._buildConfig(url, '', 'get', successCallBack, errorCallBack);
        this._fetch(config);
    }

    _handleResponse = (response: any, status: any, tracker: any) => {
        let data = response;

        if (status >= 200 && status < 300) {
            delete this.runningRequests[tracker.requestId];
            if (data.status) {
                if (data.status.errorCode === 0) {
                    tracker.config.successCallBack(data);
                } else {
                    const err = data.status;
                    tracker.config.errorCallBack(err);
                }
            } else {
                tracker.config.successCallBack(data);
            }
        } else {
            var utilityService = new UtilityService;
            const error = response;
            if (status === 599) {
                this.unLockRequestFlag();
                this.localStorageService.clearLocalStorage();
                this.props.history.push("/login");
                return
            }
            if (status === 419 && !this.lockedForRefresh) { // Session Time Out
                this._interceptSessionExpired();
            } else if (status === 401) {
                delete this.runningRequests[tracker.requestId];
                this.localStorageService.clearLocalStorage();
                tracker.config.errorCallback(error);
                this.props.history.push("/login");
            } else if (status === 403) { // User has not access rights (Forbidden)
                delete this.runningRequests[tracker.requestId];
                tracker.config.errorCallback(error);
            } else if (!this.lockedForRefresh) {
                delete this.runningRequests[tracker.requestId];
                tracker.config.errorCallback(error);
            }
        }
    }

    _handleError = (err: any, tracker: any) => {
        tracker.config.errorCallBack(err);
    }

    _interceptSessionExpired = () => {
        if (!this.lockedForRefresh) {
            this.lockedForRefresh = true;
            // queue the requests
            this.lockRequest();
            this._refreshAccessToken();
        }
    }

    _refreshAccessToken = () => {
        const refreshToken = this.localStorageService.getValue('refreshToken');
        // Send request for new access token
        let data = {
            refreshToken: refreshToken,
            grantType: 'accessToken'
        };
        const url = Environment.SERVER + Environment.RESTURL.myprofile + Environment.RESTURL.authenticate;
        this._post(data, url, this.refreshAccessTokenSuccess, this.refreshAccessTokenError);
    }

    refreshAccessTokenSuccess = (result: any) => {
        this.localStorageService.setValue('accessToken', result.accessToken);
        this.localStorageService.setValue('refreshToken', result.refreshToken);
        this.lockedForRefresh = false;
        this.unLockRequest();
    }

    refreshAccessTokenError = (error: any) => {
        this.unLockRequestFlag();
        this.lockedForRefresh = false;
        this.localStorageService.clearLocalStorage();
        this.props.history.push("/login");
    }

    lockRequest = () => {
        this.lockedForRefresh = true;
    }

    unLockRequestFlag = () => {
        this.lockedForRefresh = false;
        this.runningRequests = [];
        this.delayRequests = [];
    }

    unLockRequest = () => {
        this.lockedForRefresh = false;
        this.executeRunningRequests();
        this.executeDelayedRequests();
    }

    storeDelayedRequest = (config: any) => {
        const requestId = this.nextRequestId();
        const tracker = {
            requestId: requestId,
            config: config
        };
        this.delayRequests[requestId] = tracker;
    }

    nextRequestId = () => {
        return this.requestCounter += 1;
    }

    executeRunningRequests = () => {
        for (const key in this.runningRequests) {
            if (this.runningRequests.hasOwnProperty(key)) {
                this.executeRequests(this.runningRequests[key]);
                delete this.runningRequests[key];
            }
        }
    }

    executeDelayedRequests = () => {
        for (const key in this.delayRequests) {
            if (this.delayRequests.hasOwnProperty(key)) {
                this.executeRequests(this.delayRequests[key]);
                delete this.runningRequests[key];
            }
        }
    }

    executeRequests = (request: any) => {
        const config = this._buildConfig(
            request.config.url,
            request.config.data,
            request.config.method,
            request.config.successCallBack,
            request.config.errorCallBack);
        return this._fetch(config);
    }
}