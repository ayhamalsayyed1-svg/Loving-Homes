document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOMContentLoaded started ===');
    
    // Header scroll effect
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Initialize emailjs only if it's available
    if (window.emailjs) {
        emailjs.init("jF285qrtXiiLkhOnp");
    }

    // Contact form listener - check if element exists
    const contactForm = document.getElementById("contactForm");
    if (contactForm && window.emailjs) {
        contactForm.addEventListener("submit", function(event){
            event.preventDefault();
            emailjs.sendForm(
                "service_dv49lpb",
                "template_08wzapp",
                this
            )
            .then(function() {
                alert("تم ارسال الرسالة بنجاح");
                contactForm.reset();
            }, function(error) {
                alert("فشل ارسال الرسالة");
            });
        });
    }

    // Booking form listener - check if element exists
    const bookingForm = document.getElementById("bookingForm");
    if (bookingForm && window.emailjs) {
        bookingForm.addEventListener("submit", function(e){
            e.preventDefault();
            emailjs.sendForm(
                "service_dv49lpb",
                "template_j9rr40n",
                this
            ).then(function(){
                alert("تم ارسال طلب الحجز بنجاح");
                bookingForm.reset();
            }, function(error){
                alert("حدث خطأ في ارسال الحجز");
            });
        });
    }

   
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Text resizing (A+ / A-)
    const increaseBtn = document.getElementById('fontIncrease');
    const decreaseBtn = document.getElementById('fontDecrease');
    const root = document.documentElement;
    function setFontSize(size) {
        root.style.fontSize = size + 'px';
        localStorage.setItem('fontSize', size);
    }
    function adjustFont(delta) {
        let current = parseInt(getComputedStyle(root).fontSize);
        if (isNaN(current)) current = 16;
        const newSize = Math.max(12, Math.min(24, current + delta));
        setFontSize(newSize);
    }
    if (increaseBtn) increaseBtn.addEventListener('click', () => adjustFont(1));
    if (decreaseBtn) decreaseBtn.addEventListener('click', () => adjustFont(-1));
    // restore font size
    const savedSize = localStorage.getItem('fontSize');
    if (savedSize) setFontSize(Number(savedSize));

    // Booking form submission (for booking page)
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const ownerName = document.getElementById('ownerName').value;
            const petName = document.getElementById('petName').value;
            const pkg = document.getElementById('package').value;
            const days = document.getElementById('numDays').value;
            const cost = document.getElementById('totalCost').value;
            let message = `شكراً لك ${ownerName}! تم استلام حجزك لـ ${petName}.`;
            if (pkg) message += ` الباقة: ${pkg}.`;
            if (days) message += ` عدد الأيام: ${days}.`;
            if (cost) message += ` التكلفة الإجمالية: ${cost}.`;
            message += ' سنتواصل معك قريباً لتأكيد الحجز.';
            alert(message);
            bookingForm.reset();
        });
    }

    // helper inputs for booking cost calculation
    console.log('=== Looking for booking form elements ===');
    const packageSelect = document.getElementById('package');
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    const numDaysInput = document.getElementById('numDays');
    const costInput = document.getElementById('totalCost');

    // Log for debugging
    console.log('Booking form elements:', {
        packageSelect,
        checkInInput,
        checkOutInput,
        numDaysInput,
        costInput
    });

    function calculateBookingCosts() {
        console.log('calculateBookingCosts called');
        
        const pkgVal = packageSelect ? packageSelect.value : '';
        const checkIn = checkInInput ? checkInInput.value : '';
        const checkOut = checkOutInput ? checkOutInput.value : '';
        let days = 0;
        
        if (checkIn && checkOut) {
            try {
                const d1 = new Date(checkIn);
                const d2 = new Date(checkOut);
                const timeDiff = d2 - d1;
                
                if (timeDiff > 0) {
                    days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                }
                
                console.log('Days calculated:', days, 'from', checkIn, 'to', checkOut);
                
                if (numDaysInput) {
                    numDaysInput.value = days;
                    console.log('numDaysInput.value set to:', numDaysInput.value);
                }
            } catch (e) {
                console.error('Error calculating days:', e);
            }
        } else {
            console.log('checkIn or checkOut is empty');
            if (numDaysInput) {
                numDaysInput.value = '';
            }
        }
        
        let price = 0;
        if (pkgVal === 'premium') price = 700;
        else if (pkgVal === 'classic') price = 500;
        else if (pkgVal === 'daily') price = 200;
        
        const total = price * days;
        
        if (costInput) {
            costInput.value = `$${total}`;
            console.log('costInput.value set to:', costInput.value);
        } else {
            console.error('costInput is null');
        }
        
        console.log('Booking calculation:', { pkgVal, days, price, total });
    }

    if (packageSelect) {
        packageSelect.addEventListener('change', calculateBookingCosts);
        packageSelect.addEventListener('input', calculateBookingCosts);
    }
    if (checkInInput) {
        checkInInput.addEventListener('change', calculateBookingCosts);
        checkInInput.addEventListener('input', calculateBookingCosts);
        checkInInput.addEventListener('blur', calculateBookingCosts);
    }
    if (checkOutInput) {
        checkOutInput.addEventListener('change', calculateBookingCosts);
        checkOutInput.addEventListener('input', calculateBookingCosts);
        checkOutInput.addEventListener('blur', calculateBookingCosts);
    }
    
    console.log('=== Event listeners attached ===');

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Package selection alert (for packages page)
    const selectBtns = document.querySelectorAll('.select-package-btn');
    selectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const packageName = this.getAttribute('data-package');
            window.location.href = 'booking.html?package=' + packageName;
        });
    });

    // if on booking page or if parameters present, prefill and compute
    console.log('=== Calling applyPackageFromQuery and calculateBookingCosts ===');
    applyPackageFromQuery();
    if (packageSelect) {
        calculateBookingCosts();
    }

    // prepare dark mode toggle
    initDarkMode();

    // initialize enhanced sidebar interactions if present
    initSidebarInteractions();
});

