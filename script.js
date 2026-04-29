/**
 * Surya Diagnostic Center – Main JavaScript
 * Features: Sticky navbar, hamburger menu, smooth scroll,
 *           scroll reveal animations, form handling
 */

/* =============================================
   1. NAVBAR – Sticky on Scroll
   ============================================= */
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // Run on load

/* =============================================
   2. HAMBURGER MENU (Mobile)
   ============================================= */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  // Prevent body scroll when menu is open
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* =============================================
   3. ACTIVE NAV LINK on Scroll (Spy)
   ============================================= */
const sections   = document.querySelectorAll('section[id]');
const allLinks   = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  let current = '';
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    if (scrollY >= section.offsetTop) {
      current = section.getAttribute('id');
    }
  });

  allLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });

/* =============================================
   4. SCROLL REVEAL ANIMATIONS
   ============================================= */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Staggered delay based on position in parent
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const index = siblings.indexOf(entry.target);
        const delay = Math.min(index * 80, 400); // max 400ms stagger

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* =============================================
   5. SCROLL TO TOP BUTTON
   ============================================= */
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =============================================
   6. SMOOTH SCROLL for all anchor links
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    const navHeight = navbar.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});

/* =============================================
   7. CONTACT FORM HANDLING — WhatsApp Only
   Zero signup, always free, works instantly.
   ============================================= */
