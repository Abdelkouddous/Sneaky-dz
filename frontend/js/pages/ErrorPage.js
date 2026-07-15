export class ErrorPage {
  constructor(code = 404) {
    this.code = code;
  }

  async render() {
    const is404 = this.code === 404;
    const title = is404 ? "Page Not Found" : "Something went wrong";
    const desc = is404 
      ? "The page you are looking for doesn't exist or has been moved." 
      : "We're experiencing some technical difficulties. Please try again later.";

    return `
      <div class="container error-page a-fade-in">
        <div class="error__inner">
          <div class="error__code">${this.code}</div>
          <h1 class="error__title">${title}</h1>
          <p class="error__desc">${desc}</p>
          <div class="error__actions">
            <button class="btn btn--secondary btn--lg" onclick="window.history.back()">Go Back</button>
            <a href="#/" class="btn btn--primary btn--lg">Home Page</a>
          </div>
        </div>
      </div>
    `;
  }
}