// Voice playback function
function toggleVoice() {
    const audio = document.getElementById('voiceAudio');
    const voiceIcon = document.getElementById('voiceIcon');
    const voiceText = document.getElementById('voiceText');
    
    if (audio && voiceIcon && voiceText) {
        if (audio.paused) {
            audio.play().catch(e => {
                console.error('Audio play failed:', e);
            });
            voiceIcon.classList.remove('fa-volume-up');
            voiceIcon.classList.add('fa-pause');
            voiceText.textContent = 'إيقاف الصوت';
        } else {
            audio.pause();
            audio.currentTime = 0;
            voiceIcon.classList.remove('fa-pause');
            voiceIcon.classList.add('fa-volume-up');
            voiceText.textContent = 'استمع للرسالة';
        }
        
        audio.onended = function() {
            voiceIcon.classList.remove('fa-pause');
            voiceIcon.classList.add('fa-volume-up');
            voiceText.textContent = 'استمع للرسالة';
        };
    }
}

// fills the package select on booking page from URL query
function applyPackageFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const pkg = params.get('package');
    if (pkg) {
        const select = document.getElementById('package');
        if (select) select.value = pkg;
    }
}

// handles dark mode toggle and persistence
function initDarkMode() {
    const body = document.body;
    const toggle = document.getElementById('darkModeBtn');
    const icon = toggle ? toggle.querySelector('i') : null;
    const current = localStorage.getItem('darkMode');
    if (current === 'enabled') {
        body.classList.add('dark');
        if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
    }
    if (toggle) {
        toggle.addEventListener('click', () => {
            body.classList.toggle('dark');
            if (body.classList.contains('dark')) {
                localStorage.setItem('darkMode','enabled');
                if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
            } else {
                localStorage.setItem('darkMode','disabled');
                if (icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
            }
        });
    }
}


// sidebar interaction helpers for services page
function initSidebarInteractions() {
    const sidebars = document.querySelectorAll('.services-sidebar');
    sidebars.forEach(sidebar => {
        const items = sidebar.querySelectorAll('ul > li');
        items.forEach((li, idx) => {
            li.classList.add('reveal-item');
            li.style.animationDelay = `${idx * 0.08}s`;
        });

        // create or reuse indicator
        let indicator = sidebar.querySelector('.sidebar-indicator');
        if (!indicator) {
            indicator = document.createElement('span');
            indicator.className = 'sidebar-indicator';
            sidebar.appendChild(indicator);
        }

        const moveIndicator = (targetLi) => {
            if (!targetLi) return;
            const offsetTop = targetLi.offsetTop;
            const height = targetLi.offsetHeight;
            indicator.style.transform = `translateY(${offsetTop}px)`;
            indicator.style.height = height + 'px';
        };

        const currentPage = window.location.pathname.split('/').pop();
        let activeLi = sidebar.querySelector(`a[href="${currentPage}"]`);
        if (activeLi) activeLi = activeLi.parentElement;
        if (!activeLi) activeLi = items[0];
        moveIndicator(activeLi);

        items.forEach(li => {
            const a = li.querySelector('a');
            if (!a) return;
            a.addEventListener('click', (e) => {
                createRipple(e);
                moveIndicator(li);
            });
        });

        const headers = sidebar.querySelectorAll('h3');
        headers.forEach(h3 => {
            const next = h3.nextElementSibling;
            if (next && next.tagName === 'UL') {
                next.style.maxHeight = next.scrollHeight + 'px';
                h3.addEventListener('click', () => {
                    const isCollapsed = next.classList.toggle('collapsed');
                    h3.classList.toggle('collapsed', isCollapsed);
                    if (isCollapsed) {
                        next.style.maxHeight = '0';
                    } else {
                        next.style.maxHeight = next.scrollHeight + 'px';
                    }
                });
            }
        });
    });
}

function createRipple(e) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const circle = document.createElement('span');
    circle.className = 'ripple';
    const d = Math.max(rect.width, rect.height);
    circle.style.width = circle.style.height = d + 'px';
    circle.style.left = e.clientX - rect.left - d/2 + 'px';
    circle.style.top = e.clientY - rect.top - d/2 + 'px';
    el.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
}
