// --- CONFIG ---
const CONFIG = {
  couple: { bride: "Tina", groom: "Donovan", lastName: "Morris" },
  event: {
    dateISO: "",
    city: "New Jersey, USA",
    venueName: "",
    venueAddress: "",
    mapUrl: "",
    dressCode: "Formal / Black Tie Optional",
    heroImage:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1920&q=80",
  },
  rsvp: { type: "link", link: "", mailto: "", deadline: "" },
  hotels: [],
  schedule: [],
  registry: [],
  contacts: { email: "morriswedding2026@example.com", phone: "(555) 222-3333" },
  faq: [],
};

function $(id){return document.getElementById(id);}
function render(){
  $("heroBg").style.backgroundImage = `url('${CONFIG.event.heroImage}')`;
  $("heroTitle").textContent = `${CONFIG.couple.groom} & ${CONFIG.couple.bride} ${CONFIG.couple.lastName}`;
  $("eventTag").textContent = CONFIG.event.city;
  $("footerCopy").textContent = `© ${new Date().getFullYear()} ${CONFIG.couple.groom} & ${CONFIG.couple.bride} ${CONFIG.couple.lastName}`;
}
render();