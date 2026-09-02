/* ============================================
   Muhammad Anwar — Interactive Portfolio JS v2
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initParticles();
  initCursor();
  initNavbar();
  initScrollProgress();
  initScrollReveal();
  initTypingAnimation();
  initProjectGlow();
  initChatbot();
  initBlogFeed();
  initBlogModal();
  initGitHubPlugin();
});

/* ============================================
   PARTICLE NETWORK BACKGROUND
   ============================================ */
function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function create() {
    particles = [];
    const n = Math.min(Math.floor((w * h) / 20000), 70);
    for (let i = 0; i < n; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        o: Math.random() * 0.4 + 0.1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 140) {
          ctx.strokeStyle = `rgba(122,28,46,${(1 - d / 140) * 0.07})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    // Dots
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(122,28,46,${p.o})`;
      ctx.fill();
    }
  }

  function update() {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  resize();
  create();
  loop();

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { resize(); create(); }, 200);
  });
}

/* ============================================
   CUSTOM CURSOR
   ============================================ */
function initCursor() {
  // Only enable custom cursor on devices with a real mouse pointer
  const hasFineMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!hasFineMouse) return;

  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
    ring.style.left = mx + 'px';
    ring.style.top = my + 'px';
  });

  // Hover effect on interactive elements
  const hovers = document.querySelectorAll('a, button, .proj-card, .proj-card-link, .blog-card, .mini-card, .contact-tile, .pill, .chat-suggest');
  hovers.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section, .hero');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    // Active section
    const sp = window.scrollY + 180;
    sections.forEach(sec => {
      const id = sec.id;
      if (sp >= sec.offsetTop && sp < sec.offsetTop + sec.offsetHeight) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[data-section="${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { passive: true });

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  links.forEach(l => l.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

/* ============================================
   SCROLL PROGRESS
   ============================================ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / h * 100) + '%';
  }, { passive: true });
}

/* ============================================
   SCROLL REVEAL
   ============================================ */
function initScrollReveal() {
  const items = document.querySelectorAll('.anim-reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => obs.observe(el));
}

/* ============================================
   TYPING ANIMATION
   ============================================ */
function initTypingAnimation() {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const words = ['AI Enthusiast', 'Cloud Learner', 'Problem Solver', 'Builder', 'Open Source Contributor', 'System Thinker'];
  let wordIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = words[wordIdx];
    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        setTimeout(() => { deleting = true; type(); }, 2000);
        return;
      }
      setTimeout(type, 70 + Math.random() * 40);
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 35);
    }
  }
  setTimeout(type, 800);
}

/* ============================================
   PROJECT CARD GLOW
   ============================================ */
function initProjectGlow() {
  // Only enable glow tracking on devices with a real mouse pointer
  const hasFineMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!hasFineMouse) return;

  document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });
}

/* ============================================
   AI CHATBOT
   ============================================ */
