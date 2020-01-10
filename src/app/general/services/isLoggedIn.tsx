import {LocalStorageService} from "./localStorageService";

export class IsLoggedIn {
    localStorageService = new LocalStorageService
    
    canActivate() {
        if (this.localStorageService.getValue('accessToken')) {
          return false;
        }
        return true;
      }
}