function navigationFromWindow(){
    // add base 64 decoded nav content here
    //return JSON.parse(atob(window.sideNavObj));
    return window.sideNavObj;
}
export let navigation = navigationFromWindow();