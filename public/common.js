// Shared helpers used by every page.

function getBaseUrl() {
  return localStorage.getItem("apiBaseUrl") || "";
}
function setBaseUrl(url) {
  localStorage.setItem("apiBaseUrl", url.replace(/\/+$/, ""));
}
function getToken() {
  return localStorage.getItem("authToken");
}
function setToken(token) {
  localStorage.setItem("authToken", token);
}
function clearToken() {
  localStorage.removeItem("authToken");
}

async function apiFetch(path, options = {}) {
  const res = await fetch(getBaseUrl() + "/auth/login");
  let body = null;
  try { body = await res.json(); } catch (e) { /* no body */ }
  return { res, body };
}

function showMsg(el, text, ok) {
  el.textContent = text;
  el.className = "msg show " + (ok ? "ok" : "err");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

// Renders the shared top nav into any element with id="nav".
function renderNav(activePage) {
  const nav = document.getElementById("nav");
  if (!nav) return;
  const loggedIn = !!getToken();
  const pages = [
    { href: "index.html", label: "Home" },
    { href: "register.html", label: "Register" },
    { href: "login.html", label: "Login" },
    { href: "users.html", label: "Users" },
  ];
  const links = pages.map(p =>
    `<a href="${p.href}" class="${p.href === activePage ? "active" : ""}">${p.label}</a>`
  ).join("");
  nav.innerHTML = `
    <span class="brand">Backend Demo</span>
    ${links}
    <span class="pill ${loggedIn ? "" : "off"}">${loggedIn ? "logged in" : "logged out"}</span>
    ${loggedIn ? '<a href="#" id="logoutLink">Logout</a>' : ""}
  `;
  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      clearToken();
      renderNav(activePage);
      location.reload();
    });
  }
}

// Fills the "API base URL" input (id="baseUrl") if present, and wires it to save on change.
function wireBaseUrlInput() {
  const input = document.getElementById("baseUrl");
  if (!input) return;
  input.value = getBaseUrl();
  input.addEventListener("change", () => setBaseUrl(input.value));
}
