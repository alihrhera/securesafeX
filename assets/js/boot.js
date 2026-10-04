// Runs before first paint (loaded blocking in <head>): applies the saved or system theme and the
// Arabic direction so visitors never see a flash of the wrong one.
(function () {
    var root = document.documentElement, theme;
    try {
        var q = new URLSearchParams(location.search).get("lang");
        var l = q || JSON.parse(localStorage.getItem("sx_lang") || "null") || ((navigator.language || "").toLowerCase().indexOf("ar") === 0 ? "ar" : "en");
        if (l === "ar") { root.lang = "ar"; root.dir = "rtl"; }
        theme = JSON.parse(localStorage.getItem("sx_theme") || "null");
    } catch (e) { }
    // Saved choice wins; otherwise follow the OS setting (dark is the brand default).
    if (theme !== "light" && theme !== "dark") theme = window.matchMedia && matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    root.setAttribute("data-theme", theme);
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.content = theme === "light" ? "#ffffff" : "#121418";
})();
