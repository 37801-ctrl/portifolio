/**
 * ==========================================================================
 * PORTFÓLIO MARINA MACEDO - SCRIPT PRINCIPAL (JS PURO)
 * 1. Efeito de Abertura da Tela (Belgrade Arbor)
 * 2. Efeito de Parallax / 3D Tilt com Mouse (Emotion Agency)
 * 3. Efeito de Bolinhas Flutuantes (EverSwap)
 * 4. Interações de Navegação & Menu Responsivo
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initIntroCurtain();
  initParticlesCanvas();
  initParallaxHero();
  initNavbar();
  initProjectModal();
  initContactFeatures();
  initScrollSpy();
});

/* ==========================================================================
   1. EFEITO SITE 2: ABERTURA DE TELA (BELGRADE ARBOR REVEAL)
   ========================================================================== */
function initIntroCurtain() {
  const introCurtain = document.getElementById('introCurtain');
  if (!introCurtain) return;

  // Aguarda um breve momento para exibir a identidade inicial e abre as cortinas
  window.addEventListener('load', () => {
    setTimeout(() => {
      introCurtain.classList.add('loaded');
      
      // Remove do DOM visual após o término da transição CSS (1.3s)
      setTimeout(() => {
        introCurtain.classList.add('hidden');
      }, 1300);
    }, 400);
  });
}

/* ==========================================================================
   2. EFEITO SITE 1: 3D PARALLAX INTERATIVO COM MOUSE (EMOTION AGENCY)
   ========================================================================== */
