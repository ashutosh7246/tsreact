import { Base64 } from './base64Service'

export class LocalStorageService {
  storage: any = {
    user: {},
    auth: {}
  };
  isStorage = false;

  create = () => {
    localStorage.setItem('auth', JSON.stringify(this.storage.auth));
    localStorage.setItem('user', JSON.stringify(this.storage.user));
    this.isStorage = true;
    return localStorage;
  }

  setValue(key: any, value: any) {
    const objectKey = this.storageForKey(key);
    if (typeof (value) !== 'boolean' && key !== 'userImage') {
      this.storage[objectKey][key] = window.btoa(value);
    } else if (typeof (value) !== 'boolean' && key === 'userImage') {
      this.storage[objectKey][key] = value;
    } else {
      this.storage[objectKey][key] = value;
    }
    localStorage.setItem(objectKey, JSON.stringify(this.storage[objectKey]));
  }

  getValue(key: any) {
    const objectKey = this.storageForKey(key);
    if (localStorage && localStorage[objectKey] && JSON.parse(localStorage[objectKey])[key]) {
      const value = JSON.parse(localStorage[objectKey])[key];
      if (typeof (value) !== 'boolean' && key !== 'userImage') {
        return window.atob(JSON.parse(localStorage[objectKey])[key]);
      } else if (typeof (value) !== 'boolean' && key === 'userImage') {
        return JSON.parse(localStorage[objectKey])[key];
      } else {
        return value;
      }
    } else {
      return false;
    }
  }

  clearLocalStorage() {
    localStorage.clear();
  }

  remove(key: any) {
    localStorage.removeItem(key);
  }

  isLocalStorage() {
    return this.isStorage;
  }

  storageForKey(key: any) {
    switch (key) {
      case 'accessToken':
        return 'auth';
      case 'refreshToken':
        return 'auth';
      default:
        return 'user';
    }
  }
}