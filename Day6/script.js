const quoteEl = document.getElementById("quote");
const authorEl = document.getElementById("author");
const btn = document.getElementById("newQuote");
const spinner = document.getElementById("spinner");
const errorEl = document.getElementById("error");
const categoryEl = document.getElementById("category");
const shareTwitter = document.getElementById("shareTwitter");
const shareLinkedIn = document.getElementById("shareLinkedIn");
const whatsappBtn = document.getElementById("whatsappBtn");

const seenQuotes = new Set();
const CACHE_LIMIT = 5;

// Local quotes : works when API Falis....
const localQuotes = [
  { content: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { content: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { content: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { content: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { content: "Happiness depends upon ourselves.", author: "Aristotle" },
  { content: "Everything you can imagine is real.", author: "Pablo Picasso" },
  { content: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
  { content: "It always seems impossible until it’s done.", author: "Nelson Mandela" },
  { content: "Don’t count the days, make the days count.", author: "Muhammad Ali" },
  { content: "Life is really simple, but we insist on making it complicated.", author: "Confucius" }
];


async function getQuote() {
  const category = categoryEl.value;

  spinner.style.display = "block";
  errorEl.textContent = "";
  quoteEl.textContent = "";
  authorEl.textContent = "";

  try {
    let data;
    let tries = 0;

    do {
      const endpoint = category
        ? `http://api.quotable.io/quotes/random?tags=${encodeURIComponent(category)}`
        : "http://api.quotable.io/quotes/random";

      const res = await fetch(endpoint, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      const arr = await res.json();
      data = Array.isArray(arr) ? arr[0] : arr;
      tries++;
    } while (seenQuotes.has(data._id) && tries < 5);

    seenQuotes.add(data._id);
    if (seenQuotes.size > CACHE_LIMIT) {
      const first = seenQuotes.values().next().value;
      seenQuotes.delete(first);
    }

    quoteEl.textContent = `"${data.content}"`;
    authorEl.textContent = `— ${data.author}`;
    updateShareLinks(data);
  } catch (err) {
    console.warn("API failed, using local quotes:", err);
    showLocalQuote();
  } finally {
    spinner.style.display = "none";
  }
}


function showLocalQuote() {
  const randomQuote = localQuotes[Math.floor(Math.random() * localQuotes.length)];
  quoteEl.textContent = `"${randomQuote.content}"`;
  authorEl.textContent = `— ${randomQuote.author}`;
  updateShareLinks(randomQuote);
}

function updateShareLinks(quote) {
  const text = encodeURIComponent(`"${quote.content}" – ${quote.author}`);

  // Twitter
  shareTwitter.onclick = () =>
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");

  // LinkedIn
  shareLinkedIn.onclick = () =>
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=https://example.com&title=${text}`,
      "_blank"
    );

  // WhatsApp
  whatsappBtn.onclick = () =>
    window.open(`https://wa.me/?text=${text}`, "_blank");
}

window.addEventListener("DOMContentLoaded", getQuote);
btn.addEventListener("click", getQuote);
categoryEl.addEventListener("change", getQuote);
