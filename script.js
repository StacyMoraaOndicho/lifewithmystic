
// Quotes auto-rotate + manual next
const quotes = [
  { text: "The universe whispers to those who listen with the soul.", author: "— lifewithmystic" },
  { text: "The moon keeps its secrets with grace; so should you.", author: "— lifewithmystic" },
  { text: "Every silence is a bridge to the sacred within.", author: "— lifewithmystic" },
  { text: "Walk humbly, and the wind will carry your prayers.", author: "— lifewithmystic" },
  { text: "You are not lost; you are learning the shape of your path.", author: "— lifewithmystic" },
  { text: "What you water in darkness will bloom in the dawn.", author: "— lifewithmystic" },
  { text: "Let your heart be a lantern where fear used to live.", author: "— lifewithmystic" },
  { text: "When you make room for wonder, it always finds you.", author: "— lifewithmystic" }
];
let qi = 0;
const quoteEl = () => document.querySelector('.quote');
const authorEl = () => document.querySelector('.quote-author');
function renderQuote(i){
  const q = quotes[i % quotes.length];
  quoteEl().classList.add('fade');
  setTimeout(()=>{
    quoteEl().textContent = q.text;
    authorEl().textContent = q.author;
    quoteEl().classList.remove('fade');
  }, 450);
}
function nextQuote(){ qi = (qi+1) % quotes.length; renderQuote(qi); }
setInterval(nextQuote, 5500);
document.addEventListener('DOMContentLoaded', ()=> renderQuote(qi));
window.nextQuote = nextQuote;
// Optional tile background images via data-bg attr
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-bg]').forEach(el => {
    const src = el.getAttribute('data-bg');
    if (src && src !== 'none') el.style.backgroundImage = `url(${src})`;
  });
});