function initChatbot() {
  const fab = document.getElementById('chat-fab');
  const heroBtn = document.getElementById('open-chat-hero');
  const win = document.getElementById('chat-window');
  const closeBtn = document.getElementById('chat-close');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');
  const suggestions = document.getElementById('chat-suggestions');

  function open() { win.classList.add('open'); fab.style.display = 'none'; input.focus(); }
  function close() { win.classList.remove('open'); fab.style.display = 'flex'; }

  fab?.addEventListener('click', open);
  heroBtn?.addEventListener('click', (e) => { e.preventDefault(); open(); });
  closeBtn?.addEventListener('click', close);

  // Suggestion clicks
  suggestions?.querySelectorAll('.chat-suggest').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.q;
      addMsg('user', q);
      respond(q);
      suggestions.style.display = 'none';
    });
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    addMsg('user', q);
    input.value = '';
    respond(q);
    if (suggestions) suggestions.style.display = 'none';
  });

  function addMsg(role, text) {
    const div = document.createElement('div');
    div.className = `chat-msg ${role}`;
    div.innerHTML = `<div class="chat-bubble">${text}</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.id = 'typing-msg';
    div.innerHTML = `<div class="chat-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('typing-msg');
    if (t) t.remove();
  }

  function respond(query) {
    showTyping();
    setTimeout(() => {
      removeTyping();
      const answer = getAIResponse(query);
      addMsg('bot', answer);
    }, 800 + Math.random() * 600);
  }

  // Knowledge-base powered responses
  function getAIResponse(q) {
    const lower = q.toLowerCase();

    // Identity
    if (match(lower, ['who are you', 'who is', 'about you', 'tell me about', 'introduce', 'yourself'])) {
      return "I'm Muhammad Anwar — a 3rd year BS Computer Science student at FAST NUCES. I'm deeply interested in AI systems, cloud computing, and building things that solve real problems. I've built AI agents, Linux kernel modules, and full-stack web apps. I learn fast and ship faster. 🚀";
    }

    // Projects
    if (match(lower, ['project', 'built', 'portfolio', 'what have you', 'nova', 'work'])) {
      return "Here are some things I've built:<br><br>⭐ <strong>Nova AI Agent</strong> — Context-aware AI with n8n + LLaMA 3.3 + PostgreSQL memory<br>🌤️ <strong>Weather App</strong> — Real-time API-powered weather data<br>🐦 <strong>Flappy Bird</strong> — C++ game with SFML graphics<br>🍕 <strong>Food Ordering Website</strong> — Responsive web app<br>📘 <strong>API Guide</strong> — Educational content on REST APIs<br><br>Check them out in the <a href='#projects' style='color:#9E3A50'>Projects section</a>!";
    }

    // AI / Nova
    if (match(lower, ['ai agent', 'nova', 'llama', 'ai project', 'intelligent'])) {
      return "Nova AI Agent is my flagship project! It's a context-aware AI built using:<br><br>• <strong>n8n</strong> for workflow automation<br>• <strong>LLaMA 3.3</strong> as the language model<br>• <strong>PostgreSQL</strong> for persistent memory<br><br>It handles multi-step reasoning with long-term context — basically an AI that remembers and learns. 🧠";
    }

    // Skills
    if (match(lower, ['skill', 'technology', 'tech stack', 'language', 'tools', 'what can you'])) {
      return "Here's my technical stack:<br><br>💻 <strong>Languages:</strong> C, C++, Python, JavaScript, PHP, SQL<br>🛠️ <strong>Tools:</strong> Hugo, Git/GitHub, n8n, QEMU/KVM, LaTeX, Docker<br>☁️ <strong>Domains:</strong> AI Systems, Cloud (AWS/Azure), Web Dev, Systems Programming<br><br>I'm always adding more to this list! 📚";
    }

    // Experience
    if (match(lower, ['experience', 'community', 'aws', 'mlsa', 'google', 'gdg', 'club'])) {
      return "I'm actively involved in tech communities:<br><br>🔷 <strong>Google Developers Club</strong> — Tier 1 Member (Hugo sites, kernel modules)<br>☁️ <strong>AWS FAST NUCES</strong> — Co-Lead (events & workshops)<br>🔵 <strong>MLSA</strong> — Microsoft Learn Student Ambassador<br>❤️ <strong>SOS Village</strong> — Tutor & mentor<br><br>Community + Code = Growth 💪";
    }

    // Work together / hire / freelance
    if (match(lower, ['work with', 'hire', 'freelan', 'collaborate', 'job', 'intern', 'opportunity'])) {
      return "Absolutely! I'm open to:<br><br>🤝 Collaboration on projects<br>💼 Freelance work<br>🏢 Internship opportunities<br>💡 Technical discussions<br><br>📧 Reach me at <strong>muhammadanwarbaloch1@gmail.com</strong> or <a href='#meeting' style='color:#9E3A50'>book a 1:1 meeting</a>!";
    }

    // Blog / writing
    if (match(lower, ['blog', 'writ', 'medium', 'article', 'post'])) {
      return "I write on Medium about AI, cloud, Linux, and my learning journey. Check out my blog posts in the <a href='#blogs' style='color:#9E3A50'>Blogs section</a> or visit <a href='https://medium.com/@Muhammad._.anwar' target='_blank' style='color:#9E3A50'>my Medium profile</a>! ✍️";
    }

    // Education
    if (match(lower, ['education', 'university', 'fast', 'nuces', 'degree', 'study'])) {
      return "I'm pursuing a <strong>BS in Computer Science at FAST NUCES</strong> (2024-2028). My coursework includes DSA, Operating Systems, Parallel Computing, Computer Organization, and Software Testing. 🎓";
    }

    // Certifications
    if (match(lower, ['cert', 'azure', 'python boot', 'voip'])) {
      return "Here are my certifications:<br><br>✅ C++ Programming Certification<br>✅ VoIP Development (Asterisk & FreePBX)<br>🔄 Azure AZ-900 (in progress)<br>🔄 100 Days of Python Bootcamp (in progress)";
    }

    // Contact
    if (match(lower, ['contact', 'email', 'reach', 'github', 'linkedin', 'social'])) {
      return "You can find me here:<br><br>🐙 <a href='https://github.com/anwarkhushk' target='_blank' style='color:#9E3A50'>GitHub</a><br>💼 <a href='https://www.linkedin.com/in/muhammad-anwar-62100b325/' target='_blank' style='color:#9E3A50'>LinkedIn</a><br>✍️ <a href='https://medium.com/@Muhammad._.anwar' target='_blank' style='color:#9E3A50'>Medium</a><br>📧 muhammadanwarbaloch1@gmail.com";
    }

    // Greeting
    if (match(lower, ['hi', 'hello', 'hey', 'sup', 'yo', 'good'])) {
      return "Hey there! 👋 Great to see you. Feel free to ask me anything about Muhammad Anwar's projects, skills, experience, or how to work together!";
    }

    // Thank you
    if (match(lower, ['thank', 'thanks', 'cheers', 'awesome', 'cool'])) {
      return "You're welcome! 😊 If you have more questions, I'm right here. You can also <a href='#meeting' style='color:#9E3A50'>book a 1:1 meeting</a> anytime!";
    }

    // Default
    return "That's an interesting question! While I might not have the exact answer right now, Muhammad Anwar is always learning and building. Feel free to <a href='mailto:muhammadanwarbaloch1@gmail.com' style='color:#9E3A50'>reach out directly</a> for a detailed conversation! 💬";
  }

  function match(text, keywords) {
    return keywords.some(k => text.includes(k));
  }
}

