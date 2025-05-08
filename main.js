document.addEventListener("DOMContentLoaded", function() {
  // Advanced background animation
  const canvas = document.getElementById('background-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  
  // Configuration - Base config
  const config = {
    particleCount: 100,
    connectionDistance: 150,
    speed: 0.5,
    size: 2.5,
    mouseInteraction: true,
    mouseRadius: 150,
    particleColors: ['#88C3FF', '#FC977E', '#2EC4B6', '#FF9F1C', '#faf3d9'],
    lineColors: ['rgba(222, 88, 91, 0.2)', 'rgba(44, 93, 99, 0.15)'],
    backgroundGradient: {
      start: '#1a353d',
      end: '#214550'
    },
    // Add text configuration
    showKeywords: true,
    keywordCount: 8,
    keywordOpacity: 0.15,  // Make them a bit more subtle
    keywordSize: 18,       // Slightly smaller size
    // Shape configuration
    floatingShapesCount: 10,
    shapesMinSize: 15,
    shapesMaxSize: 40
  };
  
  // Responsive adjustments based on screen size
  function updateConfigForScreenSize() {
    if (window.innerWidth < 768) {
      // Mobile configuration
      config.particleCount = 60;
      config.connectionDistance = 100;
      config.keywordCount = 4;
      config.floatingShapesCount = 5;
      config.shapesMinSize = 10; 
      config.shapesMaxSize = 30;
    } else if (window.innerWidth < 1200) {
      // Tablet configuration
      config.particleCount = 80;
      config.connectionDistance = 120;
      config.keywordCount = 6;
      config.floatingShapesCount = 8;
    } else {
      // Desktop configuration (default values)
      config.particleCount = 100;
      config.connectionDistance = 150;
      config.keywordCount = 8;
      config.floatingShapesCount = 10;
    }
  }
  
  // Keywords to display in the background
  const keywords = [
    "Innovative", "Creative", "Analytical", "AI", "C++", "Unity", 
    "Data-Driven", "Software", "Engineer", "Developer", "Python",
    "Web", "Machine Learning", "Algorithms", "Solutions"
  ];
  
  let particles = [];
  let floatingShapes = [];
  let animationFrame;
  let mouseX = null;
  let mouseY = null;
  let keywordElements = [];
  
  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    // Update config based on screen size
    updateConfigForScreenSize();
    
    // Recreate particles when canvas resizes
    createParticles();
    
    // Recreate floating shapes
    createFloatingShapes();
    
    // Update keyword positions
    if (config.showKeywords) {
      createKeywords();
    }
  }
  
  function createFloatingShapes() {
    floatingShapes = [];
    
    // Divide the screen into sections to ensure better distribution
    const sections = 4; // 2x2 grid
    const sectionWidth = width / sections;
    const sectionHeight = height / sections;
    
    for(let i = 0; i < config.floatingShapesCount; i++) {
      // Determine which section this shape should be in
      const sectionX = i % sections;
      const sectionY = Math.floor(i / sections) % sections;
      
      // Calculate position within that section (with some randomness)
      const x = (sectionX * sectionWidth) + (Math.random() * 0.8 + 0.1) * sectionWidth;
      const y = (sectionY * sectionHeight) + (Math.random() * 0.8 + 0.1) * sectionHeight;
      
      const shapeSize = config.shapesMinSize + Math.random() * (config.shapesMaxSize - config.shapesMinSize);
      
      floatingShapes.push({
        x: x,
        y: y,
        origX: x, // Store original position for parallax
        origY: y, // Store original position for parallax
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: shapeSize,
        type: Math.floor(Math.random() * 3), // 0: triangle, 1: square, 2: circle
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.005,
        color: config.particleColors[Math.floor(Math.random() * config.particleColors.length)],
        opacity: 0.05 + Math.random() * 0.1
      });
    }
  }
  
  function createParticles() {
    particles = [];
    for(let i = 0; i < config.particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        size: config.size + Math.random() * 1.5,
        color: config.particleColors[Math.floor(Math.random() * config.particleColors.length)],
        opacity: 0.4 + Math.random() * 0.6,
        speedMultiplier: 0.8 + Math.random() * 0.4
      });
    }
  }
  
  function createKeywords() {
    keywordElements = [];
    const usedKeywords = [];
    
    // Select random keywords without repeating
    while (usedKeywords.length < Math.min(config.keywordCount, keywords.length)) {
      const keyword = keywords[Math.floor(Math.random() * keywords.length)];
      if (!usedKeywords.includes(keyword)) {
        usedKeywords.push(keyword);
      }
    }
    
    // Create keyword elements with random positions
    usedKeywords.forEach(keyword => {
      const fontSize = config.keywordSize + Math.random() * 10;
      keywordElements.push({
        text: keyword,
        x: Math.random() * width * 0.8 + width * 0.1, // Keep away from edges
        y: Math.random() * height * 0.8 + height * 0.1,
        size: fontSize,
        opacity: config.keywordOpacity + Math.random() * 0.1,
        rotation: (Math.random() - 0.5) * 0.1,
        speed: 0.2 + Math.random() * 0.3
      });
    });
  }
  
  function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, config.backgroundGradient.start);
    gradient.addColorStop(1, config.backgroundGradient.end);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add animated gradient noise overlay effect
    drawNoiseOverlay();
    
    // Draw grid pattern (subtle)
    drawGridPattern();
    
    // Draw keywords if enabled
    if (config.showKeywords) {
      drawKeywords();
    }
    
    // Draw floating geometric shapes
    drawFloatingShapes();
    
    // Update and draw particles
    for(let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // Update position
      p.x += p.vx * p.speedMultiplier;
      p.y += p.vy * p.speedMultiplier;
      
      // Boundary check with bounce effect
      if(p.x < 0 || p.x > width) {
        p.vx *= -1;
        p.x = Math.max(0, Math.min(p.x, width));
      }
      if(p.y < 0 || p.y > height) {
        p.vy *= -1;
        p.y = Math.max(0, Math.min(p.y, height));
      }
      
      // Mouse interaction
      if(config.mouseInteraction && mouseX !== null && mouseY !== null) {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if(distance < config.mouseRadius) {
          const force = (config.mouseRadius - distance) / config.mouseRadius;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * 0.2;
          p.vy += Math.sin(angle) * force * 0.2;
          
          // Limit speed
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if(speed > 2) {
            p.vx = (p.vx / speed) * 2;
            p.vy = (p.vy / speed) * 2;
          }
        }
      }
      
      // Keyword interaction - particles get attracted to nearby keywords
      if (config.showKeywords) {
        keywordElements.forEach(keyword => {
          const dx = keyword.x - p.x;
          const dy = keyword.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const force = 0.02 * (1 - distance / 100);
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force;
            p.vy += Math.sin(angle) * force;
          }
        });
      }
      
      // Draw connections between particles
      for(let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if(distance < config.connectionDistance) {
          const opacity = (1 - distance / config.connectionDistance) * 0.7;
          const lineColor = config.lineColors[Math.floor(Math.random() * config.lineColors.length)];
          
          ctx.beginPath();
          ctx.strokeStyle = lineColor.replace(')', `, ${opacity})`).replace('rgba', 'rgba');
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
      
      // Also draw connections between particles and nearby keywords
      if (config.showKeywords) {
        keywordElements.forEach(keyword => {
          const dx = keyword.x - p.x;
          const dy = keyword.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Connect particles to keywords when they're nearby
          if (distance < 80) {
            const opacity = (1 - distance / 80) * 0.4;
            
            ctx.beginPath();
            ctx.strokeStyle = `rgba(250, 243, 217, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(keyword.x, keyword.y);
            ctx.stroke();
          }
        });
      }
      
      // Draw particle with glow effect
      drawGlowingParticle(p);
    }
    
    // Draw mouse cursor glow when mouse is present
    if(config.mouseInteraction && mouseX !== null && mouseY !== null) {
      drawMouseGlow();
    }
    
    animationFrame = requestAnimationFrame(draw);
  }
  
  function drawGlowingParticle(p) {
    // Draw glow
    const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
    glow.addColorStop(0, p.color.replace(')', `, ${p.opacity * 0.6})`).replace('#', 'rgba(').replace(
      new RegExp('([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})'),
      (_, r, g, b) => `${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}`
    ));
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();
    
    // Draw particle
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color.replace(')', `, ${p.opacity})`).replace('#', 'rgba(').replace(
      new RegExp('([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})'),
      (_, r, g, b) => `${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}`
    );
    ctx.fill();
  }
  
  function drawMouseGlow() {
    const glow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, config.mouseRadius);
    glow.addColorStop(0, 'rgba(252, 151, 126, 0.2)');
    glow.addColorStop(0.5, 'rgba(252, 151, 126, 0.05)');
    glow.addColorStop(1, 'rgba(252, 151, 126, 0)');
    
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, config.mouseRadius, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();
  }

  function drawFloatingShapes() {
    floatingShapes.forEach(shape => {
      // Update position with slower movement and reset if too far off-screen
      shape.x += shape.vx;
      shape.y += shape.vy;
      shape.rotation += shape.rotationSpeed;
      
      // Boundary check with smoother repositioning
      // If shape goes too far off screen, gradually move it back into view
      if(shape.x < -shape.size * 2) shape.vx += 0.01;
      if(shape.x > width + shape.size * 2) shape.vx -= 0.01;
      if(shape.y < -shape.size * 2) shape.vy += 0.01;
      if(shape.y > height + shape.size * 2) shape.vy -= 0.01;
      
      // Limit velocity to prevent excessive speed
      const maxSpeed = 0.3;
      shape.vx = Math.max(-maxSpeed, Math.min(maxSpeed, shape.vx));
      shape.vy = Math.max(-maxSpeed, Math.min(maxSpeed, shape.vy));
      
      // Only draw if within or near the viewport for performance
      if(shape.x > -shape.size * 2 && shape.x < width + shape.size * 2 && 
         shape.y > -shape.size * 2 && shape.y < height + shape.size * 2) {
        
        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rotation);
        
        ctx.fillStyle = shape.color.replace(')', `, ${shape.opacity})`).replace('#', 'rgba(').replace(
          new RegExp('([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})'),
          (_, r, g, b) => `${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}`
        );
        
        // Draw shape based on type
        if(shape.type === 0) {
          // Triangle
          ctx.beginPath();
          ctx.moveTo(0, -shape.size/2);
          ctx.lineTo(shape.size/2, shape.size/2);
          ctx.lineTo(-shape.size/2, shape.size/2);
          ctx.closePath();
          ctx.fill();
        } else if(shape.type === 1) {
          // Square
          ctx.fillRect(-shape.size/2, -shape.size/2, shape.size, shape.size);
        } else {
          // Circle
          ctx.beginPath();
          ctx.arc(0, 0, shape.size/2, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      }
    });
  }

  // Time-based noise overlay
  let noiseTime = 0;
  function drawNoiseOverlay() {
    const noiseOpacity = 0.03;
    ctx.fillStyle = `rgba(0, 0, 0, ${noiseOpacity})`;
    
    // Very simple noise simulation for performance
    for(let i = 0; i < 40; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2 + 1;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    noiseTime += 0.01;
  }
  
  function drawGridPattern() {
    const gridSize = 40;
    const gridOpacity = 0.07;
    
    ctx.strokeStyle = `rgba(250, 243, 217, ${gridOpacity})`;
    ctx.lineWidth = 0.5;
    
    // Draw vertical lines
    for(let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for(let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw diagonal accent lines (fewer)
    ctx.strokeStyle = `rgba(252, 151, 126, ${gridOpacity + 0.03})`;
    for(let i = 0; i < 10; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const length = 100 + Math.random() * 300;
      const angle = Math.random() * Math.PI * 2;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
      ctx.stroke();
    }
  }
  
  function drawKeywords() {
    keywordElements.forEach(keyword => {
      // Slowly move keywords
      keyword.y -= keyword.speed;
      
      // Wrap around when keywords go off screen
      if (keyword.y < -50) {
        keyword.y = height + 50;
        keyword.x = Math.random() * width * 0.8 + width * 0.1;
      }
      
      // Make keywords interact with mouse
      if (config.mouseInteraction && mouseX !== null && mouseY !== null) {
        const dx = keyword.x - mouseX;
        const dy = keyword.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < config.mouseRadius * 2) {
          const force = (config.mouseRadius * 2 - distance) / (config.mouseRadius * 2);
          const angle = Math.atan2(dy, dx);
          keyword.x += Math.cos(angle) * force * 2;
          keyword.y += Math.sin(angle) * force * 2;
          
          // Temporarily increase opacity when near mouse
          keyword.currentOpacity = keyword.opacity + force * 0.2;
        } else {
          keyword.currentOpacity = keyword.opacity;
        }
      } else {
        keyword.currentOpacity = keyword.opacity;
      }
      
      ctx.save();
      ctx.translate(keyword.x, keyword.y);
      ctx.rotate(keyword.rotation);
      ctx.font = `${keyword.size}px "Spline Sans", sans-serif`;
      ctx.fillStyle = `rgba(250, 243, 217, ${keyword.currentOpacity})`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(keyword.text, 0, 0);
      ctx.restore();
    });
  }
  
  function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }
  
  function handleMouseLeave() {
    mouseX = null;
    mouseY = null;
  }
  
  // Initialize
  window.addEventListener('resize', resizeCanvas);
  document.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseleave', handleMouseLeave);
  
  // Initial setup
  updateConfigForScreenSize();
  resizeCanvas();
  createFloatingShapes();
  if (config.showKeywords) {
    createKeywords();
  }
  draw();

  // Add parallax scroll effect to background elements
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Adjust floating shapes positions based on scroll
    floatingShapes.forEach((shape, index) => {
      // Different parallax effect for each shape
      const parallaxFactor = 0.05 + (index % 3) * 0.02;
      shape.origY = shape.origY || shape.y; // Store original position if not saved
      
      // Apply parallax offset
      shape.y = shape.origY - (scrollY * parallaxFactor);
    });
    
    // Slow down particle movement when scrolling for visual interest
    particles.forEach(p => {
      const slowdownFactor = Math.min(1, 0.7 + (scrollY / 2000));
      p.vx *= slowdownFactor;
      p.vy *= slowdownFactor;
    });
    
    // Rotate the grid slightly on scroll
    const rotationAngle = scrollY * 0.0001;
    canvas.style.transform = `rotate(${rotationAngle}deg)`;
  });

  // Add 3D tilt effect to the bars container
  const barsContainer = document.querySelector('.bars-container');
  
  // Mouse move event for 3D tilt effect
  document.getElementById('hero').addEventListener('mousemove', (e) => {
    const heroRect = document.getElementById('hero').getBoundingClientRect();
    const mouseX = e.clientX - heroRect.left;
    const mouseY = e.clientY - heroRect.top;
    
    // Calculate rotation based on mouse position
    const centerX = heroRect.width / 2;
    const centerY = heroRect.height / 2;
    const rotateY = ((mouseX - centerX) / centerX) * 8; // Max 8 degrees
    const rotateX = -((mouseY - centerY) / centerY) * 5; // Max 5 degrees
    
    // Apply 3D transform with smooth transition
    barsContainer.style.transition = 'transform 0.1s ease-out';
    barsContainer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    
    // Adjust top and bottom bars for enhanced 3D effect
    const topBar = document.querySelector('.top-bar');
    const bottomBar = document.querySelector('.bottom-bar');
    
    topBar.style.transform = `translateZ(40px) translateX(${-rotateY * 0.8}px)`;
    bottomBar.style.transform = `translateZ(20px) translateX(${rotateY * 0.8}px)`;
  });
  
  // Reset transform when mouse leaves
  document.getElementById('hero').addEventListener('mouseleave', () => {
    barsContainer.style.transition = 'transform 0.5s ease-out';
    barsContainer.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
    
    const topBar = document.querySelector('.top-bar');
    const bottomBar = document.querySelector('.bottom-bar');
    
    topBar.style.transform = '';
    bottomBar.style.transform = '';
  });

  function resizeUnityCanvas() {
    var canvas = document.getElementById("unity-canvas");
    if (canvas) {
      
      canvas.style.width = "100%";
      canvas.style.height = "100%";
    }
  }
  
  window.addEventListener("resize", resizeUnityCanvas);
  resizeUnityCanvas();


  
  const gallery = document.querySelector('.experience-gallery');

  
  
  gallery.innerHTML += gallery.innerHTML;

  
  const scrollSpeed = 1; 

  function autoScrollGallery() {
    
    gallery.scrollLeft += scrollSpeed;
    
    
    if (gallery.scrollLeft >= gallery.scrollWidth / 2) {
      gallery.scrollLeft = 0;
    }
    
    requestAnimationFrame(autoScrollGallery);
  }
  
  autoScrollGallery();



  gsap.registerPlugin(TextPlugin);
  gsap.registerPlugin(ScrollTrigger);

  // Hero Text Animation
  const nameBar = document.querySelector(".name-bar");
  const titleBar = document.getElementById("title-bar");
  const nameText = "Ethan Lawrie";
  
  // Populate name with spans for each letter
  nameText.split("").forEach(letter => {
    const span = document.createElement("span");
    span.textContent = letter;
    span.style.display = "inline-block"; // Important for individual transforms
    if (letter === " ") {
      span.style.width = "0.5em"; // Add space for space character
    }
    nameBar.appendChild(span);
  });

  const letters = nameBar.querySelectorAll("span");

  // Set initial states for animation
  gsap.set(".scroll-indicator", { autoAlpha: 0});


  // Create animation timeline
  const heroTl = gsap.timeline({ defaults: { ease: "power2.out" } });

  heroTl
    .from(letters, {
      duration: 0.6,
      autoAlpha: 0,
      y: -30,
      rotationX: -90,
      stagger: 0.05,
      ease: "power1.out"
    })
    .from(titleBar, {
      duration: 0.7,
      autoAlpha: 0,
      y: 25,
      ease: "power2.out"
    }, "<0.4")
    .to(".scroll-indicator", {
        autoAlpha:1,
        duration: 0.4,
        onComplete: () => {
          gsap.to(".scroll-indicator", {
            y: -10,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            duration: 0.8
          });
        }
    }, "-=0.2");
  

  // --- General Scroll-Triggered Animations ---

  // Function to create a fade-in and slide-up animation
  function createScrollAnimation(triggerElement, targetElements, options = {}) {
    const defaults = {
      autoAlpha: 0,
      y: 50, // Slide up from 50px below
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.2, // Default stagger for multiple elements
      scrollTrigger: {
        trigger: triggerElement,
        start: "top 85%", // Trigger when 85% of the element is in view
        toggleActions: "play none none none", // Play animation once
        // markers: true, // Uncomment for debugging
      }
    };

    gsap.from(targetElements, { ...defaults, ...options });
  }

  // Animate Section Headings
  document.querySelectorAll('.section-heading, .timeline-heading, .synopsis-heading').forEach(heading => {
    gsap.from(heading, {
      autoAlpha: 0,
      y: 30,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: heading,
        start: "top 85%",
        toggleActions: "play none none none",
        onEnter: () => {
          if (heading.classList.contains('synopsis-heading')) {
            heading.classList.add('is-visible'); // For underline animation
          }
        }
        // markers: true, // Uncomment for debugging
      }
    });
  });

  // Specifically animate .synopsis-text
  if (document.querySelector('.synopsis-text')) {
    createScrollAnimation(".synopsis-text", ".synopsis-text", { y: 25, duration: 0.7, delay: 0.2 }); // Delay slightly after heading might start
  }

  // Animate About Me Card
  if (document.querySelector('.about-card')) {
    const aboutCardTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".about-card",
        start: "top 85%",
        toggleActions: "play none none none",
      }
    });

    aboutCardTl
      .from(".about-card", { 
        autoAlpha: 0, 
        y: 50, 
        duration: 0.7, 
        ease: "power2.out" 
      }, 0)
      .from(".about-info h2", { 
        autoAlpha: 0, 
        x: -30, 
        duration: 0.5, 
        ease: "power2.out" 
      }, 0.3)
      .from(".about-info-photo", { 
        autoAlpha: 0, 
        scale: 0.5, 
        rotation: -15,
        duration: 0.8, 
        ease: "back.out(1.7)"
      }, 0.35)
      .from(".about-intro-paragraph", { 
        autoAlpha: 0, 
        y: 20, 
        duration: 0.6, 
        ease: "power2.out" 
      }, 0.45);

    // Parallax effect for synopsis section
    gsap.to(".about-synopsis", {
      backgroundPosition: "50% 100%",
      ease: "none",
      scrollTrigger: {
        trigger: ".about-synopsis",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    // Hover animations for subsections
    document.querySelectorAll('.about-subsection').forEach(subsection => {
      subsection.addEventListener('mouseenter', () => {
        gsap.to(subsection, {
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      subsection.addEventListener('mouseleave', () => {
        gsap.to(subsection, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });

    // Animate list items on hover
    document.querySelectorAll('.about-info li').forEach(item => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, {
          x: 10,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          x: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });
  }

  // Animate Timeline Box (Entrance Animation for Spine and Dates)
  if (document.querySelector('.timeline-box')) {
    const tlBox = document.querySelector('.timeline-box');
    const tlDatesContainer = tlBox.querySelector('.timeline-dates');
    const tlDates = tlBox.querySelectorAll('.timeline-date');

    if (tlDatesContainer && tlDates.length > 0) {
      const timelineEntranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: tlBox,
          start: "top 75%", // Trigger a bit earlier
          toggleActions: "play none none none",
          // markers: true,
        }
      });

      timelineEntranceTl
        .to(tlDatesContainer, { // Animating a dummy property to target ::before is tricky, so animate container or use JS to change a CSS var
                                // For simplicity, we can make the spine animation part of the overall reveal.
                                // A more direct ::before animation often requires more complex setups.
                                // Here, we ensure the container is visible, then animate dates.
                                // True spine drawing animation: set initial height via JS or CSS var, then animate it.
                                // Let's assume CSS handles initial height:0 for ::before.
                                // We will animate the ::before element of .timeline-dates directly.
          duration: 0.01, // almost instant, just to ensure it's in the timeline flow
          onStart: () => { // A trick to trigger the ::before animation by changing a class or style if needed
                        // However, direct GSAP on pseudo-elements is not possible.
                        // Instead, we'll animate height using a class toggle or direct style if possible,
                        // or let CSS transition handle it if height is changed from 0 to auto/100%.
                        // For this example, let's rely on GSAP animating properties of actual elements.
                        // The height:0 on ::before is set. We need to animate it to full height.
                        // The best way is to set a CSS variable if GSAP can animate it or use a class.
                        // Let's add a class that sets height to 100% and let CSS transition handle it.
            if (tlDatesContainer.classList.contains('timeline-dates')) { // ensure it's the right element
                gsap.to(getComputedStyle(tlDatesContainer, '::before'), { // This won't work directly for animation
                    // height: "100%", // Cannot directly animate pseudo-elements like this with GSAP
                });
                // Fallback: We can animate the container slightly and let CSS handle ::before if its height is % based
                // Or, animate a clip-path on the container if the ::before is inside it.
                // Simplest for now: ensure the spine is visible when dates appear.
                // We will add a class to .timeline-dates that then allows CSS to transition the ::before element's height
                tlDatesContainer.classList.add('spine-visible');
            }
          }
        })
        .to(tlDates, {
          autoAlpha: 1,
          scale: 1,
          stagger: 0.25, // Stagger the appearance of each date
          duration: 0.5,
          ease: "back.out(1.7)" // A bouncy feel
        }, "-=0.0"); // Start slightly after spine animation (or with it)
    }
  }

  // Animate Skill Items (with stagger)
  if (document.querySelectorAll('.skill-item').length > 0) {
    createScrollAnimation(".skills-grid", ".skill-item", { stagger: 0.15, y: 30 });
  }

  // Animate Experience Items
  document.querySelectorAll('.experience-item').forEach(item => {
    createScrollAnimation(item, item, { y: 40 });
  });
  
  // Animate Game Section Details
  if (document.querySelector('.game-details')) {
      createScrollAnimation(".game-details", ".game-info, .phone-wrapper", { y:40, stagger: 0.2});
  }

  // Animate Contact Box
  if (document.querySelector('.contact-box')) {
    createScrollAnimation("#contact", ".contact-box", { y: 40 });
  }

  // --- End of General Scroll-Triggered Animations ---

  const timelineDates = document.querySelectorAll(".timeline-date");
  const timelineDetail = document.querySelector(".timeline-detail");
  const curDateElement = document.getElementById("curDate");
  const dateTextElement = document.getElementById("dateText");

  if (timelineDates.length > 0 && timelineDetail && curDateElement && dateTextElement) {
    timelineDates.forEach(item => {
      item.addEventListener("click", function() {
        const date = item.getAttribute("data-date");
        const info = item.getAttribute("data-info");
        
        if (item.classList.contains("active")) {
          return;
        }

        // Remove .connector-active from previously active item
        const currentlyActive = document.querySelector(".timeline-date.active");
        if (currentlyActive) {
          currentlyActive.classList.remove("connector-active");
        }

        let showNewDetail = () => {
          curDateElement.textContent = date;
          dateTextElement.textContent = info;
          timelineDetail.classList.add("is-visible");
          timelineDates.forEach(el => el.classList.remove("active"));
          item.classList.add("active");
          // Add .connector-active to the newly active item for desktop connector animation
          setTimeout(() => item.classList.add("connector-active"), 10); // Small delay to ensure .active is set
        };

        if (timelineDetail.classList.contains("is-visible")) {
          timelineDetail.classList.remove("is-visible");
          // Wait for the fade-out transition to (mostly) complete
          setTimeout(showNewDetail, 400); // Adjust timeout to match CSS transition duration (0.5s)
        } else {
          showNewDetail(); // If no card is visible, show directly
        }
      });
    });

    // Optional: Display the first timeline item's details by default if needed
    // if (timelineDates.length > 0) {
    //   timelineDates[0].click(); 
    // }
  }

  // --- Timeline Dial Functionality ---
  const dialTicks = document.querySelectorAll('.dial-tick.major-tick');
  const dialHandle = document.querySelector('.dial-handle');
  const dialYearDisplay = document.getElementById('dial-year');
  const detailYear = document.getElementById('detail-year');
  const detailText = document.getElementById('detail-text');
  const dialTimelineDetail = document.querySelector('.timeline-detail');

  // Define rotation angles for each year position
  const yearPositions = {
    '2021': 210,
    '2022': 270,
    '2023': 330
  };
  
  // Initialize dial to 2021 position
  dialHandle.style.transform = `translate(-50%, -50%) rotate(${yearPositions['2021']}deg)`;
  
  // Add click handlers to dial ticks
  if (dialTicks) {
    dialTicks.forEach(tick => {
      tick.addEventListener('click', function() {
        const year = this.getAttribute('data-year');
        const info = this.getAttribute('data-info');
        
        // Skip if already active
        if (this.classList.contains('active')) {
          return;
        }
        
        // Update active tick
        dialTicks.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Update central year display
        dialYearDisplay.textContent = year;
        
        // Rotate dial handle to point to selected year
        dialHandle.style.transform = `translate(-50%, -50%) rotate(${yearPositions[year]}deg)`;
        
        // Add "clicking" sound effect
        playDialClickSound();
        
        // Show detail with slight rotation animation for mechanical feel
        animateDialTurn(yearPositions[year]);
        
        // Update detail card
        updateDetailCard(year, info);
      });
    });
  }
  
  // Function to update the detail card
  function updateDetailCard(year, info) {
    // If card is already visible, fade it out first
    if (dialTimelineDetail.classList.contains('is-visible')) {
      dialTimelineDetail.classList.remove('is-visible');
      
      // Wait for fade-out animation to complete
      setTimeout(() => {
        detailYear.textContent = year;
        detailText.textContent = info;
        dialTimelineDetail.classList.add('is-visible');
      }, 300);
    } else {
      // Otherwise, update and show immediately
      detailYear.textContent = year;
      detailText.textContent = info;
      dialTimelineDetail.classList.add('is-visible');
    }
  }
  
  // Function to add mechanical dial turn animation
  function animateDialTurn(targetAngle) {
    // Get the outer ring for subtle animation
    const outerRing = document.querySelector('.dial-outer-ring');
    
    // Add subtle shake animation
    gsap.to(outerRing, {
      rotateZ: -2,
      duration: 0.1,
      ease: "power1.out",
      onComplete: () => {
        gsap.to(outerRing, {
          rotateZ: 1,
          duration: 0.1,
          ease: "power1.inOut",
          onComplete: () => {
            gsap.to(outerRing, {
              rotateZ: 0,
              duration: 0.2,
              ease: "power3.out"
            });
          }
        });
      }
    });
  }
  
  // Function to play a click sound (simulated mechanical click)
  function playDialClickSound() {
    // Create oscillator for a quick click sound
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      // If Web Audio API not supported, silently fail
      console.log("Audio not supported");
    }
  }

  // Add hover effect to make dial feel more interactive
  const dialTimeline = document.querySelector('.dial-timeline');
  if (dialTimeline) {
    dialTimeline.addEventListener('mousemove', function(e) {
      const bounds = this.getBoundingClientRect();
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;
      
      // Calculate angle from center to mouse position
      const angleX = (mouseX - centerX) / 20;
      const angleY = (mouseY - centerY) / 20;
      
      // Apply subtle tilt effect based on mouse position
      this.style.transform = `rotateY(${angleX}deg) rotateX(${-angleY}deg)`;
    });
    
    dialTimeline.addEventListener('mouseleave', function() {
      // Reset transform on mouse leave
      this.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }
});
  
  
 
  












        

            


          

  

          













          
    









        

          

  

          













          
          


