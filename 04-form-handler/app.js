// 04 · Form handler
// ======================================================================
// THE WORKER: this is the part you edit.
// It has the same shape as a real Cloudflare Worker: it receives a standard
// Request and must return a standard Response.
// ======================================================================
const worker = {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return Response.json({ ok: false, error: "use POST" }, { status: 405 });
    }

    const form = await request.formData();
    const name = (form.get("name") || "").trim();
    const email = (form.get("email") || "").trim();
    const message = (form.get("message") || "").trim();

    if (!email || !email.includes("@")) {
      return Response.json({ ok: false, error: "Please give a valid email address." }, { status: 400 });
    }

    // TODO 1: reject a message shorter than 10 characters (status 400).

    // TODO 2: spam trap. If form.get("website") is not empty, a bot filled it in:
    //         return { ok: true } WITHOUT calling sendEmail.

    await sendEmail(env, { name, email, message });
    return Response.json({ ok: true });
  },
};

// ======================================================================
// THE PRETEND PLATFORM (no need to change below here)
// Next session these become real: the Cloudflare network and an email service.
// ======================================================================
const env = { MY_EMAIL: "me@example.co.uk" };

async function sendEmail(env, msg) {
  await new Promise((r) => setTimeout(r, 400));   // email services take a moment
  const box = document.querySelector("#inbox");
  if (box.querySelector(".hint")) box.innerHTML = "";
  box.insertAdjacentHTML("afterbegin",
    `<article><b>From:</b> ${esc(msg.name || "(no name)")} &lt;${esc(msg.email)}&gt;<br>
     <b>To:</b> ${esc(env.MY_EMAIL)}<p>${esc(msg.message || "(empty message)")}</p></article>`);
}

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fly(back = false) {
  const p = $("#packet");
  p.className = back ? "back" : "go";
  await sleep(700);
  p.className = "";
}

$("#bot").addEventListener("change", (e) => {
  document.querySelector("[name=website]").value = e.target.checked ? "http://cheap-pills.example" : "";
});

$("#contact").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const request = new Request("https://my-portfolio.example/api/contact", { method: "POST", body: data });

  $("#req").textContent = `POST /api/contact\n\n` +
    [...data.entries()].map(([k, v]) => `${k} = ${JSON.stringify(v)}`).join("\n");
  $("#res").textContent = "…";
  $("#result").textContent = "Sending…"; $("#result").className = "result";
  await fly();

  let response;
  try {
    response = await worker.fetch(request, env);
  } catch (err) {
    response = Response.json({ ok: false, error: "Worker crashed: " + err.message }, { status: 500 });
  }
  const json = await response.clone().json().catch(() => ({}));
  $("#res").textContent = `HTTP ${response.status}\ncontent-type: ${response.headers.get("content-type")}\n\n` +
    JSON.stringify(json, null, 2);
  $("#res").className = response.ok ? "ok" : "err";
  await fly(true);

  $("#result").textContent = json.ok ? "Thanks! Your message is on its way." : (json.error || "Something went wrong.");
  $("#result").className = "result " + (json.ok ? "ok" : "err");
  if (json.ok) e.target.reset(), ($("#bot").checked = false);
});
