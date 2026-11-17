// 03 · Scale it
// A tiny load-balancer simulation. 1 real second = 1 simulated second,
// but the cost meter runs 1 real second = 1 hour so you can see the money move.

const CAPACITY = 5;            // requests per second ONE container can serve
const PRICE_PER_HOUR = 0.05;   // £ per container per hour (made-up, but realistic order)
const TICK = 100;              // ms between simulation steps

// ---- BONUS: autoscaling ------------------------------------------------
// Called once a second when "autoscale" is ticked.
// queued = requests waiting across all containers, n = containers running now.
// Return how many containers you want. Keep it between 1 and 12.
function autoscale(queued, n) {
  // e.g. if (queued > 10) return n + 1;
  //      if (queued === 0 && n > 1) return n - 1;
  return n;
}

// ---- simulation (no need to change below here) -----------------------------
const $ = (s) => document.querySelector(s);
let rate = 5, n = 1, spikeUntil = 0, baseRate = 5;
let queues = [[]], workCredit = [0], arrivalCredit = 0, next = 0;
let served = 0, cost = 0, avgWait = 0, t = 0;

function setN(v) {
  n = Math.max(1, Math.min(12, v));
  while (queues.length < n) { queues.push([]); workCredit.push(0); }
  // removed containers hand their queue back to the balancer
  while (queues.length > n) { const q = queues.pop(); workCredit.pop(); q.forEach((r) => queues[0].push(r)); }
  $("#n").value = n; $("#n-out").textContent = n;
}

function step() {
  t += TICK / 1000;
  const now = t;
  if (spikeUntil && now > spikeUntil) { spikeUntil = 0; rate = baseRate; showRate(); }

  // arrivals, shared round-robin by the load balancer
  arrivalCredit += rate * TICK / 1000 * (0.6 + Math.random() * 0.8);
  while (arrivalCredit >= 1) { arrivalCredit -= 1; queues[next % n].push(now); next++; }

  // each container serves up to CAPACITY per second
  queues.forEach((q, i) => {
    workCredit[i] = Math.min(workCredit[i] + CAPACITY * TICK / 1000, CAPACITY);
    while (workCredit[i] >= 1 && q.length) {
      workCredit[i] -= 1;
      const waited = now - q.shift();
      avgWait = avgWait * 0.9 + waited * 0.1;
      served++;
    }
  });
  if (queues.every((q) => !q.length)) avgWait *= 0.97;

  cost += n * PRICE_PER_HOUR * (TICK / 1000);   // 1 real second = 1 hour
  if ($("#auto").checked && Math.round(t * 10) % 10 === 0) setN(autoscale(totalQueued(), n));
  draw();
}

const totalQueued = () => queues.reduce((a, q) => a + q.length, 0);

function draw() {
  const box = $("#containers");
  if (box.children.length !== n) {
    box.innerHTML = "";
    for (let i = 0; i < n; i++) box.insertAdjacentHTML("beforeend",
      `<div class="c"><b>container ${i + 1}</b><div class="q"></div><span class="len"></span></div>`);
  }
  queues.forEach((q, i) => {
    const c = box.children[i];
    c.querySelector(".q").innerHTML = "<i></i>".repeat(Math.min(q.length, 30));
    c.querySelector(".len").textContent = q.length > 30 ? `+${q.length - 30} more` : q.length ? `${q.length} waiting` : "idle";
    c.className = "c " + (q.length > 10 ? "hot" : q.length ? "busy" : "idle");
  });
  $("#wait").textContent = avgWait.toFixed(1);
  $("#wait").className = avgWait > 1 ? "bad" : "";
  $("#queued").textContent = totalQueued();
  $("#served").textContent = served;
  $("#cost").textContent = "£" + cost.toFixed(2);
}

function showRate() { $("#rate").value = rate; $("#rate-out").textContent = rate; }
$("#rate").addEventListener("input", (e) => { baseRate = rate = +e.target.value; spikeUntil = 0; showRate(); });
$("#n").addEventListener("input", (e) => setN(+e.target.value));
$("#spike").addEventListener("click", () => { if (!spikeUntil) baseRate = rate; rate = 45; spikeUntil = t + 8; showRate(); });

setInterval(step, TICK);
