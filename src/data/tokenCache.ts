import { TokenCache, TokenStore } from "@commercetools/sdk-client-v2"

export class MyTokenCache implements TokenCache {
  myCaсhe: TokenStore = {
    token: '',
    expirationTime: 0,
    refreshToken: undefined
  }

  set(newCache: TokenStore) {
    this.myCaсhe = newCache;
  }

  get() {
    return this.myCaсhe;
  }
}