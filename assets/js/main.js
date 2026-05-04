document.addEventListener('DOMContentLoaded', () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        timeZone: 'Africa/Nairobi',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const ids = ['privacyDate', 'termsDate', 'cookieDate', 'cancelDate'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = currentDate;
    });
});

// Intersection Observer for fade-up
const fadeElements = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
fadeElements.forEach(el => observer.observe(el));

// Sticky navbar
const navbarWrapper = document.getElementById('navbarWrapper');
window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
        if (!navbarWrapper.classList.contains('sticky-nav')) {
            navbarWrapper.classList.add('sticky-nav');
            document.body.classList.add('nav-fixed-padding');
        }
    } else {
        if (navbarWrapper.classList.contains('sticky-nav')) {
            navbarWrapper.classList.remove('sticky-nav');
            document.body.classList.remove('nav-fixed-padding');
        }
    }
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const parent = btn.closest('.faq-item');
        const isOpen = parent.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('open');
            item.querySelector('.faq-answer').style.maxHeight = null;
        });
        if (!isOpen) {
            parent.classList.add('open');
            const answer = parent.querySelector('.faq-answer');
            answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
        }
    });
});

const offcanvasElement = document.getElementById('mobileOffcanvas');
if (offcanvasElement) {
    // When offcanvas starts to show, hide the entire navbar wrapper (the bar with logo + menu button)
    offcanvasElement.addEventListener('show.bs.offcanvas', function () {
        if (navbarWrapper) {
            navbarWrapper.style.display = 'none';
        }
    });
    // When offcanvas is fully hidden, restore navbar wrapper visibility
    offcanvasElement.addEventListener('hidden.bs.offcanvas', function () {
        if (navbarWrapper) {
            navbarWrapper.style.display = '';
        }
    });
}

const offcanvasEl = document.getElementById('mobileOffcanvas');
offcanvasEl.addEventListener('show.bs.offcanvas', () => { if (navbarWrapper) navbarWrapper.style.display = 'none'; });
offcanvasEl.addEventListener('hidden.bs.offcanvas', () => { if (navbarWrapper) navbarWrapper.style.display = ''; });

// Filter functionality for experiences
const filterButtons = document.querySelectorAll('.filter-btn');
const experienceCards = document.querySelectorAll('.exp-card');

function filterExperiences(category) {
    experienceCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Category filtering
const btns = document.querySelectorAll('.filter-btn');
const items = document.querySelectorAll('.vehicle-item');
function filterVehicles(cat) {
    items.forEach(i => { i.style.display = (cat === 'all' || i.dataset.category === cat) ? 'block' : 'none'; });
}
btns.forEach(btn => {
    btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterVehicles(btn.dataset.filter);
    });
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.getAttribute('data-filter');
        filterExperiences(category);
    });
});

