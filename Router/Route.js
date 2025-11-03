export default class Route {
    constructor(url, title, pathHTML, authorize, pathJS = "") {
        this.url = url;
        this.title = title;
        this.pathHTML = pathHTML;
        this.authorize = authorize;
        this.pathJS = pathJS;
    }
}
