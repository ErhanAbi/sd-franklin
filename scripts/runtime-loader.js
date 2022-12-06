!(function (e, t) {
  if (t.location === t.parent.location)
    throw new Error("Module Runtime: Needs to be within an iframe!");
  if (!t["exc-module-runtime"] || !t["exc-module-runtime"].Runtime) {
    var r = (function (e) {
      var t = new URL(e.location.href).searchParams.get("_mr");
      if (!t)
        try {
          t = e.parent.document.querySelector("script#runtimeScript").src;
        } catch {}
      return t || !e.EXC_US_HMR
        ? t
        : e.sessionStorage.getItem("unifiedShellMRScript");
    })(t);
    if (!r) throw new Error("Module Runtime: Missing script!");
    if ("https:" !== (r = new URL(decodeURIComponent(r))).protocol)
      throw new Error("Module Runtime: Must be HTTPS!");
    if (
      !/^(exc-unifiedcontent\.)?experience(-qa|-stage|-cdn|-cdn-stage)?\.adobe\.(com|net)$/.test(
        r.hostname
      ) &&
      !/localhost\.corp\.adobe\.com$/.test(r.hostname)
    )
      throw new Error("Module Runtime: Invalid domain!");
    if (!/\.js$/.test(r.pathname))
      throw new Error("Module Runtime: Must be a JavaScript file!");
    t.EXC_US_HMR &&
      t.sessionStorage.setItem("unifiedShellMRScript", r.toString());
    var n = e.createElement("script");
    (n.async = 1),
      (n.src = r.toString()),
      (n.onload = n.onreadystatechange =
        function () {
          (n.readyState && !/loaded|complete/.test(n.readyState)) ||
            ((n.onload = n.onreadystatechange = null),
            (n = void 0),
            "EXC_MR_READY" in t && t.EXC_MR_READY());
        }),
      t._srp?.handleError && (n.onerror = t._srp.handleError),
      e.head.appendChild(n);
  }
})(document, window);
