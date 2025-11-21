class TokenManager {
  constructor(req) {
    this.req = req;
    this.currentToken = null;
    this.expiry = null;
  }

  async getToken() {
    if (!this.currentToken || Date.now() > this.expiry - 60000) {
      await this.refresh();
    }
    return this.currentToken;
  }

  async refresh() {
    const newToken = await refreshZohoAccessToken(this.req);
    this.currentToken = newToken;
    this.expiry = Date.now() + 55 * 60 * 1000; // 55 min
  }
}