const WHATSAPP_NUMBER = '918484089478'; // +91 8484089478

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const fname    = document.getElementById('fname').value.trim();
    const fphone   = document.getElementById('fphone').value.trim();
    const fservice = document.getElementById('fservice').value;
    const fmessage = document.getElementById('fmessage').value.trim();

    // ── Validation ──────────────────────────────
    if (!fname) {
      showFormMessage('Please enter your full name.', 'error');
      document.getElementById('fname').focus();
      return;
    }
    if (!fphone || fphone.replace(/\D/g, '').length < 10) {
      showFormMessage('Please enter a valid 10-digit phone number.', 'error');
      document.getElementById('fphone').focus();
      return;
    }

    // ── Build WhatsApp message ───────────────────
    const uploadZone      = document.getElementById('uploadZone');
    const hasPrescription = uploadZone?.dataset.hasPrescription === 'true';
    const prescriptionName = uploadZone?.dataset.fileName || '';

    const waText = encodeURIComponent(
      `📋 *New Appointment Request*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Name:* ${fname}\n` +
      `📞 *Phone:* ${fphone}\n` +
      `🩺 *Service:* ${fservice || 'Not specified'}\n` +
      `💬 *Message:* ${fmessage || 'None'}\n` +
      `📄 *Prescription:* ${hasPrescription ? `✅ Attached (${prescriptionName}) — please see image below` : 'Not provided'}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `_Sent via Surya Diagnostic Center website_`
    );
    const waURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

    // ── Loading state ────────────────────────────
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const origHTML  = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening WhatsApp...';
    submitBtn.disabled  = true;

    // ── Open WhatsApp & reset form ───────────────
    setTimeout(() => {
      window.open(waURL, '_blank');
      contactForm.reset();

      // Reset upload zone manually
      const uploadZone = document.getElementById('uploadZone');
      if (uploadZone?.dataset.hasPrescription) {
        document.getElementById('removeFile')?.click();
      }

      submitBtn.innerHTML = origHTML;
      submitBtn.disabled  = false;

      const hasPrescription = uploadZone?.dataset.hasPrescription === 'true';
      showFormMessage(
        hasPrescription
          ? '✅ WhatsApp opened! Please <strong>attach your prescription image</strong> to the message, then hit Send.'
          : '✅ WhatsApp opened! Send the message to confirm your appointment. We\'ll call you back shortly.',
        'success'
      );
    }, 600);
  });
}

function showFormMessage(message, type) {
  // Remove existing message
  const existing = document.querySelector('.form-msg');
  if (existing) existing.remove();

  const msg = document.createElement('div');
  msg.className = `form-msg form-msg-${type}`;
  msg.innerHTML = message;
  msg.style.cssText = `
    padding: 12px 18px;
    border-radius: 10px;
    font-size: 0.88rem;
    font-weight: 500;
    margin-bottom: 16px;
    animation: fadeInMsg 0.3s ease;
    background: ${type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'};
    border: 1px solid ${type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'};
    color: ${type === 'success' ? '#15803D' : '#DC2626'};
  `;

  contactForm.insertBefore(msg, contactForm.firstChild);

  // Auto remove after 6 seconds
  setTimeout(() => {
    if (msg.parentElement) {
      msg.style.opacity = '0';
      msg.style.transition = 'opacity 0.4s ease';
      setTimeout(() => msg.remove(), 400);
    }
  }, 6000);
}

// CSS animation for form message
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInMsg {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

/* =============================================
   8. COUNTER ANIMATION (Stats in Hero)
   ============================================= */
function animateCounter(el, target, suffix = '') {
  const duration = 1800;
  const start    = performance.now();
  const startVal = 0;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(startVal + (target - startVal) * eased);

    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function initCounters() {
  const statNums = document.querySelectorAll('.stat-num');
  let animated   = false;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNums.forEach(el => {
          const raw    = el.textContent.trim();
          const num    = parseInt(raw.replace(/\D/g, ''));
          const suffix = raw.replace(/[0-9]/g, '');
          animateCounter(el, num, suffix);
        });
      }
    });
  }, { threshold: 0.5 });

  if (statNums.length) obs.observe(statNums[0]);
}

/* =============================================
   9. SERVICE CARD TILT EFFECT (Subtle)
   ============================================= */
function initCardTilt() {
  const cards = document.querySelectorAll('.service-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect    = card.getBoundingClientRect();
      const x       = (e.clientX - rect.left) / rect.width  - 0.5;
      const y       = (e.clientY - rect.top)  / rect.height - 0.5;
      const rotX    = (-y * 6).toFixed(2);
      const rotY    = ( x * 6).toFixed(2);

      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* =============================================
   10. GALLERY LIGHTBOX (Simple)
   ============================================= */
function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-item');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const label = item.querySelector('.gallery-overlay span')?.textContent || 'Gallery Image';
      showLightbox(label);
    });
  });
}

function showLightbox(label) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(7,25,46,0.95);
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 16px;
    animation: fadeInMsg 0.25s ease;
    cursor: pointer;
  `;
  overlay.innerHTML = `
    <div style="
      width: min(560px, 90vw); aspect-ratio: 16/9;
      background: rgba(255,255,255,0.06);
      border: 2px dashed rgba(255,255,255,0.2);
      border-radius: 16px;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 14px; color: rgba(255,255,255,0.6);
    ">
      <i class="fas fa-image" style="font-size:3rem;opacity:0.4"></i>
      <span style="font-size:1.05rem;font-weight:600;color:rgba(255,255,255,0.8)">${label}</span>
      <small style="font-size:0.8rem">Image Placeholder — Replace with actual photo</small>
    </div>
    <button style="
      background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
      color: #fff; padding: 10px 28px; border-radius: 50px;
      font-size: 0.9rem; cursor: pointer; font-family: inherit;
    ">✕ Close</button>
  `;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  overlay.addEventListener('click', () => {
    overlay.remove();
    document.body.style.overflow = '';
  });
}

/* =============================================
   11. HERO FLOATING CARDS PARALLAX
   ============================================= */
function initHeroParallax() {
  const floatCards = document.querySelectorAll('.float-card');
  if (!floatCards.length) return;

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 12;
    const y = (e.clientY / window.innerHeight - 0.5) * 12;

    floatCards.forEach((card, i) => {
      const factor = (i + 1) * 0.4;
      card.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });
}

/* =============================================
   PRESCRIPTION UPLOAD — UI & WhatsApp bridge
   ============================================= */
function initPrescriptionUpload() {
  const zone        = document.getElementById('uploadZone');
  const fileInput   = document.getElementById('fprescription');
  const uploadIdle  = document.getElementById('uploadIdle');
  const uploadPrev  = document.getElementById('uploadPreview');
  const previewImg  = document.getElementById('previewImg');
  const previewPdf  = document.getElementById('previewPdf');
  const pdfName     = document.getElementById('pdfName');
  const removeBtn   = document.getElementById('removeFile');
  const uploadNote  = document.getElementById('uploadNote');

  if (!zone) return;

  // Click on zone → trigger file picker
  zone.addEventListener('click', (e) => {
    if (e.target === removeBtn || removeBtn.contains(e.target)) return;
    fileInput.click();
  });

  // Drag & drop
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) handleFile(fileInput.files[0]);
  });

  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    clearFile();
  });

  function handleFile(file) {
    // Validate size (10 MB max)
    if (file.size > 10 * 1024 * 1024) {
      showFormMessage('File is too large. Please upload under 10 MB.', 'error');
      return;
    }

    const isPdf = file.type === 'application/pdf';

    zone.classList.add('has-file');
    uploadIdle.style.display = 'none';
    uploadPrev.style.display = 'flex';
    uploadNote.style.display = 'flex';

    if (isPdf) {
      previewImg.style.display = 'none';
      previewPdf.style.display = 'flex';
      pdfName.textContent = file.name;
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => {
        previewImg.src = ev.target.result;
        previewImg.style.display = 'block';
        previewPdf.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }

    // Store file reference for submit handler
    zone.dataset.fileName = file.name;
    zone.dataset.hasPrescription = 'true';
  }

  function clearFile() {
    fileInput.value = '';
    zone.classList.remove('has-file');
    uploadIdle.style.display = 'flex';
    uploadPrev.style.display = 'none';
    uploadNote.style.display = 'none';
    previewImg.style.display = 'none';
    previewImg.src = '';
    previewPdf.style.display = 'none';
    delete zone.dataset.hasPrescription;
    delete zone.dataset.fileName;
  }
}


document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCounters();
  initCardTilt();
  initGalleryLightbox();
  initHeroParallax();
  initPrescriptionUpload();

  // Trigger active link on load
  updateActiveLink();
});