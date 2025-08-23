// --- CONFIG ---
// Edit the values below and push to GitHub Pages. No build step required.
const CONFIG = {
  couple: { bride: "Tina", groom: "Donovan", lastName: "Morris" },
  event: {
    dateISO: "2026-08-21T17:00:00-04:00",
    city: "New Jersey",
    venueName: "Venue TBD",
    venueAddress: "123 Example Rd, NJ 00000",
    mapUrl: "https://maps.google.com",
    dressCode: "Formal / Black Tie Optional",
    heroImage:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1920&q=80",
  },
  rsvp: {
    type: "link", // "link" | "mailto"
    link: "https://forms.gle/your-form-id",
    mailto:
      "mailto:morriswedding2026@example.com?subject=RSVP%20Donovan%20%26%20Tina%20Wedding",
    deadline: "2026-07-15",
  },
  hotels: [
    {
      name: "Hotel A (Courtesy Block)",
      details: "Ask for the Morris Wedding Rate.",
      url: "https://example.com/hotelA",
      phone: "(555) 000-0000",
      cutoff: "2026-07-21",
      distance: "10 min shuttle",
    },
    {
      name: "Hotel B",
      details: "Shuttle provided day-of.",
      url: "https://example.com/hotelB",
      phone: "(555) 111-1111",
      cutoff: "2026-07-21",
      distance: "6 min drive",
    },
  ],
  schedule: [
    { time: "4:00 PM", title: "Guest Arrival & Seating", desc: "Please be seated by 4:50 PM." },
    { time: "5:00 PM", title: "Ceremony", desc: "Outdoor garden (indoor back‑up on site)." },
    { time: "6:00 PM", title: "Cocktail Hour", desc: "Passed hors d'oeuvres & signature cocktails." },
    { time: "7:00 PM", title: "Reception", desc: "Dinner, speeches, and dancing." },
    { time: "10:45 PM", title: "Grand Exit", desc: "Sparklers (venue rules permitting)." },
  ],
  registry: [
    { name: "Zola", url: "https://www.zola.com/registry/your-handle" },
    { name: "Amazon", url: "https://www.amazon.com/wedding/your-handle" },
    { name: "Honeyfund", url: "https://www.honeyfund.com/site/your-handle" },
  ],
  contacts: { email: "morriswedding2026@example.com", phone: "(555) 222-3333" },
  faq: [
    { q: "Is the ceremony indoors or outdoors?", a: "Planned outdoors with an indoor rain plan at the venue." },
    { q: "Can I bring a guest?", a: "Please refer to your invitation; we love you either way!" },
    { q: "Are kids welcome?", a: "Adults‑only celebration unless noted on your invite." },
    { q: "Where should we park?", a: "On‑site parking; shuttles run from hotel blocks one hour prior." },
  ],
};

// --- RENDER LOGIC ---
function $(id){ return document.getElementById(id); }

function fmtFull(dtISO){
  return new Date(dtISO).toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" });
}

function fmtDayTag(dtISO, city){
  return new Date(dtISO).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" }) + " • " + city;
}

function generateICS(){
  const start = new Date(CONFIG.event.dateISO);
  const end = new Date(start.getTime() + 4*60*60*1000);
  const pad = (n,l=2)=>String(n).padStart(l,"0");
  const fmt = (d)=> d.getUTCFullYear()+pad(d.getUTCMonth()+1)+pad(d.getUTCDate())+"T"+pad(d.getUTCHours())+pad(d.getUTCMinutes())+pad(d.getUTCSeconds())+"Z";
  const { bride, groom, lastName } = CONFIG.couple;
  const { venueName, venueAddress } = CONFIG.event;
  const ics = [
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Morris Wedding//EN","BEGIN:VEVENT",
    "UID:"+Date.now()+"@morris.wedding",
    "DTSTAMP:"+fmt(new Date()),
    "DTSTART:"+fmt(start),
    "DTEND:"+fmt(end),
    "SUMMARY:"+groom+" & "+bride+" "+lastName+" – Wedding",
    "LOCATION:"+venueName.replace(/,/g,"\\,")+"\\, "+venueAddress.replace(/,/g,"\\,"),
    "END:VEVENT","END:VCALENDAR"
  ].join("\\n");
  return URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
}

