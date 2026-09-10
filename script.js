// --- Fest Config & Catalog Data ---

const ARTISTS = [
  { id: 'a1', name: 'Arijit Singh', genre: 'Romantic / Bollywood', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80' },
  { id: 'a2', name: 'Javed Ali', genre: 'Sufi / Classical', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80' },
  { id: 'a3', name: 'Raftaar', genre: 'Hip-Hop / Rap', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80' },
  { id: 'a4', name: 'Atif Aslam', genre: 'Pop / Romantic', img: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80' },
  { id: 'a5', name: 'Armaan Malik', genre: 'Pop / Bollywood', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80' },
  { id: 'a6', name: 'Nucleya', genre: 'EDM / Bass', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80' }
];

const MENU_ITEMS = [
  { id: 'f1', name: 'Pasta', price: 140, cat: 'Snacks & Main' },
  { id: 'f2', name: 'Chicken Roll', price: 120, cat: 'Snacks & Main' },
  { id: 'f3', name: 'Noodles', price: 100, cat: 'Snacks & Main' },
  { id: 'f4', name: 'Burger', price: 90, cat: 'Snacks & Main' },
  { id: 'f5', name: 'Sizzling Momos', price: 130, cat: 'Snacks & Main' },
  { id: 'f6', name: 'Manchurian', price: 110, cat: 'Snacks & Main' },
  { id: 'f7', name: 'French Fries', price: 80, cat: 'Snacks & Main' },
  { id: 'f8', name: 'Cold Coffee', price: 90, cat: 'Drinks' },
  { id: 'f9', name: 'Sprite', price: 50, cat: 'Drinks' },
  { id: 'f10', name: 'Cold Drink (Cola)', price: 40, cat: 'Drinks' },
  { id: 'f11', name: 'Rosogulla (2 pcs)', price: 60, cat: 'Desserts' },
  { id: 'f12', name: 'Ice Cream', price: 70, cat: 'Desserts' },
  { id: 'f13', name: 'Rasmalai (2 pcs)', price: 80, cat: 'Desserts' },
  { id: 'f14', name: 'Jalebi (100g)', price: 50, cat: 'Desserts' }
];

const EVENT_GAMES = [
  { id: 'g1', name: 'LAN Gaming', price: 100 },
  { id: 'g2', name: 'Scavenger Hunt', price: 80 },
  { id: 'g3', name: 'Face Painting & Tattoo', price: 100 },
  { id: 'g4', name: 'Laser Tag', price: 100 },
  { id: 'g5', name: 'Balloon Darts', price: 80 }
];

// --- App State ---
let pickedArtists = [];
let foodCart = {};
let pickedGames = [];
let userPhotoBase64 = '';

// --- App Init ---
document.addEventListener('DOMContentLoaded', function () {
  renderArtists(ARTISTS);
  renderFoodMenu(MENU_ITEMS);
  renderGamesList(EVENT_GAMES);
  recalculateTotal();

  if (localStorage.getItem('appTheme') === 'light') {
    document.body.classList.add('light-mode');
  }
});

// --- UI Rendering ---

function renderArtists(list) {
  const container = document.getElementById('artists-grid');
  if (!container) return;

  let html = '';
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const active = pickedArtists.includes(item.name);
    
    html += `
      <div class="selection-card ${active ? 'selected' : ''}" 
           onclick="handleArtistSelect('${item.name}')" 
           style="cursor:pointer; border:${active ? '2px solid #f59e0b' : '1px solid #334155'}; padding:10px; border-radius:8px; margin-bottom:10px;">
        <img src="${item.img}" alt="${item.name}" style="width:100%; height:120px; object-fit:cover; border-radius:6px;">
        <div class="card-info">
          <h4 style="margin:8px 0 4px 0;">${item.name}</h4>
          <p style="margin:0; font-size:12px; color:#94a3b8;">${item.genre}</p>
        </div>
      </div>
    `;
  }
  container.innerHTML = html;
}

function renderFoodMenu(items) {
  const container = document.getElementById('food-list');
  if (!container) return;

  const categories = ['Snacks & Main', 'Drinks', 'Desserts'];
  let output = '';

  categories.forEach(category => {
    const group = items.filter(f => f.cat === category);
    if (group.length > 0) {
      output += `<h3 class="category-heading">${category}</h3>`;
      group.forEach(food => {
        const qty = foodCart[food.id] || 0;
        output += `
          <div class="item-row" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; background:rgba(30,41,59,0.5); padding:8px 12px; border-radius:6px;">
            <div>
              <strong>${food.name}</strong>
              <span style="color:#f59e0b; margin-left:8px;">₹${food.price}</span>
            </div>
            <div style="display:flex; gap:8px; align-items:center;">
              <button type="button" onclick="updateFoodQty('${food.id}', -1)" style="padding:2px 8px; cursor:pointer;">-</button>
              <span>${qty}</span>
              <button type="button" onclick="updateFoodQty('${food.id}', 1)" style="padding:2px 8px; cursor:pointer;">+</button>
            </div>
          </div>
        `;
      });
    }
  });

  container.innerHTML = output;
}

function renderGamesList(games) {
  const container = document.getElementById('games-list');
  if (!container) return;

  container.innerHTML = games.map(game => {
    const checked = pickedGames.includes(game.id);
    return `
      <div class="item-row ${checked ? 'selected-row' : ''}" 
           onclick="handleGameSelect('${game.id}')" 
           style="display:flex; justify-content:space-between; align-items:center; cursor:pointer; padding:8px 12px; margin-bottom:8px; background:rgba(30,41,59,0.5); border-radius:6px;">
        <div>
          <strong>${game.name}</strong>
          <span style="color:#f59e0b; margin-left:8px;">₹${game.price}</span>
        </div>
        <input type="checkbox" ${checked ? 'checked' : ''} style="pointer-events:none;">
      </div>
    `;
  }).join('');
}

// --- Interaction Handlers ---

function handleArtistSelect(artistName) {
  const index = pickedArtists.indexOf(artistName);
  if (index > -1) {
    pickedArtists.splice(index, 1);
  } else {
    pickedArtists.push(artistName);
  }
  renderArtists(ARTISTS);
}

function updateFoodQty(id, delta) {
  const current = foodCart[id] || 0;
  const updated = current + delta;

  if (updated <= 0) {
    delete foodCart[id];
  } else {
    foodCart[id] = updated;
  }

  renderFoodMenu(MENU_ITEMS);
  recalculateTotal();
}

function handleGameSelect(gameId) {
  const idx = pickedGames.indexOf(gameId);
  if (idx > -1) {
    pickedGames.splice(idx, 1);
  } else {
    pickedGames.push(gameId);
  }
  renderGamesList(EVENT_GAMES);
  recalculateTotal();
}

function filterCatalog() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  const query = searchInput.value.toLowerCase().trim();

  const filteredArtists = ARTISTS.filter(a => a.name.toLowerCase().includes(query) || a.genre.toLowerCase().includes(query));
  const filteredFood = MENU_ITEMS.filter(f => f.name.toLowerCase().includes(query) || f.cat.toLowerCase().includes(query));
  const filteredGames = EVENT_GAMES.filter(g => g.name.toLowerCase().includes(query));

  renderArtists(filteredArtists);
  renderFoodMenu(filteredFood);
  renderGamesList(filteredGames);
}

function recalculateTotal() {
  const passRadio = document.querySelector('input[name="pass"]:checked');
  const passCost = passRadio ? parseInt(passRadio.getAttribute('data-price')) || 0 : 0;

  let foodCost = 0;
  for (let id in foodCart) {
    const item = MENU_ITEMS.find(f => f.id === id);
    if (item) foodCost += item.price * foodCart[id];
  }

  let gamesCost = 0;
  pickedGames.forEach(gId => {
    const game = EVENT_GAMES.find(g => g.id === gId);
    if (game) gamesCost += game.price;
  });

  const grandTotal = passCost + foodCost + gamesCost;
  const label = document.getElementById('total-price');
  
  if (label) {
    label.innerText = `₹${grandTotal}`;
  }
  return grandTotal;
}

// --- Image & Ticket Handlers ---

function handleFileUpload(evt) {
  const file = evt.target.files[0];
  if (!file) return;

  const fileNameLabel = document.getElementById('file-name-display');
  if (fileNameLabel) fileNameLabel.innerText = file.name;

  const reader = new FileReader();
  reader.onload = function (e) {
    userPhotoBase64 = e.target.result;
    const imgPreview = document.getElementById('image-preview');
    if (imgPreview) {
      imgPreview.src = userPhotoBase64;
      imgPreview.style.display = 'block';
    }
  };
  reader.readAsDataURL(file);
}

function previewImage() {
  const input = document.getElementById('user-image');
  const preview = document.getElementById('image-preview');
  if (!input || !preview) return;

  const url = input.value.trim();
  if (url) {
    userPhotoBase64 = url;
    preview.src = url;
    preview.style.display = 'block';
  } else {
    userPhotoBase64 = '';
    preview.style.display = 'none';
  }
}

function generateTicket() {
  try {
    const nameInput = document.getElementById('user-name');
    const rollInput = document.getElementById('roll-number');

    const name = nameInput ? nameInput.value.trim() : '';
    const roll = rollInput ? rollInput.value.trim() : '';
    const passRadio = document.querySelector('input[name="pass"]:checked');

    if (!name || !roll) {
      alert('Please enter your name and roll number to continue.');
      return;
    }

    const avatar = userPhotoBase64 || 'https://via.placeholder.com/90';
    const passType = passRadio ? passRadio.value : 'BRONZE';
    const totalAmount = document.getElementById('total-price') ? document.getElementById('total-price').innerText : '₹0';
    const ticketCode = 'PASS-' + Math.random().toString(36).substring(2, 7).toUpperCase();

    // Populate ticket fields safely
    const setElemText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.innerText = text;
    };

    setElemText('ticket-user-name', name);
    setElemText('ticket-user-roll', roll);
    setElemText('ticket-pass-type', passType);
    setElemText('ticket-total', totalAmount);
    setElemText('ticket-id', ticketCode);

    const profileImg = document.getElementById('ticket-user-img');
    if (profileImg) profileImg.src = avatar;

    // QR Code rendering (Zero external dependencies)
    const qrBox = document.getElementById('qrcode');
    if (qrBox) {
      const qrData = encodeURIComponent(`ID:${ticketCode}|NAME:${name}|ROLL:${roll}`);
      qrBox.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${qrData}" alt="QR Code" style="width:100px; height:100px; display:block; margin:0 auto;" />`;
    }

    // Save ticket data
    const ticketObj = {
      id: ticketCode,
      name: name,
      roll: roll,
      passType: passType,
      total: totalAmount,
      imgUrl: avatar,
      date: new Date().toLocaleDateString(),
      status: 'ACTIVE',
      checkInTime: null
    };

    const stored = JSON.parse(localStorage.getItem('my_passes') || '[]');
    stored.push(ticketObj);
    localStorage.setItem('my_passes', JSON.stringify(stored));

    // Show ticket result card
    const resultCard = document.getElementById('ticket-result');
    if (resultCard) {
      resultCard.style.display = 'block';
      resultCard.scrollIntoView({ behavior: 'smooth' });
    }
  } catch (err) {
    console.error('Error generating ticket:', err);
    alert('Failed to generate ticket. Please check console for details.');
  }
}

// --- Navigation & Tabs ---

function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  const target = document.getElementById('tab-' + tabId);
  if (target) target.classList.add('active');

  if (window.event && window.event.target) {
    window.event.target.classList.add('active');
  }

  if (tabId === 'my-passes') renderMyPasses();
  if (tabId === 'organizer') renderOrganizerPanel();
}

function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  localStorage.setItem('appTheme', isLight ? 'light' : 'dark');
}

// --- Saved Passes ---

function renderMyPasses() {
  const container = document.getElementById('saved-passes-container');
  if (!container) return;

  const passes = JSON.parse(localStorage.getItem('my_passes') || '[]');

  if (passes.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#94a3b8; grid-column: 1/-1;">No saved passes yet.</p>';
    return;
  }

  container.innerHTML = passes.map((pass, idx) => `
    <div class="saved-pass-wrapper">
      <div id="saved-ticket-${idx}" class="ticket-card">
        <h3 style="color:#f59e0b; margin-top:0;">FEST PASS</h3>
        <img src="${pass.imgUrl}" alt="${pass.name}" style="width:70px; height:70px; border-radius:50%; object-fit:cover; border:2px solid #f59e0b; margin: 10px auto; display:block;">
        <h4 style="margin:5px 0; text-align:center;">${pass.name}</h4>
        <p style="margin:3px 0;">Roll: ${pass.roll}</p>
        <p style="margin:3px 0;">Tier: <strong>${pass.passType} Pass</strong></p>
        <p style="margin:3px 0;">Status: <strong style="color:${pass.status === 'CHECKED_IN' ? '#10b981' : '#f59e0b'};">${pass.status || 'ACTIVE'}</strong></p>
        <p style="margin:3px 0;">Paid: <strong style="color:#10b981;">${pass.total}</strong></p>
        <p style="margin:3px 0;">ID: <span style="font-family:monospace; color:#f59e0b;">${pass.id}</span></p>
      </div>

      <div class="pass-actions" style="margin-top:10px; display:flex; gap:10px; justify-content:center;">
        <button class="cta-btn download-btn" onclick="exportPassPDF('saved-ticket-${idx}', '${pass.id}')">📥 Download PDF</button>
        <button class="cta-btn delete-btn" onclick="removePass('${pass.id}')">🗑️ Delete Pass</button>
      </div>
    </div>
  `).join('');
}

function removePass(id) {
  if (!confirm('Remove this pass from your saved list?')) return;

  let passes = JSON.parse(localStorage.getItem('my_passes') || '[]');
  passes = passes.filter(p => p.id !== id);

  localStorage.setItem('my_passes', JSON.stringify(passes));
  renderMyPasses();
}

// --- Organizer Dashboard ---

function renderOrganizerPanel() {
  const container = document.getElementById('organizer-tickets-list');
  if (!container) return;

  const passes = JSON.parse(localStorage.getItem('my_passes') || '[]');

  if (passes.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#94a3b8;">No registered tickets found in system.</p>';
    return;
  }

  container.innerHTML = passes.map(pass => `
    <div style="border:1px solid #334155; padding:12px; margin-bottom:10px; border-radius:8px; background:rgba(15,23,42,0.6);">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h4 style="margin:0; color:#f59e0b;">${pass.name} (${pass.roll})</h4>
          <p style="margin:4px 0 0 0; font-size:12px; color:#94a3b8;">ID: ${pass.id} | Tier: ${pass.passType}</p>
          <p style="margin:4px 0 0 0; font-size:12px;">Status: <strong>${pass.status || 'ACTIVE'}</strong> ${pass.checkInTime ? `at ${pass.checkInTime}` : ''}</p>
        </div>
        <div style="display:flex; gap:6px;">
          <button onclick="updateStatus('${pass.id}', 'CHECKED_IN')" style="padding:6px 10px; background:#10b981; border:none; color:white; border-radius:4px; cursor:pointer;">✓ Check-In</button>
          <button onclick="updateStatus('${pass.id}', 'CANCELLED')" style="padding:6px 10px; background:#ef4444; border:none; color:white; border-radius:4px; cursor:pointer;">🚫 Cancel</button>
        </div>
      </div>
    </div>
  `).join('');
}

function updateStatus(passId, status) {
  let passes = JSON.parse(localStorage.getItem('my_passes') || '[]');
  
  passes = passes.map(p => {
    if (p.id === passId) {
      p.status = status;
      p.checkInTime = status === 'CHECKED_IN' ? new Date().toLocaleTimeString() : p.checkInTime;
    }
    return p;
  });

  localStorage.setItem('my_passes', JSON.stringify(passes));
  renderOrganizerPanel();
}

// --- PDF Helpers ---

function downloadPDF() {
  const el = document.getElementById('ticket-card');
  if (!el) return;
  
  if (typeof html2pdf !== 'undefined') {
    html2pdf().from(el).save('Fest_Pass.pdf');
  } else {
    window.print();
  }
}

function exportPassPDF(elementId, passId) {
  const el = document.getElementById(elementId);
  if (!el) return;

  if (typeof html2pdf !== 'undefined') {
    const config = {
      margin: 10,
      filename: `Pass_${passId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(config).from(el).save();
  } else {
    window.print();
  }
}