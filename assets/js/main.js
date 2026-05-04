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
