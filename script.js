// PHOTO-FIRST WEDDING SITE THEME
// Edit everything in CONFIG, then commit.

const CONFIG = {
  couple: { bride: "Tina", groom: "Donovan", lastName: "Morris" },
  event: {
    dateISO: "", // e.g., "2026-08-21T17:00:00-04:00"
    city: "New Jersey, USA",
    venueName: "",
    venueAddress: "",
    mapUrl: "",
    dressCode: "Formal / Black Tie Optional",
  },
  // HERO SLIDES (add your photo URLs here; use raw GitHub links or external hosts)
  heroSlides: [
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=2000&q=80"
  ],
  // SECTION BACKGROUNDS (optional)
  backgrounds: {
    story: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    travel: "https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&w=1600&q=80"
  },
  // Featured small grid photos on Home
  featuredPhotos: [
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1520975922076-4f7f2dc88bcd?auto=format&fit=crop&w=800&q=80"
  ],
  rsvp: {
    type: "link", // "link" | "mailto"
    link: "",
    mailto: "mailto:morriswedding2026@example.com?subject=RSVP%20Donovan%20%26%20Tina",
    deadline: ""
  },
  hotels: [], // [{ name, details, url, phone, cutoff, distance }]
  schedule: [
    { time: "4:00 PM", title: "Guest Arrival & Seating", desc: "Please be seated 10 minutes before the ceremony." },
    { time: "5:00 PM", title: "Ceremony", desc: "Outdoor, with indoor rain plan." },
    { time: "6:00 PM", title: "Cocktail Hour", desc: "Passed hors d'oeuvres & signature cocktails." },
    { time: "7:00 PM", title: "Reception", desc: "Dinner, speeches, and dancing." },
    { time: "10:45 PM", title: "Grand Exit", desc: "Sparklers (venue permitting)." }
  ],
  registry: [], // [{ name, url }]
  contacts: { email: "morriswedding2026@example.com", phone: "(555) 222-3333" },
  faq: [
    { q: "Is the ceremony indoors or outdoors?", a: "Planned outdoors with an indoor rain plan at the venue." },
    { q: "Can I bring a guest?", a: "Please refer to your invitation." },
    { q: "Are kids welcome?", a: "Adults-only celebration unless noted on your invite." },
    { q: "Where should we park?", a: "On-site parking; shuttles will run from hotel blocks." }
  ]
};

// DOM helpers
const $ = (id) => document.getElementById(id);

