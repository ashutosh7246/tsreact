import { ErrorNotifier } from './errorNotifierService';
import { LocalStorageService } from "./localStorageService";

export class UtilityService {
  localStorageService = new LocalStorageService

  handleError = (error: any) => {
    // this.loggingAspect.invokeOnThrowOfMethod(error);
    var errorNotifier = new ErrorNotifier;
    errorNotifier.notifyError(error);
  }

  isLoggedIn = () => {
    if (this.localStorageService.getValue('accessToken')) {
      return true;
    } else {
      return false;
    }
  }

  navigateToState = (state: any) => {
    // this._router.navigate([state]);
  }
}