/* ============================================
   MEDIUM BLOG FEED (via RSS2JSON)
   ============================================ */
function initBlogFeed() {
  const grid = document.getElementById('blog-grid');
  const loading = document.getElementById('blog-loading');
  if (!grid) return;

  const mediumUser = 'Muhammad._.anwar';
  const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${mediumUser}`;

  fetch(rssUrl)
    .then(res => res.json())
    .then(data => {
      if (loading) loading.remove();

      if (data.status !== 'ok' || !data.items || data.items.length === 0) {
        showFallbackBlogs(grid);
        return;
      }

      data.items.slice(0, 6).forEach(post => {
        const card = createBlogCard(post);
        grid.appendChild(card);
      });

      // Reinit lucide for new icons
      lucide.createIcons();
      // Re-observe new cards
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.08 });
      grid.querySelectorAll('.anim-reveal').forEach(el => obs.observe(el));
    })
    .catch(() => {
      if (loading) loading.remove();
      showFallbackBlogs(grid);
    });
}

function createBlogCard(post) {
  const div = document.createElement('div');
  div.className = 'blog-card anim-reveal';

  // Strip HTML and get preview
  const tmp = document.createElement('div');
  tmp.innerHTML = post.description || post.content || '';
  const text = tmp.textContent || '';
  const preview = text.substring(0, 150).trim() + '...';

  const date = new Date(post.pubDate).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  div.innerHTML = `
    <span class="blog-card-date">${date}</span>
    <h3>${post.title}</h3>
    <p>${preview}</p>
    <div class="blog-card-footer">
      <i data-lucide="arrow-right"></i> Read article
    </div>
  `;

  // Store data for modal
  div.dataset.title = post.title;
  div.dataset.date = date;
  div.dataset.content = post.description || post.content || '<p>Content not available. Please read this article on Medium.</p>';
  div.dataset.link = post.link || '#';

  div.addEventListener('click', () => openBlogModal(div));
  return div;
}

function showFallbackBlogs(grid) {
  const fallback = [
    { title: 'Building AI Agents with n8n', desc: 'How I built a context-aware AI agent using n8n workflows and LLaMA 3.3...', date: '2025' },
    { title: 'Cloud Computing for Students', desc: 'A practical guide to getting started with AWS and Azure as a CS student...', date: '2025' },
    { title: 'My Journey into Linux Kernel Development', desc: 'From userspace to kernelspace — exploring low-level systems programming...', date: '2025' },
  ];

  fallback.forEach(post => {
    const div = document.createElement('div');
    div.className = 'blog-card anim-reveal';
    div.innerHTML = `
      <span class="blog-card-date">${post.date}</span>
      <h3>${post.title}</h3>
      <p>${post.desc}</p>
      <div class="blog-card-footer">
        <i data-lucide="external-link"></i> Read on Medium
      </div>
    `;
    div.addEventListener('click', () => {
      window.open('https://medium.com/@Muhammad._.anwar', '_blank');
    });
    grid.appendChild(div);
  });
  lucide.createIcons();
}

/* ============================================
   BLOG MODAL
   ============================================ */
function initBlogModal() {
  const modal = document.getElementById('blog-modal');
  const closeBtn = document.getElementById('blog-modal-close');
  const overlay = document.getElementById('blog-modal-close-overlay');

  closeBtn?.addEventListener('click', () => modal.classList.remove('open'));
  overlay?.addEventListener('click', () => modal.classList.remove('open'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modal?.classList.remove('open');
  });
}

function openBlogModal(card) {
  const modal = document.getElementById('blog-modal');
  const reader = document.getElementById('blog-reader');
  if (!modal || !reader) return;

  const title = card.dataset.title || 'Blog Post';
  const date = card.dataset.date || '';
  const content = card.dataset.content || '';
  const link = card.dataset.link || '#';

  reader.innerHTML = `
    <h1>${title}</h1>
    <span class="blog-reader-date">${date}</span>
    <div>${content}</div>
    <p style="margin-top:32px;"><a href="${link}" target="_blank" rel="noopener" style="color:var(--accent-l);">→ Read original on Medium</a></p>
  `;

  modal.classList.add('open');
}

/* ============================================
   GITHUB PROFILE PLUGIN
   ============================================ */
function initGitHubPlugin() {
  const avatarEl = document.getElementById('github-avatar');
  const nameEl = document.getElementById('github-name');
  const bioEl = document.getElementById('github-bio');
  const reposEl = document.getElementById('github-repos');
  const followersEl = document.getElementById('github-followers');
  const followingEl = document.getElementById('github-following');

  if (!avatarEl) return;

  const username = 'anwarkhushk';

  fetch(`https://api.github.com/users/${username}`)
    .then(res => res.json())
    .then(data => {
      // Set avatar image
      if (data.avatar_url) {
        avatarEl.innerHTML = `<img src="${data.avatar_url}" alt="${data.login}" />`;
      }

      // Set name
      if (nameEl) {
        nameEl.textContent = data.name || data.login || username;
      }

      // Set bio
      if (bioEl) {
        bioEl.textContent = data.bio || 'Open source contributor & developer';
      }

      // Set stats
      if (reposEl) reposEl.textContent = data.public_repos ?? '—';
      if (followersEl) followersEl.textContent = data.followers ?? '—';
      if (followingEl) followingEl.textContent = data.following ?? '—';
    })
    .catch(() => {
      // Fallback — keep default values
      if (bioEl) bioEl.textContent = 'Open source contributor & developer';
    });
}
