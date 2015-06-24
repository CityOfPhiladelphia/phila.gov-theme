/*! phila.gov-theme 0.11.5 phila-theme.js 2015-03-27 11:19:08 AM */
new List("filter-list", {
    valueNames: [ "item", "item-desc" ]
});

function searchPhilaGov() {
    var input = document.getElementById("search-form"), value = input ? input.value : "defaultText";
    window.location.href = "https://www.google.com/#q=site:phila.gov+" + escape(value);
}

(function() {
    var container, button, menu;
    container = document.getElementById("site-navigation");
    if (!container) return;
    button = container.getElementsByTagName("button")[0];
    if ("undefined" === typeof button) return;
    menu = container.getElementsByTagName("ul")[0];
    if ("undefined" === typeof menu) {
        button.style.display = "none";
        return;
    }
    if (-1 === menu.className.indexOf("nav-menu")) menu.className += " nav-menu";
    button.onclick = function() {
        if (-1 !== container.className.indexOf("toggled")) container.className = container.className.replace(" toggled", ""); else container.className += " toggled";
    };
})();