// Tabs
function selectTab(id){
  document.querySelectorAll(".tab").forEach((btn) => btn.classList.toggle("nav-active", btn.dataset.tab === id));
  document.querySelectorAll("main > section").forEach((sec) => sec.classList.toggle("hidden", sec.id !== "page-"+id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Countdown + ICS
function fmtFull(dtISO){
  return new Date(dtISO).toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" });
}
function generateICS(){
  if(!CONFIG.event.dateISO) return "";
  const start = new Date(CONFIG.event.dateISO);
  const end = new Date(start.getTime() + 4*60*60*1000);
  const p = (n,l=2)=>String(n).padStart(l,"0");
  const fmt = (d)=> d.getUTCFullYear()+p(d.getUTCMonth()+1)+p(d.getUTCDate())+"T"+p(d.getUTCHours())+p(d.getUTCMinutes())+p(d.getUTCSeconds())+"Z";
  const { bride, groom, lastName } = CONFIG.couple;
  const { venueName, venueAddress } = CONFIG.event;
  const ics = [
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Wedding//EN","BEGIN:VEVENT",
    "UID:"+Date.now()+"@wedding.site",
    "DTSTAMP:"+fmt(new Date()),
    "DTSTART:"+fmt(start),
    "DTEND:"+fmt(end),
    "SUMMARY:"+groom+" & "+bride+" "+lastName+" – Wedding",
    "LOCATION:"+`${venueName} ${venueAddress}`.replace(/,/g,"\\,"),
    "END:VEVENT","END:VCALENDAR"
  ].join("\\n");
  return URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
}
function startCountdown(){
  if(!CONFIG.event.dateISO) return;
  function tick(){
    const t = new Date(CONFIG.event.dateISO).getTime();
    const s = Math.max(0, Math.floor((t - Date.now())/1000));
    const d = Math.floor(s/86400);
    const h = Math.floor((s%86400)/3600);
    const m = Math.floor((s%3600)/60);
    const sec = s%60;
    $("cdDays").textContent = String(d).padStart(2,"0");
    $("cdHours").textContent = String(h).padStart(2,"0");
    $("cdMinutes").textContent = String(m).padStart(2,"0");
    $("cdSeconds").textContent = String(sec).padStart(2,"0");
  }
  tick(); setInterval(tick, 1000);
}

// HERO slideshow
function renderHeroSlides(){
  const holder = document.getElementById("heroSlides");
  holder.innerHTML = "";
  CONFIG.heroSlides.forEach((url, i) => {
    const div = document.createElement("div");
    div.className = "hero-slide" + (i===0 ? " active" : "");
    div.style.backgroundImage = `url('${url}')`;
    holder.appendChild(div);
  });
  let idx = 0;
  setInterval(() => {
    const slides = holder.querySelectorAll(".hero-slide");
    slides.forEach(s => s.classList.remove("active"));
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add("active");
  }, 6000);
}

// Render
function render(){
  // Init tabs
  document.querySelectorAll(".tab").forEach(btn => btn.addEventListener("click", () => selectTab(btn.dataset.tab)));
  selectTab("home");

  // Hero text
  $("heroTitle").textContent = `${CONFIG.couple.groom} & ${CONFIG.couple.bride}`;
  $("eventTag").textContent = CONFIG.event.city || "";
  renderHeroSlides();

  // Buttons
  const rsvpBtn = $("rsvpBtn"), icsBtn = $("icsBtn");
  if(CONFIG.rsvp.type === "link" && CONFIG.rsvp.link){
    rsvpBtn.href = CONFIG.rsvp.link; rsvpBtn.classList.remove("hidden");
  } else if(CONFIG.rsvp.type === "mailto" && CONFIG.rsvp.mailto){
    rsvpBtn.href = CONFIG.rsvp.mailto; rsvpBtn.textContent = "RSVP via Email"; rsvpBtn.classList.remove("hidden");
  }
  const ics = generateICS(); if(ics){ icsBtn.href = ics; icsBtn.classList.remove("hidden"); }
  if(CONFIG.rsvp.deadline){ document.getElementById("rsvpDeadline").textContent = `RSVP by ${new Date(CONFIG.rsvp.deadline).toLocaleDateString()}`; }

  // Details
  $("eventWhen").textContent = CONFIG.event.dateISO ? fmtFull(CONFIG.event.dateISO) : "TBD";
  $("eventWhere").textContent = (CONFIG.event.venueName && CONFIG.event.venueAddress) ? `${CONFIG.event.venueName} — ${CONFIG.event.venueAddress}` : "TBD";
  $("dressCode").textContent = CONFIG.event.dressCode || "TBD";
  if(CONFIG.event.mapUrl){ const m = $("mapLink"); m.href = CONFIG.event.mapUrl; m.classList.remove("hidden"); }

  // Schedules
  const s1 = $("scheduleFull"); s1.innerHTML = "";
  CONFIG.schedule.forEach(s=>{
    const li = document.createElement("li");
    li.className = "py-4 flex items-start justify-between gap-4";
    li.innerHTML = `<div class="text-rose-700 font-semibold whitespace-nowrap">${s.time}</div>
    <div><div class="font-medium">${s.title}</div><div class="text-sm text-gray-600">${s.desc}</div></div>`;
    s1.appendChild(li);
  });

  // Hotels
  const hotels = $("hotelsGrid"); hotels.innerHTML = "";
  CONFIG.hotels.forEach(h=>{
    const card = document.createElement("div");
    card.className = "border border-rose-100 rounded-xl p-5 bg-white";
    card.innerHTML = `<div class="flex items-center justify-between gap-4">
      <div><div class="text-lg font-semibold">${h.name}</div><div class="text-sm text-gray-600">${h.details||""}</div></div>
      <span class="px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-medium">${h.distance||""}</span>
    </div>
    <div class="mt-3 text-sm space-y-1">
      ${h.url ? `<div><span class="font-medium">Booking link:</span> <a class="text-rose-700 underline" href="${h.url}" target="_blank" rel="noreferrer">Reserve</a></div>` : ""}
      ${h.phone ? `<div><span class="font-medium">Phone:</span> ${h.phone}</div>` : ""}
      <div><span class="font-medium">Cutoff:</span> ${h.cutoff ? new Date(h.cutoff).toLocaleDateString() : "—"}</div>
    </div>`;
    hotels.appendChild(card);
  });

  // Registry
  const reg = $("registryBtns"); reg.innerHTML = "";
  CONFIG.registry.forEach(r=>{
    const a = document.createElement("a");
    a.href = r.url; a.target = "_blank"; a.rel = "noreferrer";
    a.className = "px-4 py-2 rounded-full bg-rose-600 text-white text-sm font-semibold shadow hover:bg-rose-700 transition";
    a.textContent = r.name; reg.appendChild(a);
  });

  // FAQ
  const faq = $("faqGrid"); faq.innerHTML = "";
  CONFIG.faq.forEach(item=>{
    const box = document.createElement("div");
    box.innerHTML = `<div class="font-semibold">${item.q}</div><p class="text-gray-600 mt-1">${item.a}</p>`;
    faq.appendChild(box);
  });

  // Featured photos grid
  const fr = document.getElementById("featuredRow"); fr.innerHTML = "";
  CONFIG.featuredPhotos.forEach(url => {
    const img = document.createElement("img");
    img.src = url; img.alt = "photo"; img.className = "w-full h-full rounded-xl shadow cursor-pointer";
    img.addEventListener("click", () => openModal(url));
    fr.appendChild(img);
  });

  // Section backgrounds
  if(CONFIG.backgrounds.story) document.getElementById("storyBg").style.backgroundImage = `url('${CONFIG.backgrounds.story}')`;
  if(CONFIG.backgrounds.travel) document.getElementById("travelBg").style.backgroundImage = `url('${CONFIG.backgrounds.travel}')`;

  // Contact + footer
  const mail = $("contactEmail"); mail.href = `mailto:${CONFIG.contacts.email}`; mail.textContent = CONFIG.contacts.email;
  const phone = $("contactPhone"); phone.href = `tel:${CONFIG.contacts.phone}`; phone.textContent = CONFIG.contacts.phone;
  $("footerMadeWith").textContent = `Made with ♥ by ${CONFIG.couple.groom} for ${CONFIG.couple.bride}`;
  $("footerCopy").textContent = `© ${new Date().getFullYear()} ${CONFIG.couple.groom} & ${CONFIG.couple.bride} ${CONFIG.couple.lastName}`;

  // Countdown
  startCountdown();
}

// Gallery modal
function openModal(src){
  const m = document.getElementById("modal"), i = document.getElementById("modalImg");
  i.src = src; m.classList.add("open");
  m.addEventListener("click", ()=> m.classList.remove("open"), { once: true });
}

// Boot
render();
