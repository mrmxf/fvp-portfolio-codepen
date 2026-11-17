// 02 · Be the server
// A pretend web server, like nginx in about 40 lines.
// Read handleRequest() first: that's the part you'll change.

// ---- the disk: path -> file contents ---------------------------------
const disk = {
  "index.html": "<h1>Welcome to my portfolio</h1>\n<p>Photos, films and words.</p>",
  "about.html": "<h1>About me</h1>\n<p>Second-year film student.</p>",
  "new-page.html": "<h1>The new page</h1>",
  "style.css": "body { font-family: Georgia, serif; }",
};

// ---- file extension -> content-type ---------------------------------
// The browser uses this to decide what to do with the bytes.
const contentTypes = {
  html: "text/html",
  css: "text/css",
  js: "text/javascript",
  // TODO 3: images need their own type, e.g.  jpg: "image/jpeg",
};

// ---- redirects: old path -> new path ---------------------------------
const redirects = {
  // Bonus: "/old-page": "/new-page.html",
};

// ---- THE SERVER -------------------------------------------------------
// Gets a path such as "/about.html" and returns
// { status, statusText, headers: {...}, body }
function handleRequest(path) {
  // Bonus: if (redirects[path]) return { status: 301, ... }

  let file = path.replace(/^\//, ""); // "/about.html" -> "about.html"

  // TODO 1: if the path ends with "/", serve "index.html" from that folder.

  const body = disk[file];

  // TODO 2: if body is undefined the file isn't on the disk:
  //         return a 404 with a short "Not Found" page.

  const ext = file.split(".").pop();
  return {
    status: 200,
    statusText: "OK",
    headers: {
      "content-type": contentTypes[ext] || "application/octet-stream",
      "content-length": String((body || "").length),
    },
    body: body || "",
  };
}

// ---- user interface (no need to change below here) ---------------------
const $ = (s) => document.querySelector(s);
let selected = "index.html";

function drawFiles() {
  $("#files").innerHTML = "";
  Object.keys(disk).sort().forEach((name) => {
    const li = document.createElement("li");
    li.textContent = name;
    li.className = name === selected ? "on" : "";
    li.onclick = () => { selected = name; drawFiles(); };
    $("#files").append(li);
  });
  $("#file-body").value = disk[selected] ?? "";
}

$("#file-body").addEventListener("input", (e) => { disk[selected] = e.target.value; });

$("#add-file").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#new-path").value.trim().replace(/^\//, "");
  if (!name) return;
  disk[name] = name.endsWith(".jpg") ? "(binary image data: pretend this is a photo)" : "";
  selected = name;
  $("#new-path").value = "";
  drawFiles();
});

$("#request").addEventListener("submit", (e) => {
  e.preventDefault();
  const path = $("#path").value.trim() || "/";
  const res = handleRequest(path.startsWith("/") ? path : "/" + path);
  $("#status").textContent = `HTTP/1.1 ${res.status} ${res.statusText}`;
  $("#status").className = "status s" + String(res.status)[0];
  $("#headers").textContent = Object.entries(res.headers || {}).map(([k, v]) => `${k}: ${v}`).join("\n");
  $("#body").textContent = res.body || "(empty)";
});

drawFiles();
$("#request").requestSubmit();
