export const storagePath = {
  AccessToken: 'access_token',
  RefreshToken: 'refresh_token',
};

class LocalStorageService {
  setToken(access_token:string, refresh_token: string): void {
    this.setItemLocalStore(storagePath.AccessToken, access_token);
    this.setItemLocalStore(storagePath.RefreshToken, refresh_token);
  }
  removeToken(): void {
    this.removeItemLocalStore(storagePath.AccessToken);
    this.removeItemLocalStore(storagePath.RefreshToken);
  }
  setItemLocalStore(name: string, payload: any): void {
    localStorage.setItem(name, payload);
  }
  getItemLocalStore(name: string): string {
    return localStorage.getItem(name) ?? '';
  }
  removeItemLocalStore(name: string): string {
    return localStorage.removeItem(name) ?? '';
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
