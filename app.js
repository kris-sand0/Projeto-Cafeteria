document.addEventListener('DOMContentLoaded', () => {
    initSteamCanvas();
    initGSAPAnimations();
    initMobileMenu();
    initCartSystem();
});

/* =========================================================================
   1. CANVAS COFFEE STEAM (Performance First - Vanilla JS)
   ========================================================================= */
function initSteamCanvas() {
    const canvas = document.getElementById('coffee-steam');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    
    // Resize canvas
    function resize() {
        // Obter dimensões reais visíveis
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            // Emissão da fumaça (centro-baixo) concentrado sobre a xícara
            this.x = canvas.width * 0.5 + (Math.random() - 0.5) * 40;
            this.y = canvas.height * 0.7; // Start point perto do café real na imagem
            this.size = Math.random() * 20 + 10;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = Math.random() * -1.5 - 0.5;
            this.life = 0;
            this.maxLife = Math.random() * 100 + 100; // Tempo de vida
            this.opacity = Math.random() * 0.2 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.size += 0.1;
            this.life++;
            // Drift side to side based on life
            this.x += Math.sin(this.life * 0.05) * 0.3;

            if (this.life >= this.maxLife) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            // Calcula opacidade baseada na vida (fade in e fade out)
            let currentOpacity = this.opacity;
            if (this.life < 20) {
                currentOpacity = this.opacity * (this.life / 20);
            } else if (this.life > this.maxLife - 30) {
                currentOpacity = this.opacity * ((this.maxLife - this.life) / 30);
            }

            ctx.globalAlpha = Math.max(0, currentOpacity);
            
            // Fumaça é radial grandient soft
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size
            );
            gradient.addColorStop(0, 'rgba(244, 239, 234, 0.4)'); // Creme Steam
            gradient.addColorStop(1, 'rgba(244, 239, 234, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Criar Pool
    for (let i = 0; i < 40; i++) {
        particles.push(new Particle());
        // Distribuir tempo de vida inicial aleatoriamente para nao spawnar todos juntos
        particles[i].life = Math.random() * particles[i].maxLife;
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

/* =========================================================================
   2. GSAP SCROLL ANIMATIONS (Organic Reveals)
   ========================================================================= */
function initGSAPAnimations() {
    if (typeof gsap === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Hero Animations
    const tl = gsap.timeline();
    
    // Split text simulação visual
    tl.fromTo(".split-text", 
        { y: 50, opacity: 0, rotation: 2 },
        { y: 0, opacity: 1, rotation: 0, duration: 1, ease: "power3.out" }
    )
    .fromTo(".hero-content .fade-up",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
        "-=0.6"
    )
    .fromTo(".hero-visual",
        { scale: 0.9, opacity: 0, rotation: -2 },
        { scale: 1, opacity: 1, rotation: 0, duration: 1.2, ease: "power3.out" },
        "-=0.8"
    );

    // Scroll Animations (Fade Ups)
    gsap.utils.toArray('.fade-up').forEach((el) => {
        // Pega elemento que não foi animado no timeline inicial
        if(!el.closest('.hero-content') && !el.classList.contains('hero-visual')) {
            let delay = 0;
            if(el.classList.contains('stagger-delay-1')) delay = 0.15;
            if(el.classList.contains('stagger-delay-2')) delay = 0.3;

            gsap.fromTo(el,
                { y: 40, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%", // Aparece quando o todo está a 85% do viewport height
                        toggleActions: "play none none reverse"
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: delay,
                    ease: "power2.out"
                }
            );
        }
    });

    // Parallax suave das imagens grandes orgânicas
    gsap.utils.toArray('.organic-shape img').forEach((img) => {
        gsap.to(img, {
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5 // Suaviza o scroll
            },
            y: "15%", // Move imagem suavemente pra baixo criando parallax
            ease: "none"
        });
    });
}

/* =========================================================================
   3. MOBILE MENU & UI TOGGLES
   ========================================================================= */
function initMobileMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const links = document.querySelectorAll('.mobile-nav-links .nav-link');

    if (!menuBtn || !overlay) return;

    function toggleMenu() {
        menuBtn.classList.toggle('open');
        overlay.classList.toggle('open');
        
        // Bloquear scroll do body mas permitir do drawer se quiser
        if (overlay.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
            
            // Animação de entrada dos links
            gsap.fromTo(links, 
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.5)", delay: 0.1 }
            );
        } else {
            document.body.style.overflow = '';
        }
    }

    menuBtn.addEventListener('click', toggleMenu);

    links.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
}

/* =========================================================================
   4. HYBRID CART SYSTEM (State & UI)
   ========================================================================= */
function initCartSystem() {
    // State
    let cart = [];

    // DOM Elements
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const cartDrawer = document.getElementById('cart-drawer');
    const backdrop = document.querySelector('.drawer-backdrop');
    
    const cartBadge = document.querySelector('.cart-badge');
    const itemsContainer = document.getElementById('cart-items');
    const totalDisplay = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const whatsappBtn = document.getElementById('whatsapp-btn');
    const addButtons = document.querySelectorAll('.add-to-cart');

    // Toggles
    function openCart() {
        cartDrawer.classList.add('open');
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden'; // lock scroll
    }

    function closeCart() {
        cartDrawer.classList.remove('open');
        backdrop.classList.remove('open');
        document.body.style.overflow = ''; // unlock scroll
    }

    cartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    backdrop.addEventListener('click', closeCart);

    // Business Logic
    function formatCurrency(v) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
    }

    function updateCartUI() {
        // Calc total properties
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

        // Badge
        cartBadge.textContent = totalItems;
        if (totalItems > 0) {
            cartBadge.classList.add('active');
            checkoutBtn.removeAttribute('disabled');
            whatsappBtn.removeAttribute('disabled');
        } else {
            cartBadge.classList.remove('active');
            checkoutBtn.setAttribute('disabled', 'true');
            whatsappBtn.setAttribute('disabled', 'true');
        }

        // Total
        totalDisplay.textContent = formatCurrency(totalPrice);

        // Content
        if (cart.length === 0) {
            itemsContainer.innerHTML = '<p class="empty-cart-msg">Seu carrinho está vazio.</p>';
        } else {
            itemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span class="cart-item-price">${formatCurrency(item.price)} x ${item.qty}</span>
                    </div>
                    <div class="cart-item-qty">
                        <button class="qty-btn minus-btn" data-id="${item.id}">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn plus-btn" data-id="${item.id}">+</button>
                    </div>
                </div>
            `).join('');

            // Bind events for dynamically created buttons
            const minusBtns = itemsContainer.querySelectorAll('.minus-btn');
            const plusBtns = itemsContainer.querySelectorAll('.plus-btn');

            minusBtns.forEach(btn => btn.addEventListener('click', (e) => decrementItem(e.target.dataset.id)));
            plusBtns.forEach(btn => btn.addEventListener('click', (e) => incrementItem(e.target.dataset.id)));
        }
    }

    function addItem(id, name, price) {
        const parsedPrice = parseFloat(price);
        const existingItem = cart.find(i => i.id === id);

        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({ id, name, price: parsedPrice, qty: 1 });
        }
        
        // Micro-interaction Feedback
        gsap.fromTo(cartBtn, 
            { scale: 0.8 }, 
            { scale: 1, duration: 0.4, ease: "back.out(2)" }
        );

        updateCartUI();
        openCart(); // Opcional: abre logo que adiciona
    }

    function incrementItem(id) {
        const item = cart.find(i => i.id === id);
        if(item) {
            item.qty += 1;
            updateCartUI();
        }
    }

    function decrementItem(id) {
        const itemIndex = cart.findIndex(i => i.id === id);
        if(itemIndex > -1) {
            if(cart[itemIndex].qty > 1) {
                cart[itemIndex].qty -= 1;
            } else {
                cart.splice(itemIndex, 1);
            }
            updateCartUI();
        }
    }

    // Event Listeners from DOM
    addButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const { id, name, price } = e.currentTarget.dataset;
            addItem(id, name, price);
        });
    });

    // Checkout behaviors
    checkoutBtn.addEventListener('click', () => {
        if(cart.length === 0) return;
        
        // Simular transition ou loading
        const originalText = checkoutBtn.innerText;
        checkoutBtn.innerText = "Processando...";
        
        setTimeout(() => {
            alert('A simulação do fluxo de e-commerce redirecionaria para a página de Stripe/MercadoPago agora.');
            checkoutBtn.innerText = originalText;
            cart = [];
            updateCartUI();
            closeCart();
        }, 1500);
    });

    whatsappBtn.addEventListener('click', () => {
        if(cart.length === 0) return;

        const phone = "5511999999999"; // O telefone da doc html
        let text = "Olá! Gostaria de fazer o seguinte pedido:\n\n";
        
        cart.forEach(item => {
            text += `*${item.qty}x* - ${item.name} (${formatCurrency(item.price)})\n`;
        });
        
        const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        text += `\n*Total:* ${formatCurrency(total)}\n\nObrigado!`;

        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/${phone}?text=${encodedText}`, '_blank');
        
        closeCart();
    });

    // Initialize UI
    updateCartUI();
}
