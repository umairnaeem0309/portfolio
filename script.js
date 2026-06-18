document.addEventListener('DOMContentLoaded', function () {

  // ─────────────────────────────────────────────
  // 1. NAVBAR — Mobile Hamburger Toggle
  // ─────────────────────────────────────────────
  var hamburger = document.querySelector('.hamburger');
  var navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var isActive = navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
      // Accessibility: toggle aria-expanded
      hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    var navLinkItems = navLinks.querySelectorAll('a');
    for (var i = 0; i < navLinkItems.length; i++) {
      navLinkItems[i].addEventListener('click', function () {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    }
  }

  // ─────────────────────────────────────────────
  // 1b. NAVBAR — Shadow on Scroll
  // ─────────────────────────────────────────────
  var navbar = document.querySelector('.navbar');

  function handleNavbarShadow() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // ─────────────────────────────────────────────
  // SCROLL PROGRESS BAR
  // ─────────────────────────────────────────────
  var scrollProgress = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    if (!scrollProgress) return;
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = percent + '%';
  }

  // ─────────────────────────────────────────────
  // BACK TO TOP BUTTON
  // ─────────────────────────────────────────────
  var backToTop = document.getElementById('back-to-top');

  function handleBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─────────────────────────────────────────────
  // UNIFIED SCROLL HANDLER (single listener, no jank)
  // ─────────────────────────────────────────────
  window.addEventListener('scroll', function () {
    handleNavbarShadow();
    updateScrollProgress();
    handleBackToTop();
  }, { passive: true });

  // ─────────────────────────────────────────────
  // 7. SMOOTH SCROLL for Anchor Links
  // ─────────────────────────────────────────────
  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  for (var a = 0; a < anchorLinks.length; a++) {
    anchorLinks[a].addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#' || href === '') return;

      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ─────────────────────────────────────────────
  // 8. ACTIVE NAV HIGHLIGHTING on Scroll
  // ─────────────────────────────────────────────
  var sections = document.querySelectorAll('section[id]');
  var allNavLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function highlightActiveNav() {
    var scrollPos = window.scrollY + window.innerHeight * 0.35;

    var currentSection = '';
    for (var s = 0; s < sections.length; s++) {
      var section = sections[s];
      var sectionTop = section.offsetTop;
      var sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    }

    for (var n = 0; n < allNavLinks.length; n++) {
      allNavLinks[n].classList.remove('active');
      var linkHref = allNavLinks[n].getAttribute('href');
      if (linkHref === '#' + currentSection) {
        allNavLinks[n].classList.add('active');
      }
    }
  }

  window.addEventListener('scroll', highlightActiveNav, { passive: true });
  highlightActiveNav();

  // ─────────────────────────────────────────────
  // 2. INTERSECTION OBSERVER — Scroll Animations (Simplified)
  // ─────────────────────────────────────────────
  var animateElements = document.querySelectorAll('.animate-on-scroll');

  // Check for reduced motion preference
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // If reduced motion is preferred, immediately show all elements without intersection observer
    for (var ae = 0; ae < animateElements.length; ae++) {
      animateElements[ae].classList.add('visible');
    }
  } else {
    var scrollObserver = new IntersectionObserver(function (entries) {
      for (var e = 0; e < entries.length; e++) {
        if (entries[e].isIntersecting) {
          entries[e].target.classList.add('visible');
          scrollObserver.unobserve(entries[e].target);
        }
      }
    }, {
      threshold: 0.15
    });

    for (var ae = 0; ae < animateElements.length; ae++) {
      scrollObserver.observe(animateElements[ae]);
    }
  }

  // ─────────────────────────────────────────────
  // 6. CONTACT FORM — EmailJS + Mailto Fallback
  // ─────────────────────────────────────────────
  var contactForm = document.getElementById('contact-form');
  var formStatus = document.getElementById('form-status');
  var sendBtn = document.getElementById('send-btn');

  // IMPORTANT: CONFIGURE YOUR EMAILJS KEYS HERE
  // 1. Sign up at https://www.emailjs.com/
  // 2. Add a service (e.g., Gmail)
  // 3. Create a template
  // 4. Replace 'YOUR_PUBLIC_KEY', 'YOUR_SERVICE_ID', and 'YOUR_TEMPLATE_ID' below.
  if (typeof emailjs !== 'undefined') {
    emailjs.init({
      publicKey: "YOUR_PUBLIC_KEY",
    });
  }

  // Cooldown timer to prevent spam
  var lastSubmitTime = 0;
  var COOLDOWN_MS = 60000; // 60 seconds

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameField = document.getElementById('contact-name');
      var emailField = document.getElementById('contact-email');
      var subjectField = document.getElementById('contact-subject');
      var messageField = document.getElementById('contact-message');

      var name = nameField ? nameField.value.trim() : '';
      var email = emailField ? emailField.value.trim() : '';
      var subject = subjectField ? subjectField.value.trim() : 'Portfolio Contact';
      var message = messageField ? messageField.value.trim() : '';
      
      // Honeypot Check (Spam Protection)
      var honeypot = document.getElementById('contact-honey');
      if (honeypot && honeypot.value) {
        // Silently reject if bot filled the hidden field
        contactForm.reset();
        return;
      }

      // Cooldown Check
      var now = Date.now();
      if (now - lastSubmitTime < COOLDOWN_MS) {
        var secondsLeft = Math.ceil((COOLDOWN_MS - (now - lastSubmitTime)) / 1000);
        showFormStatus('Please wait ' + secondsLeft + ' seconds before sending another message.', 'error');
        return;
      }

      // Validation
      if (!name || !email || !subject || !message) {
        showFormStatus('Please fill in all fields.', 'error');
        return;
      }

      // Basic email format check
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showFormStatus('Please enter a valid email address.', 'error');
        return;
      }

      // Disable button & show loading state
      if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.textContent = 'Sending...';
      }

      // Try EmailJS first
      if (typeof emailjs !== 'undefined' && emailjs.send) {
        // User needs to replace YOUR_SERVICE_ID and YOUR_TEMPLATE_ID
        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
          from_name: name,
          from_email: email,
          subject: subject,
          message: message,
          to_name: "Mian Muhammad Umair Naeem"
        }).then(
          function (response) {
            lastSubmitTime = Date.now();
            showFormStatus('Thanks! Your message has been sent.', 'success');
            contactForm.reset();
            resetSendBtn();
          },
          function (error) {
            showFormStatus('Something went wrong. Falling back to email client...', 'error');
            fallbackToMailto(name, email, subject, message);
            resetSendBtn();
          }
        );
      } else {
        // EmailJS not loaded or configured, fallback to mailto
        showFormStatus('Opening email client...', 'success');
        fallbackToMailto(name, email, subject, message);
        resetSendBtn();
      }
    });
  }

  function fallbackToMailto(name, email, subject, message) {
    var body = 'Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message;
    var mailto = 'mailto:mian.umair.dev@gmail.com'
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);
    
    window.location.href = mailto;
    
    setTimeout(function () {
      contactForm.reset();
    }, 1000);
  }

  function resetSendBtn() {
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send Message';
    }
  }

  function showFormStatus(msg, type) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className = 'form-status ' + type;
    // Auto-hide after 5 seconds
    setTimeout(function () {
      formStatus.className = 'form-status';
      formStatus.textContent = '';
    }, 5000);
  }

  // ─────────────────────────────────────────────
  // 13. COPY-TO-CLIPBOARD — Demo Credentials
  // ─────────────────────────────────────────────
  var copyBtns = document.querySelectorAll('.copy-btn');

  for (var cb = 0; cb < copyBtns.length; cb++) {
    copyBtns[cb].addEventListener('click', function () {
      var textToCopy = this.getAttribute('data-copy');
      var btn = this;

      function onCopySuccess() {
        btn.classList.add('copied');
        var icon = btn.querySelector('i');
        if (icon) {
          icon.className = 'fa-solid fa-check';
        }
        setTimeout(function () {
          btn.classList.remove('copied');
          if (icon) {
            icon.className = 'fa-regular fa-copy';
          }
        }, 1500);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(onCopySuccess).catch(function () {
          // Fallback if clipboard API fails (e.g. file:// protocol)
          fallbackCopy(textToCopy);
          onCopySuccess();
        });
      } else {
        fallbackCopy(textToCopy);
        onCopySuccess();
      }
    });
  }

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try { document.execCommand('copy'); } catch (e) { /* silent */ }
    document.body.removeChild(textarea);
  }

  // ─────────────────────────────────────────────
  // INITIAL STATE
  // ─────────────────────────────────────────────
  handleNavbarShadow();
  updateScrollProgress();
  handleBackToTop();

});