function countdownTick(){
  const target = new Date(CONFIG.event.dateISO).getTime();
  const now = Date.now();
  const ms = Math.max(target - now, 0);
  const s = Math.floor(ms/1000);
  const days = Math.floor(s/86400);
  const hours = Math.floor((s%86400)/3600);
  const minutes = Math.floor((s%3600)/60);
  const seconds = s%60;
  $("cdDays").textContent = String(days).padStart(2,"0");
  $("cdHours").textContent = String(hours).padStart(2,"0");
  $("cdMinutes").textContent = String(minutes).padStart(2,"0");
  $("cdSeconds").textContent = String(seconds).padStart(2,"0");
}

function render(){
  // Hero
  $("heroImage").src = CONFIG.event.heroImage;
  $("eventTag").textContent = fmtDayTag(CONFIG.event.dateISO, CONFIG.event.city);
  $("heroTitle").textContent = `${CONFIG.couple.groom} & ${CONFIG.couple.bride} ${CONFIG.couple.lastName}`;
  $("rsvpDeadline").textContent = `RSVP by ${new Date(CONFIG.rsvp.deadline).toLocaleDateString()}`;
  const rsvpBtn = $("rsvpBtn");
  if(CONFIG.rsvp.type === "link"){ rsvpBtn.href = CONFIG.rsvp.link; rsvpBtn.textContent = "RSVP"; }
  else { rsvpBtn.href = CONFIG.rsvp.mailto; rsvpBtn.textContent = "RSVP via Email"; }
  const icsUrl = generateICS();
  $("icsBtn").href = icsUrl;

  // Details
  $("eventWhen").textContent = fmtFull(CONFIG.event.dateISO);
  $("eventWhere").textContent = `${CONFIG.event.venueName} — ${CONFIG.event.venueAddress}`;
  $("dressCode").textContent = CONFIG.event.dressCode;
  const map = $("mapLink"); map.href = CONFIG.event.mapUrl;

  // Schedule
  const sched = $("scheduleList"); sched.innerHTML = "";
  CONFIG.schedule.forEach(s=>{
    const li = document.createElement("li");
    li.className = "py-3 flex items-start justify-between gap-4";
    li.innerHTML = `<div class="text-rose-700 font-semibold whitespace-nowrap">${s.time}</div>
    <div><div class="font-medium">${s.title}</div><div class="text-sm text-gray-600">${s.desc}</div></div>`;
    sched.appendChild(li);
  });

  // Hotels
  const hotels = $("hotelsGrid"); hotels.innerHTML = "";
  CONFIG.hotels.forEach(h=>{
    const card = document.createElement("div");
    card.className = "border border-rose-100 rounded-xl p-5 bg-white";
    card.innerHTML = `<div class="flex items-center justify-between gap-4">
      <div><div class="text-lg font-semibold">${h.name}</div><div class="text-sm text-gray-600">${h.details}</div></div>
      <span class="px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-medium">${h.distance||""}</span>
    </div>
    <div class="mt-3 text-sm space-y-1">
      <div><span class="font-medium">Booking link:</span> <a class="text-rose-700 underline" href="${h.url}" target="_blank" rel="noreferrer">Reserve</a></div>
      <div><span class="font-medium">Phone:</span> ${h.phone||""}</div>
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
    a.textContent = r.name;
    reg.appendChild(a);
  });

  // FAQ
  const faq = $("faqGrid"); faq.innerHTML = "";
  CONFIG.faq.forEach(item=>{
    const box = document.createElement("div");
    box.innerHTML = `<div class="font-semibold">${item.q}</div><p class="text-gray-600 mt-1">${item.a}</p>`;
    faq.appendChild(box);
  });

  // Contact + footer
  const mail = $("contactEmail"); mail.href = `mailto:${CONFIG.contacts.email}`; mail.textContent = CONFIG.contacts.email;
  const phone = $("contactPhone"); phone.href = `tel:${CONFIG.contacts.phone}`; phone.textContent = CONFIG.contacts.phone;
  $("footerMadeWith").textContent = `Made with ♥ by ${CONFIG.couple.groom} for ${CONFIG.couple.bride}`;
  $("footerCopy").textContent = `© ${new Date().getFullYear()} ${CONFIG.couple.groom} & ${CONFIG.couple.bride} ${CONFIG.couple.lastName}`;
}

render();
countdownTick();
setInterval(countdownTick, 1000);
