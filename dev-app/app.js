export class App {
  tokenInput = '';
  token;
  options = { lang: 'fr' };
  events = [];

  start() {
    this.token = this.tokenInput;
  }

  log(event) {
    this.events.unshift(`${event.type}: ${JSON.stringify(event.detail)}`);
  }
}
