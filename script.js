/**
 * Product Data
 * Hardcoded as per instructions. All products are 50% off.
 */
const products = [
  {
    brand: "Savvy",
    name: "Savvy Blue Magic Guap Gummy 25mg 1-Pack",
    image_url: "https://skoop-general.s3.us-east-1.amazonaws.com/n8n_image_gen%2Fundefined-1773196700024.png",
    price: "7",
    discounted_price: "3.50",
    strain: "Indica",
    category: "Gummies"
  },
  {
    brand: "Lost Farm",
    name: "Lost Farm Juicy Peach x GSC Sherbet Live Resin Gummies 10mg x 10-Pack",
    image_url: "https://skoop-general.s3.us-east-1.amazonaws.com/n8n_image_gen%2Fundefined-1773196879298.png",
    price: "30",
    discounted_price: "15.00",
    strain: "Hybrid",
    category: "Gummies"
  },
  {
    brand: "URBNJ",
    name: "Orange Malt Flower 7g",
    image_url: "https://leaflogixmedia.blob.core.windows.net/product-image/ce1aabe2-d086-4462-91ad-8f70ef4c5913.jpg",
    price: "65",
    discounted_price: "32.50",
    strain: "Hybrid",
    category: "Whole Flower"
  }
];

/**
 * Dust Motes Particle System
 */
function initDustCanvas() {
  const canvas = document.getElementById('dust-canvas');
  const ctx = canvas.getContext('2d');

  // Resize canvas to window size
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  const particles = [];
  const particleCount = 60;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.2,
      vy: Math.random() * -0.3 - 0.1, // Moving upwards slowly
      opacity: Math.random() * 0.4 + 0.1 // Semi-transparent
    });
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      // Move particles
      p.x += p.vx;
      p.y += p.vy;

      // Add tiny bit of jitter for realism
      p.x += (Math.random() - 0.5) * 0.5;

      // Wrap around screen
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}

/**
 * Utility: Wait for N milliseconds
 */
const delay = (ms) => new Promise(res => setTimeout(res, ms));

/**
 * Create a DOM element from HTML string
 */
function createCardElement(product) {
  const html = `
    <div class="card">
      <div class="card-border"></div>
      <div class="stamp">50% OFF</div>
      <div class="card-content">
        <div class="brand">${product.brand}</div>
        <div class="image-container">
          <img class="product-image" src="${product.image_url}" alt="${product.name}">
        </div>
        <h2 class="title">${product.name}</h2>
        <div class="strain">${product.category} &bull; ${product.strain}</div>

        <div class="price-section">
          <p class="original-price">$${product.price}</p>
          <div class="new-price-container">
            <span class="new-price">$${product.discounted_price}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

/**
 * Core Animation Sequencer
 */
async function runAnimationLoop() {
  const container = document.getElementById('card-container');
  let currentIndex = 0;

  // Infinite loop for digital signage
  while (true) {
    const product = products[currentIndex];

    // 1. Create card and add to DOM
    const cardEl = createCardElement(product);
    container.innerHTML = ''; // Clear previous card
    container.appendChild(cardEl);

    // Give browser a moment to render the initial off-screen state
    await delay(100);

    // 2. Deal the card in
    cardEl.classList.add('deal-in');

    // Wait for deal animation + let user read initial price/product
    await delay(2500);

    // 3. The Smash (Stamp)
    const stampEl = cardEl.querySelector('.stamp');
    stampEl.classList.add('smash');

    // Wait precisely for the moment the stamp hits the card
    await delay(300);

    // 4. Impact effects
    cardEl.classList.add('shake');

    // Strikethrough original price and reveal new price
    const origPriceEl = cardEl.querySelector('.original-price');
    const newPriceContainer = cardEl.querySelector('.new-price-container');

    origPriceEl.classList.add('struck');
    newPriceContainer.classList.add('show');

    // 5. Hold state so user reads the discount
    await delay(4500);

    // 6. Fly the card out
    cardEl.classList.remove('deal-in');
    cardEl.classList.add('fly-out');

    // Wait for fly out animation to finish before starting next
    await delay(1000);

    // Loop to next product
    currentIndex = (currentIndex + 1) % products.length;
  }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
  initDustCanvas();
  runAnimationLoop();
});
