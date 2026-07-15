export class Router {
  constructor(routes) {
    this.routes = routes;
    this.appElement = document.getElementById('app');
    this.currentView = null;
    this.init();
  }

  init() {
    window.addEventListener('hashchange', this.handleRoute.bind(this));
    // Handle initial route
    window.addEventListener('load', this.handleRoute.bind(this));
  }

  async handleRoute() {
    const path = window.location.hash.slice(1) || '/';
    const parsedUrl = this.parseUrl(path);
    
    // Find matching route
    const route = this.findRoute(parsedUrl.resource);
    
    if (!route) {
      this.navigateTo('/404');
      return;
    }

    // Scroll to top on route change
    window.scrollTo(0, 0);

    // Destroy current view if it has a destroy method
    if (this.currentView && typeof this.currentView.destroy === 'function') {
      this.currentView.destroy();
    }

    try {
      // Add a small delay for smooth transitions (skeleton loading effect)
      this.appElement.innerHTML = '<div style="height: 50vh; display: flex; align-items: center; justify-content: center;"><div class="btn--loading" style="color: var(--color-text) !important; position: relative; width: 40px; height: 40px;"></div></div>';
      
      // Instantiate new view
      this.currentView = new route.view();
      
      // Render
      const html = await this.currentView.render(parsedUrl);
      this.appElement.innerHTML = html;
      
      // Initialize view logic after render
      if (typeof this.currentView.afterRender === 'function') {
        await this.currentView.afterRender(parsedUrl);
      }
    } catch (error) {
      console.error('Routing Error:', error);
      this.navigateTo('/500');
    }
  }

  parseUrl(url) {
    const parts = url.split('/').slice(1);
    const resource = parts[0] ? `/${parts[0]}` : '/';
    const id = parts[1] || null;
    const action = parts[2] || null;
    
    return { resource, id, action, original: url };
  }

  findRoute(resource) {
    return this.routes.find(r => r.path === resource);
  }

  navigateTo(path) {
    window.location.hash = path;
  }
}
