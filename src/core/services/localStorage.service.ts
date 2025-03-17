const path = {
  login: 'login',
};

class LocalStorageService {
  setLogin(): void {
    this.setItemLocalStore(path.login, 'true');
  }
  removeLogin(): void {
    this.setItemLocalStore(path.login, 'false');
  }
  isLogin(): boolean {
    return this.getItemLocalStore(path.login) === 'true';
  }
  setItemLocalStore(name: string, payload: any): void {
    localStorage.setItem(name, payload);
  }
  getItemLocalStore(name: string): string {
    return localStorage.getItem(name) ?? '';
  }
  strEncript(data: string): string {
    return btoa(data);
  }
  strDecript(data: string): string {
    return atob(data);
  }
  jsonEncript(data: object | any[]): string {
    return btoa(JSON.stringify(data));
  }
  jsonDecript<T>(data: string): T {
    return JSON.parse(atob(data));
  }
}
export const localStorageService = new LocalStorageService();