// Category filtering
// const filterButtons = document.querySelectorAll('.filter-btn');
const accommodationItems = document.querySelectorAll('.accommodation-item');
function filterAccommodations(category) {
    accommodationItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// const filterBtns = document.querySelectorAll('.filter-btn');
const rentalItems = document.querySelectorAll('.rental-item');
function filterRentals(category) {
    rentalItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}
// filterBtns.forEach(btn => {
//     btn.addEventListener('click', () => {
//         filterBtns.forEach(b => b.classList.remove('active'));
//         btn.classList.add('active');
//         filterRentals(btn.getAttribute('data-filter'));
//     });
// });
// filterButtons.forEach(btn => {
//     btn.addEventListener('click', () => {
//         filterButtons.forEach(b => b.classList.remove('active'));
//         btn.classList.add('active');
//         filterAccommodations(btn.getAttribute('data-filter'));
//     });
// });


// Existing functions: fade-up, sticky navbar, showTab, toggleRoom, replyToReview, addNewReview, escapeHtml (preserved)
// Additional: calendar logic for availability tab
let currentDate = new Date(2026, 3, 1); // April 2026
let selectedStart = null, selectedEnd = null;
// Booked dates (YYYY-MM-DD)
const bookedDates = ["2026-04-10", "2026-04-11", "2026-04-12", "2026-04-13", "2026-04-14", "2026-04-15", "2026-04-20", "2026-04-21", "2026-04-22", "2026-04-23", "2026-04-24", "2026-04-25", "2026-05-05", "2026-05-06", "2026-05-07", "2026-05-08", "2026-05-09", "2026-05-10"];

function isBooked(date) { return bookedDates.includes(date.toISOString().split('T')[0]); }
function clearSelection() { selectedStart = null; selectedEnd = null; renderCalendar(); updateSelectionText(); }
// function updateSelectionText() {
//     const span = document.getElementById('selectedRangeText');
//     if (selectedStart && selectedEnd) span.innerText = `${selectedStart.toDateString()} → ${selectedEnd.toDateString()}`;
//     else if (selectedStart) span.innerText = `${selectedStart.toDateString()} (select check-out)`;
//     else span.innerText = 'None';
// }
function updateSelectionText() {
    const input = document.getElementById('selectedRangeText');

    if (!input) return;

    if (selectedStart && selectedEnd) {
        input.value = `${selectedStart.toDateString()} → ${selectedEnd.toDateString()}`;
    }
    else if (selectedStart) {
        input.value = `${selectedStart.toDateString()} (select check-out)`;
    }
    else {
        input.value = '';
    }
}
function renderCalendar() {
    const year = currentDate.getFullYear(), month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const calendarDiv = document.getElementById('calendarRoot');
    if (!calendarDiv) return;
    let html = `<div class="calendar-header"><button class="calendar-nav" onclick="changeMonth(-1)"><i class="fas fa-chevron-left"></i> Prev</button><h4 class="m-0">${firstDay.toLocaleString('default', { month: 'long' })} ${year}</h4><button class="calendar-nav" onclick="changeMonth(1)">Next <i class="fas fa-chevron-right"></i></button></div><div class="calendar-weekdays">${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div>${d}</div>`).join('')}</div><div class="calendar-days">`;
    let dayCount = 1;
    for (let i = 0; i < 42; i++) {
        let dayNum, isCurrentMonth = true, dateObj;
        if (i < startWeekday) { dayNum = prevMonthDays - (startWeekday - i) + 1; isCurrentMonth = false; dateObj = new Date(year, month - 1, dayNum); }
        else if (i >= startWeekday + daysInMonth) { dayNum = i - (startWeekday + daysInMonth) + 1; isCurrentMonth = false; dateObj = new Date(year, month + 1, dayNum); }
        else { dayNum = i - startWeekday + 1; dateObj = new Date(year, month, dayNum); }
        const dateStr = dateObj.toISOString().split('T')[0];
        const booked = isBooked(dateObj);
        let classes = 'calendar-day';
        if (!isCurrentMonth) classes += ' other-month';
        if (booked) classes += ' booked';
        else classes += ' selectable';
        if (selectedStart && dateObj.toDateString() === selectedStart.toDateString()) classes += ' selected-start';
        else if (selectedEnd && dateObj.toDateString() === selectedEnd.toDateString()) classes += ' selected-end';
        else if (selectedStart && selectedEnd && dateObj > selectedStart && dateObj < selectedEnd && !booked) classes += ' in-range';
        html += `<div class="${classes}" data-date="${dateStr}" data-timestamp="${dateObj.getTime()}">${dayNum}</div>`;
    }
    html += `</div><div class="mt-3"><button class="btn btn-sm btn-outline-danger" onclick="clearSelection()">Clear selection</button></div>`;
    calendarDiv.innerHTML = html;
    attachCalendarEvents();
}
function attachCalendarEvents() {
    document.querySelectorAll('.calendar-day.selectable:not(.booked)').forEach(el => {
        el.addEventListener('click', (e) => {
            const timestamp = parseInt(el.dataset.timestamp);
            const clickedDate = new Date(timestamp);
            if (!selectedStart || (selectedStart && selectedEnd)) { selectedStart = clickedDate; selectedEnd = null; }
            else if (selectedStart && !selectedEnd) {
                if (clickedDate > selectedStart) {
                    let hasBooked = false;
                    for (let d = new Date(selectedStart); d <= clickedDate; d.setDate(d.getDate() + 1)) {
                        if (isBooked(new Date(d))) { hasBooked = true; break; }
                    }
                    if (hasBooked) alert('Selected range includes a booked date. Please choose another range.');
                    else { selectedEnd = clickedDate; }
                } else { selectedStart = clickedDate; selectedEnd = null; }
            }
            renderCalendar();
            updateSelectionText();
        });
    });
}
function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    renderCalendar();
}
function initCalendarIfNeeded() { if (document.getElementById('calendarRoot') && !document.getElementById('calendarRoot').innerHTML) renderCalendar(); }
document.getElementById('bookNowAvailBtn')?.addEventListener('click', () => {
    if (selectedStart && selectedEnd) alert(`✨ Booking request for Watamu Beach Resort from ${selectedStart.toDateString()} to ${selectedEnd.toDateString()}. Our team will contact you shortly.`);
    else alert('Please select valid check-in and check-out dates from the calendar.');
});

function showTab(tabId) { document.querySelectorAll('.tab-pane').forEach(tab => tab.classList.remove('active')); document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active')); document.getElementById(tabId).classList.add('active'); event.target.closest('.tab-btn').classList.add('active'); if (tabId === 'availability') initCalendarIfNeeded(); }
function toggleRoom(header) { header.classList.toggle('collapsed'); const content = header.nextElementSibling; if (content.style.display === 'none') content.style.display = 'block'; else content.style.display = 'none'; }
document.querySelectorAll('.room-content').forEach(el => el.style.display = 'block');
function replyToReview(btn) { const input = btn.previousElementSibling; const replyText = input.value.trim(); if (!replyText) return alert('Please enter a reply.'); const reviewCard = btn.closest('.review-card'); let adminDiv = reviewCard.querySelector('.admin-reply'); if (!adminDiv) { adminDiv = document.createElement('div'); adminDiv.className = 'admin-reply'; reviewCard.appendChild(adminDiv); } adminDiv.innerHTML = `<strong>Resort Manager:</strong><br>${escapeHtml(replyText)}`; input.value = ''; }
function addNewReview() { const name = document.getElementById('reviewerName').value.trim(); const rating = parseInt(document.getElementById('reviewRating').value); const text = document.getElementById('reviewText').value.trim(); if (!name || !text) return alert('Please fill name and review.'); const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating); const reviewsDiv = document.getElementById('reviewsList'); const newReview = document.createElement('div'); newReview.className = 'review-card'; newReview.innerHTML = `<div class="review-header d-flex justify-content-between"><strong>${escapeHtml(name)}</strong><span>Just now</span></div><div class="review-rating">${stars}</div><p>${escapeHtml(text)}</p><div class="reply-form"><input type="text" class="reply-input" placeholder="Write a reply..."><button class="reply-btn" onclick="replyToReview(this)">Reply</button></div>`; reviewsDiv.prepend(newReview); document.getElementById('reviewerName').value = ''; document.getElementById('reviewText').value = ''; alert('Review added! Thank you.'); }
function escapeHtml(str) { return str.replace(/[&<>]/g, function (m) { if (m === '&') return '&amp;'; if (m === '<') return '&lt;'; if (m === '>') return '&gt;'; return m; }); }
window.initCalendarIfNeeded = initCalendarIfNeeded;

// Booking
// DOM elements
const stayTypeBtn = document.getElementById('stayTypeBtn');
const expTypeBtn = document.getElementById('experienceTypeBtn');
const stayFields = document.getElementById('stayFields');
const expFields = document.getElementById('experienceFields');
const bookingTypeInput = document.getElementById('bookingType');

// Stay specific inputs
const stayProperty = document.getElementById('stayProperty');
const checkin = document.getElementById('checkin');
const checkout = document.getElementById('checkout');
const nightsInput = document.getElementById('nights');
const adults = document.getElementById('adults');
const children = document.getElementById('children');

// Experience inputs
const experienceItem = document.getElementById('experienceItem');
const participantsInput = document.getElementById('participants');

// Common price display
const totalSpan = document.getElementById('totalAmountDisplay');
const breakdownSpan = document.getElementById('breakdownText');

// Toggle between Stay and Experience
function setBookingType(type) {
    if (type === 'stay') {
        stayTypeBtn.classList.add('active');
        expTypeBtn.classList.remove('active');
        stayFields.style.display = 'block';
        expFields.style.display = 'none';
        bookingTypeInput.value = 'stay';
        // Mark required attributes for stay fields, remove for experience
        document.getElementById('stayProperty').required = true;
        document.getElementById('checkin').required = true;
        document.getElementById('checkout').required = true;
        if (experienceItem) experienceItem.required = false;
        if (document.getElementById('experienceDate')) document.getElementById('experienceDate').required = false;
    } else {
        expTypeBtn.classList.add('active');
        stayTypeBtn.classList.remove('active');
        stayFields.style.display = 'none';
        expFields.style.display = 'block';
        bookingTypeInput.value = 'experience';
        document.getElementById('stayProperty').required = false;
        document.getElementById('checkin').required = false;
        document.getElementById('checkout').required = false;
        if (experienceItem) experienceItem.required = true;
        if (document.getElementById('experienceDate')) document.getElementById('experienceDate').required = true;
    }
    updateTotal();
}

stayTypeBtn.addEventListener('click', () => setBookingType('stay'));
expTypeBtn.addEventListener('click', () => setBookingType('experience'));

// Calculate nights for stay
function calculateNights() {
    if (checkin.value && checkout.value) {
        const start = new Date(checkin.value);
        const end = new Date(checkout.value);
        if (end > start) {
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            nightsInput.value = diffDays;
            return diffDays;
        } else if (end.getTime() === start.getTime()) {
            nightsInput.value = 1;
            return 1;
        } else {
            nightsInput.value = 0;
            return 0;
        }
    }
    return 0;
}

function updateTotal() {
    const type = bookingTypeInput.value;
    if (type === 'stay') {
        const selectedOption = stayProperty.options[stayProperty.selectedIndex];
        let pricePerNight = 0;
        if (selectedOption && selectedOption.dataset.price) {
            pricePerNight = parseInt(selectedOption.dataset.price);
        }
        let nights = calculateNights();
        if (isNaN(nights)) nights = 0;
        let adultCount = parseInt(adults.value) || 1;
        let childCount = parseInt(children.value) || 0;
        // simple pricing: extra adult over 2 adds 25%? but for simplicity: base * nights
        let total = pricePerNight * nights;
        // minor adjustment for extra guests: each extra adult +20% of nightly rate per night
        if (adultCount > 2) {
            let extra = adultCount - 2;
            total += (pricePerNight * 0.2) * nights * extra;
        }
        if (childCount > 0) {
            total += (pricePerNight * 0.1) * nights * childCount;
        }
        if (pricePerNight === 0 || nights === 0) {
            totalSpan.innerText = 'KES 0';
            breakdownSpan.innerText = 'Select property and dates to see total.';
        } else {
            totalSpan.innerText = `KES ${total.toLocaleString()}`;
            breakdownSpan.innerText = `${nights} night(s) at KES ${pricePerNight}/night + extra guest fees if any.`;
        }
    } else { // experience
        const selectedExp = experienceItem.options[experienceItem.selectedIndex];
        let pricePerPerson = 0;
        if (selectedExp && selectedExp.dataset.price) {
            pricePerPerson = parseInt(selectedExp.dataset.price);
        }
        let participants = parseInt(participantsInput.value) || 1;
        let total = pricePerPerson * participants;
        if (pricePerPerson === 0 || !selectedExp.value) {
            totalSpan.innerText = 'KES 0';
            breakdownSpan.innerText = 'Select an experience to see price.';
        } else {
            totalSpan.innerText = `KES ${total.toLocaleString()}`;
            breakdownSpan.innerText = `${participants} participant(s) × KES ${pricePerPerson} per person`;
        }
    }
}

// attach listeners
stayProperty.addEventListener('change', updateTotal);
checkin.addEventListener('change', () => { calculateNights(); updateTotal(); });
checkout.addEventListener('change', () => { calculateNights(); updateTotal(); });
adults.addEventListener('input', updateTotal);
children.addEventListener('input', updateTotal);
experienceItem.addEventListener('change', updateTotal);
participantsInput.addEventListener('input', updateTotal);

// Set default stay property listener
calculateNights();
updateTotal();

// Form submission
const bookingForm = document.getElementById('bookingForm');
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = bookingTypeInput.value;
    let isValid = true;
    const guestName = document.getElementById('guestName').value.trim();
    const guestEmail = document.getElementById('guestEmail').value.trim();
    const guestPhone = document.getElementById('guestPhone').value.trim();

    if (!guestName || !guestEmail || !guestPhone) {
        alert('Please fill in your full name, email and phone number.');
        isValid = false;
    }
    if (type === 'stay') {
        if (!stayProperty.value || !checkin.value || !checkout.value) {
            alert('Please select a property and check-in/out dates.');
            isValid = false;
        }
        const nights = calculateNights();
        if (nights <= 0) {
            alert('Check-out date must be after check-in date.');
            isValid = false;
        }
    } else {
        if (!experienceItem.value || !document.getElementById('experienceDate').value) {
            alert('Please select an experience and preferred date.');
            isValid = false;
        }
    }
    if (!isValid) return;

    // Build summary message
    let details = '';
    if (type === 'stay') {
        details = `🏨 Stay: ${stayProperty.options[stayProperty.selectedIndex]?.text}\n📅 ${checkin.value} to ${checkout.value} (${nightsInput.value} nights)\n👥 ${adults.value} Adults, ${children.value} Children\n💰 Total: ${totalSpan.innerText}`;
    } else {
        details = `🎒 Experience: ${experienceItem.options[experienceItem.selectedIndex]?.text}\n📅 Date: ${document.getElementById('experienceDate').value}\n⏰ Timeslot: ${document.getElementById('timeSlot').value}\n👤 Participants: ${participantsInput.value}\n💰 Total: ${totalSpan.innerText}`;
    }
    const message = `✅ Booking Request Received!\n\nGuest: ${guestName}\nEmail: ${guestEmail}\nPhone: ${guestPhone}\n\n${details}\n\nSpecial Requests: ${document.getElementById('specialRequests').value || 'None'}\n\nA confirmation email will be sent shortly. Our team will contact you for payment.`;
    alert(message);
    // In real scenario: redirect to payment or store in DB. For demo, reset some fields optionally.
    bookingForm.reset();
    // reset to default stay view
    setBookingType('stay');
    document.getElementById('guestName').value = '';
    document.getElementById('guestEmail').value = '';
    document.getElementById('guestPhone').value = '';
    updateTotal();
});