function initParallaxHero() {
  const heroScene = document.getElementById('heroScene');
  const parallaxLayer = document.getElementById('parallaxLayer');
  const heroName = document.getElementById('heroName');

  if (!heroScene || !parallaxLayer) return;

  // Estado atual e alvo para interpolação suave (lerp)
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let isHovered = false;

  const handleMouseMove = (e) => {
    const rect = heroScene.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalizado de -1 a 1
    mouseX = (e.clientX - centerX) / (rect.width / 2);
    mouseY = (e.clientY - centerY) / (rect.height / 2);
    isHovered = true;
  };

  const handleMouseLeave = () => {
    mouseX = 0;
    mouseY = 0;
    isHovered = false;
  };

  window.addEventListener('mousemove', handleMouseMove);
  document.body.addEventListener('mouseleave', handleMouseLeave);

  // Loop de animação suave
  function animate() {
    // Interpolação Linear (lerp) para suavidade máxima
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    const rotateX = -currentY * 8; // Inclinação vertical
    const rotateY = currentX * 10; // Rotação horizontal
    const translateX = currentX * 18;
    const translateY = currentY * 12;

    parallaxLayer.style.transform = `
      translate3d(${translateX}px, ${translateY}px, 0)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
    `;

    // Movimento com profundidade extra sutil no nome central
    if (heroName) {
      const nameTiltX = currentX * 8;
      const nameTiltY = currentY * 6;
      heroName.style.transform = `translate3d(${nameTiltX}px, ${nameTiltY}px, 45px)`;
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. EFEITO SITE 3: BOLINHAS E PARTÍCULAS FLUTUANTES (EVERSWAP)
   ========================================================================== */
function initParticlesCanvas() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Ajusta o canvas ao redimensionar a janela
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  });

  // Configuração das partículas flutuantes
  const particles = [];
  const PARTICLE_COUNT = Math.min(Math.floor(width / 35), 45); // Adaptativo conforme resolução

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + Math.random() * 20;
      this.radius = Math.random() * 5 + 2; // Tamanhos variados de bolinhas
      this.speedY = Math.random() * 0.45 + 0.15; // Flutuação ascendente suave
      this.speedX = (Math.random() - 0.5) * 0.35; // Oscilação lateral suave
      this.baseAlpha = Math.random() * 0.45 + 0.2;
      this.alpha = this.baseAlpha;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulseStep = Math.random() * Math.PI;

      // Mistura harmônica: maioria brancas translúcidas, algumas com brilho suave dourado/azul
      const colorType = Math.random();
      if (colorType > 0.8) {
        this.color = '255, 168, 50'; // Toque sutil da cor de destaque
      } else if (colorType > 0.6) {
        this.color = '65, 123, 159'; // Toque sutil do azul primário suave
      } else {
        this.color = '255, 255, 255'; // Bolinhas brancas puras translúcidas
      }
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX + Math.sin(this.pulseStep) * 0.25;
      this.pulseStep += this.pulseSpeed;

      // Efeito de brilho pulsante
      this.alpha = this.baseAlpha + Math.sin(this.pulseStep) * 0.15;

      // Se sair da parte superior ou laterais, recicla na base
      if (this.y < -this.radius || this.x < -this.radius || this.x > width + this.radius) {
        this.reset(false);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${Math.max(0, this.alpha)})`;
      ctx.shadowColor = `rgba(${this.color}, 0.3)`;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset para otimização
    }
  }

  function createParticles() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  createParticles();

  function renderParticles() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    requestAnimationFrame(renderParticles);
  }

  renderParticles();
}

/* ==========================================================================
   4. NAVEGAÇÃO & MENU FIXO (HEADER RESPONSIVO)
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  // Adiciona sombra e fundo compacto ao rolar a página
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Toggle do menu mobile
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('nav-open');
    });

    // Fecha o menu mobile ao clicar em um link
    links.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('nav-open');
      });
    });
  }
}

/* ==========================================================================
   5. MODAL INTERATIVO DE PROJETOS ("ao clicar deve aparecer isso")
   ========================================================================== */
function initProjectModal() {
  const cards = document.querySelectorAll('.projeto-card');
  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalBadge = document.getElementById('modalBadge');
  const modalDesc = document.getElementById('modalDesc');
  const modalTech = document.getElementById('modalTech');
  const modalRepoBtn = document.getElementById('modalRepoBtn');

  if (!modal || !cards.length) return;

  // Abre o modal ao clicar em qualquer card de projeto
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Se clicou diretamente no link direto do GitHub, deixa abrir normalmente
      if (e.target.closest('.repo-icon-btn') || e.target.closest('.btn-project-link')) {
        return;
      }

      const title = card.querySelector('.projeto-title')?.textContent || 'Projeto';
      const badge = card.querySelector('.projeto-category-badge')?.textContent || 'Desenvolvimento';
      const desc = card.querySelector('.projeto-desc')?.textContent || '';
      const repoUrl = card.getAttribute('data-repo') || 'https://github.com/37801-ctrl';
      const tags = card.querySelectorAll('.mini-tag');

      // Preenche os dados no modal
      modalTitle.textContent = title;
      modalBadge.textContent = badge;
      modalDesc.textContent = desc;
      modalRepoBtn.setAttribute('href', repoUrl);

      // Renderiza as tags de tecnologia
      modalTech.innerHTML = '';
      tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'mini-tag';
        span.textContent = tag.textContent;
        modalTech.appendChild(span);
      });

      // Exibe o modal com animação suave
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  // Função para fechar o modal
  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  // Fecha ao pressionar ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. RECURSOS DE CONTATO (E-MAIL INSTITUCIONAL & FORMULÁRIO)
   ========================================================================== */
function initContactFeatures() {
  const EMAIL = 'marinamac06@gmail.com';
  const btnCopyEmail = document.getElementById('btnCopyEmail');
  const copyToast = document.getElementById('copyToast');
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  // Funcionalidade de copiar o e-mail para o clipboard
  if (btnCopyEmail && copyToast) {
    btnCopyEmail.addEventListener('click', () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL).then(showToast).catch(() => fallbackCopy(EMAIL));
      } else {
        fallbackCopy(EMAIL);
      }
    });

    function showToast() {
      copyToast.classList.add('show');
      setTimeout(() => {
        copyToast.classList.remove('show');
      }, 3000);
    }

    function fallbackCopy(text) {
      const tempInput = document.createElement('input');
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showToast();
    }
  }

  // Envio do formulário de contato com direcionamento para marinamac06@gmail.com
  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome = document.getElementById('nome')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const assunto = document.getElementById('assunto')?.value.trim();
      const mensagem = document.getElementById('mensagem')?.value.trim();

      // Monta o mailto seguro para abrir o aplicativo de e-mail do usuário
      const mailtoUrl = `mailto:${EMAIL}?subject=${encodeURIComponent('[Portfólio] ' + assunto)}&body=${encodeURIComponent(`Nome: ${nome}\nE-mail: ${email}\n\nMensagem:\n${mensagem}`)}`;

      formFeedback.innerHTML = `
        <strong>Obrigado pelo contato, ${nome}!</strong><br>
        Sua mensagem foi preparada para envio para <strong>${EMAIL}</strong>.<br>
        <a href="${mailtoUrl}" style="color: var(--color-accent); font-weight: 600; text-decoration: underline; display: inline-block; margin-top: 8px;">
          Clique aqui para abrir no seu cliente de e-mail
        </a>
      `;
      formFeedback.className = 'form-feedback success';

      // Abre automaticamente o cliente de e-mail padrão
      window.location.href = mailtoUrl;

      // Limpa os campos
      contactForm.reset();
    });
  }
}

/* ==========================================================================
   7. SCROLL SPY (DESTAQUE AUTOMÁTICO DO MENU ATIVO AO ROLAR)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

