// sample cars data (replace or extend)
const cars = [
  { id: 'c1', name: 'Hatch X - Economy', type: 'economy', seats: 4, price: 20, img: '' },
  { id: 'c2', name: 'City Sedan - Economy', type: 'economy', seats: 5, price: 28, img: '' },
  { id: 'c3', name: 'Trail SUV', type: 'suv', seats: 7, price: 60, img: '' },
  { id: 'c4', name: 'Lux Cruiser', type: 'luxury', seats: 5, price: 120, img: '' },
  { id: 'c5', name: 'Sportster 2-seater', type: 'luxury', seats: 2, price: 140, img: '' }
];

const carsGrid = document.getElementById('carsGrid');
const filterType = document.getElementById('filterType');
const filterSeats = document.getElementById('filterSeats');
const filterBtn = document.getElementById('filterBtn');
const resetBtn = document.getElementById('resetBtn');
const quickCar = document.getElementById('quickCar');
const quickForm = document.getElementById('quickForm');
const bookingStatus = document.getElementById('bookingStatus');

function renderCars(list){
  carsGrid.innerHTML = '';
  list.forEach(car=>{
    const card = document.createElement('div');
    card.className = 'card car';
    card.innerHTML = `
      <div class="thumb">${car.name}</div>
      <h4>${car.name}</h4>
      <div class="meta">Type: ${car.type.toUpperCase()} • Seats: ${car.seats} • $${car.price}/day</div>
      <div class="actions">
        <button class="action-btn" data-id="${car.id}">Book</button>
        <button class="action-btn" data-info="${car.id}">Details</button>
      </div>
    `;
    carsGrid.appendChild(card);
  });
  // attach handlers
  document.querySelectorAll('.action-btn').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      if(e.target.dataset.id) openBooking(e.target.dataset.id);
      else openDetails(e.target.dataset.info);
    });
  });
}

function populateQuickCars(){
  quickCar.innerHTML = '';
  cars.forEach(c=>{
    const opt = document.createElement('option');
    opt.value = c.id; opt.textContent = `${c.name} — $${c.price}/day`;
    quickCar.appendChild(opt);
  });
}

// filter action
filterBtn.addEventListener('click', ()=>{
  const t = filterType.value;
  const s = filterSeats.value;
  let filtered = cars.slice();
  if(t) filtered = filtered.filter(c=>c.type===t);
  if(s) filtered = filtered.filter(c=>String(c.seats)===s);
  renderCars(filtered);
});
resetBtn.addEventListener('click', ()=>{
  filterType.value = ''; filterSeats.value = '';
  renderCars(cars);
});

// quick booking
quickForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const pickup = document.getElementById('pickup').value;
  const dropoff = document.getElementById('dropoff').value;
  const carId = quickCar.value;
  if(!pickup || !dropoff || !carId){ bookingStatus.textContent = 'Please fill all fields.'; return; }
  const car = cars.find(c=>c.id===carId);
  const booking = { id: 'b'+Date.now(), car: car.name, pickup, dropoff, created: new Date().toISOString() };
  const bookings = JSON.parse(localStorage.getItem('sr_bookings')||'[]');
  bookings.push(booking);
  localStorage.setItem('sr_bookings', JSON.stringify(bookings));
  bookingStatus.textContent = `Booked ${car.name} from ${pickup} to ${dropoff}. (Saved locally)`;
  quickForm.reset();
});

// modal utilities
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');
function openDetails(id){
  const car = cars.find(c=>c.id===id);
  modalContent.innerHTML = `
    <h3>${car.name}</h3>
    <p>Type: ${car.type}</p>
    <p>Seats: ${car.seats}</p>
    <p>Price: $${car.price}/day</p>
    <p class="muted">Demo details. Replace with richer content and images.</p>
    <div style="margin-top:12px"><button id="bookNow" class="btn">Book This Car</button></div>
  `;
  modal.setAttribute('aria-hidden','false');
  document.getElementById('bookNow').addEventListener('click', ()=>{ openBooking(id); });
}
function openBooking(id){
  const car = cars.find(c=>c.id===id);
  modalContent.innerHTML = `
    <h3>Book: ${car.name}</h3>
    <form id="bookForm">
      <label>Pick-up <input type="date" id="mPickup" required /></label><br/><br/>
      <label>Drop-off <input type="date" id="mDropoff" required /></label><br/><br/>
      <label>Your name <input type="text" id="mName" placeholder="Full name" required /></label><br/><br/>
      <button class="btn" type="submit">Confirm Booking</button>
    </form>
  `;
  modal.setAttribute('aria-hidden','false');
  document.getElementById('bookForm').addEventListener('submit',(e)=>{
    e.preventDefault();
    const pickup = document.getElementById('mPickup').value;
    const dropoff = document.getElementById('mDropoff').value;
    const name = document.getElementById('mName').value.trim();
    if(!pickup || !dropoff || !name){ alert('Fill all fields'); return; }
    const booking = { id:'b'+Date.now(), car:car.name, pickup, dropoff, name, created:new Date().toISOString() };
    const bookings = JSON.parse(localStorage.getItem('sr_bookings')||'[]'); bookings.push(booking);
    localStorage.setItem('sr_bookings', JSON.stringify(bookings));
    modalContent.innerHTML = `<p>Thanks ${name}! Your booking for ${car.name} from ${pickup} to ${dropoff} is saved locally.</p>`;
  });
}
closeModal.addEventListener('click', ()=>{ modal.setAttribute('aria-hidden','true'); });
modal.addEventListener('click', (e)=>{ if(e.target===modal) modal.setAttribute('aria-hidden','true'); });

// theme toggle
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
themeToggle.addEventListener('click', ()=>{
  if(root.dataset.theme==='light'){ delete root.dataset.theme; themeToggle.textContent='🌙'; }
  else{ root.dataset.theme='light'; themeToggle.textContent='🌞'; }
});

// init
renderCars(cars);
populateQuickCars();
