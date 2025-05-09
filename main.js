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

  // --- Safe Timeline Functionality ---
  const timelineNumbers = document.querySelectorAll('.dial-numbers .number');
  const dialArrow = document.querySelector('.dial-arrow');
  const eventYear = document.querySelector('.event-year');
  const eventDescription = document.querySelector('.event-description p');
  
  // Define positions for the dial arrow
  const arrowPositions = {
    '2021': 0,    // Top position (0 degrees)
    '2022': 90,   // Right position (90 degrees)
    '2023': 180   // Bottom position (180 degrees)
  };
  
  // Initialize to first year
  if (timelineNumbers && timelineNumbers.length > 0) {
    const initialYear = timelineNumbers[0].getAttribute('data-year');
    dialArrow.style.transform = `translateX(-50%) rotate(${arrowPositions[initialYear]}deg)`;
  }
  
  // Add click handlers for each year
  if (timelineNumbers && dialArrow) {
    timelineNumbers.forEach(number => {
      number.addEventListener('click', function() {
        const year = this.getAttribute('data-year');
        const info = this.getAttribute('data-info');
        
        // Skip if already active
        if (this.classList.contains('active')) {
          return;
        }
        
        // Deactivate all numbers
        timelineNumbers.forEach(n => n.classList.remove('active'));
        
        // Activate clicked number
        this.classList.add('active');
        
        // Play click sound
        playClickSound();
        
        // Animate the dial rotation
        animateDialRotation(arrowPositions[year]);
        
        // Update the event information with subtle animation
        updateEventInfo(year, info);
      });
    });
  }
  
  // Function to play mechanical click sound
  function playClickSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'triangle';
      oscillator.frequency.value = 600;
      
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      // Audio not supported - silent fail
    }
  }
  
  // Function to animate the dial rotation with bounce effect
  function animateDialRotation(targetAngle) {
    // Create GSAP animation with bounce effect
    gsap.to(dialArrow, {
      rotation: targetAngle, 
      duration: 0.8,
      ease: "back.out(1.7)",
      transformOrigin: "bottom center",
      onUpdate: function() {
        dialArrow.style.transform = `translateX(-50%) rotate(${this.targets()[0].rotation}deg)`;
      }
    });
    
    // Add subtle shake to the vault
    const vaultDial = document.querySelector('.vault-dial');
    if (vaultDial) {
      gsap.to(vaultDial, {
        rotation: -2,
        duration: 0.1,
        ease: "power1.inOut",
        onComplete: () => {
          gsap.to(vaultDial, {
            rotation: 2,
            duration: 0.1,
            ease: "power1.inOut",
            onComplete: () => {
              gsap.to(vaultDial, {
                rotation: 0,
                duration: 0.3,
                ease: "elastic.out(1, 0.3)"
              });
            }
          });
        }
      });
    }
  }
  
  // Function to update event info
  function updateEventInfo(year, info) {
    // Fade out
    gsap.to([eventYear, eventDescription], {
      opacity: 0,
      y: -10,
      duration: 0.2,
      stagger: 0.05,
      onComplete: () => {
        // Update content
        eventYear.textContent = year;
        eventDescription.textContent = info;
        
        // Fade in with small delay
        gsap.to([eventYear, eventDescription], {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.1,
          delay: 0.1
        });
      }
    });
  }
  
  // Add interactivity for the vault dial
  const vaultDial = document.querySelector('.vault-dial');
  if (vaultDial) {
    vaultDial.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const tiltX = ((mouseX - centerX) / centerX) * 5;
      const tiltY = ((mouseY - centerY) / centerY) * 5;
      
      this.style.transform = `perspective(1000px) rotateX(${-tiltY}deg) rotateY(${tiltX}deg) scale(1.02)`;
    });
    
    vaultDial.addEventListener('mouseleave', function() {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  }

  // --- Skills Section Functionality ---
  const categoryButtons = document.querySelectorAll('.category-btn');
  const skillsCategories = document.querySelectorAll('.skills-category');
  const skillCards = document.querySelectorAll('.skill-card');
  
  // Initialize skill cards animation
  function initSkillCards() {
    // Create an intersection observer to trigger animations when in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          // Stagger animation of skill level bars
          const skillLevel = entry.target.querySelector('.skill-level');
          if (skillLevel) {
            skillLevel.style.transitionDelay = `${Math.random() * 0.3}s`;
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    // Observe all skill cards
    skillCards.forEach(card => {
      observer.observe(card);
    });
  }
  
  // Category switching functionality
  if (categoryButtons && categoryButtons.length > 0) {
    categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons and add to clicked button
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Hide all skill categories
        skillsCategories.forEach(category => {
          category.classList.remove('active');
        });
        
        // Show selected category
        const categoryId = `${button.dataset.category}-skills`;
        const selectedCategory = document.getElementById(categoryId);
        if (selectedCategory) {
          selectedCategory.classList.add('active');
          
          // Reset animations for newly visible skill cards
          const visibleCards = selectedCategory.querySelectorAll('.skill-card');
          visibleCards.forEach(card => {
            card.classList.remove('animate');
            setTimeout(() => {
              card.classList.add('animate');
            }, 50);
          });
        }
      });
    });
  }
  
  // Initialize skills section
  initSkillCards();

  // --- Advanced Timeline Functionality ---
  const timelineMarkers = document.querySelectorAll('.timeline-marker');
  const timelineContents = document.querySelectorAll('.timeline-content');
  const timelinePrev = document.getElementById('timeline-prev');
  const timelineNext = document.getElementById('timeline-next');
  const activeYearDisplay = document.getElementById('active-year');
  const progressBar = document.getElementById('timeline-progress');
  
  // Map of years to their positions in the timeline (percentage)
  const yearPositions = {
    '2011': 0,
    '2017': 20,
    '2021': 40,
    '2022': 60,
    '2023': 80, 
    '2024': 100
  };
  
  // Array of years for easier navigation
  const years = Object.keys(yearPositions);
  let currentYearIndex = years.length - 1; // Start with the latest year (2024)
  
  // Initialize timeline
  function initTimeline() {
    // Set initial active year
    updateTimelineState(years[currentYearIndex]);
    
    // Add click events to markers
    timelineMarkers.forEach(marker => {
      const year = marker.getAttribute('data-year');
      
      marker.addEventListener('click', () => {
        const clickedYearIndex = years.indexOf(year);
        currentYearIndex = clickedYearIndex;
        updateTimelineState(year);
      });
    });
    
    // Add navigation button events
    if (timelinePrev) {
      timelinePrev.addEventListener('click', navigatePrevYear);
    }
    
    if (timelineNext) {
      timelineNext.addEventListener('click', navigateNextYear);
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (isTimelineInView()) {
        if (e.key === 'ArrowLeft') {
          navigatePrevYear();
        } else if (e.key === 'ArrowRight') {
          navigateNextYear();
        }
      }
    });
    
    // Check if timeline is in viewport for keyboard navigation
    function isTimelineInView() {
      const timeline = document.querySelector('.advanced-timeline');
      if (!timeline) return false;
      
      const rect = timeline.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
  }
  
  // Navigate to previous year
  function navigatePrevYear() {
    if (currentYearIndex > 0) {
      currentYearIndex--;
      updateTimelineState(years[currentYearIndex]);
    }
  }
  
  // Navigate to next year
  function navigateNextYear() {
    if (currentYearIndex < years.length - 1) {
      currentYearIndex++;
      updateTimelineState(years[currentYearIndex]);
    }
  }
  
  // Update timeline state based on selected year
  function updateTimelineState(year) {
    // Update year indicator with animation
    const yearIndicator = document.querySelector('.year-indicator');
    yearIndicator.classList.add('changing');
    
    setTimeout(() => {
      activeYearDisplay.textContent = year;
      yearIndicator.classList.remove('changing');
    }, 300);
    
    // Update progress bar
    if (progressBar) {
      progressBar.style.width = `${yearPositions[year]}%`;
    }
    
    // Update active marker
    timelineMarkers.forEach(marker => {
      const markerYear = marker.getAttribute('data-year');
      if (markerYear === year) {
        marker.classList.add('active');
    } else {
        marker.classList.remove('active');
      }
    });
    
    // Update active content
    timelineContents.forEach(content => {
      const contentYear = content.getAttribute('data-year');
      
      if (contentYear === year) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
    
    // Add animation to active card
    const activeCard = document.querySelector(`.timeline-content[data-year="${year}"] .timeline-card`);
    if (activeCard) {
      activeCard.classList.add('animate-card');
      setTimeout(() => {
        activeCard.classList.remove('animate-card');
      }, 1000);
    }
  }
  
  // Initialize timeline if elements exist
  if (timelineMarkers.length > 0 && timelineContents.length > 0) {
    initTimeline();
  }

  // --- Profile Tab System ---
  const profileTabButtons = document.querySelectorAll('.profile-tab');
  const profileTabPanels = document.querySelectorAll('.tab-panel');
  
  // Initialize profile tabs
  function initProfileTabs() {
    profileTabButtons.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        
        // Skip if already active
        if (tab.classList.contains('active')) {
          return;
        }
        
        // Update active state for tabs
        profileTabButtons.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Hide all panels with animation
        profileTabPanels.forEach(panel => {
          if (panel.classList.contains('active')) {
            // Fade out
            gsap.to(panel, {
              opacity: 0,
              y: 20,
              duration: 0.3,
              onComplete: () => {
                panel.classList.remove('active');
                
                // Show the target panel
                const targetPanel = document.getElementById(`${targetTab}-panel`);
                if (targetPanel) {
                  targetPanel.classList.add('active');
                  // Fade in
                  gsap.fromTo(targetPanel, 
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
                  );
                }
              }
            });
          }
        });
      });
    });
    
    // Initialize expertise cards animation
    animateProfileElements();
  }
  
  // Add scroll animation for profile elements
  function animateProfileElements() {
    // Expertise cards
    const expertiseCards = document.querySelectorAll('.expertise-card');
    gsap.from(expertiseCards, {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: '.expertise-grid',
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
    
    // Education items
    const educationItems = document.querySelectorAll('.education-item');
    gsap.from(educationItems, {
      opacity: 0,
      x: -50,
      stagger: 0.2,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: '#education-panel',
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
    
    // Interest tags
    const interestTags = document.querySelectorAll('.interests-tags span');
    gsap.from(interestTags, {
      opacity: 0,
      y: 20,
      stagger: 0.05,
      duration: 0.4,
      ease: "power2.out",
      scrollTrigger: {
        trigger: '.interests-tags',
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
    
    // Profile photo animation
    gsap.from('.profile-photo-container', {
      opacity: 0,
      rotation: -15,
    scale: 0.7,
      duration: 1,
      ease: "elastic.out(1, 0.5)",
      scrollTrigger: {
        trigger: '.profile-header',
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
    
    // Stats counter animation
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(statValue => {
      const targetText = statValue.textContent;
      if (targetText.match(/\d+\+/)) {
        const numValue = parseInt(targetText);
        gsap.fromTo(statValue, 
          { textContent: "0" },
          { 
            duration: 1.5,
            textContent: numValue,
            snap: { textContent: 1 },
            stagger: 0.25,
            ease: "power2.out",
    onComplete: () => {
              statValue.textContent = `${numValue}+`;
            },
            scrollTrigger: {
              trigger: '.profile-stats',
              start: "top 80%",
              toggleActions: "play none none none"
            }
          }
        );
    }
  });
}

  // Profile hover effects
  function initProfileHoverEffects() {
    // Stats items glow effect
    document.querySelectorAll('.stat-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, { 
          y: -10,
          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)",
          duration: 0.3,
          ease: "power2.out"
        });
      });
      
      item.addEventListener('mouseleave', () => {
        gsap.to(item, { 
          y: 0,
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
          duration: 0.5,
          ease: "power2.out"
        });
      });
    });
    
    // Expertise cards hover effect with slight 3D rotation
    document.querySelectorAll('.expertise-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = ((x - centerX) / centerX) * 5;
        const rotateX = ((y - centerY) / centerY) * -5;
        
        gsap.to(card, {
          rotateX,
          rotateY,
          transformPerspective: 1000,
          ease: "power1.out",
          duration: 0.5
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.5)"
        });
      });
    });
  }
  
  // Initialize the profile tab system if elements exist
  if (profileTabButtons.length > 0 && profileTabPanels.length > 0) {
    initProfileTabs();
    initProfileHoverEffects();
  }

  // Terminal typing animation
  function simulateTyping() {
    const terminalLines = document.querySelectorAll('.terminal-line');
    
    terminalLines.forEach((line, index) => {
      setTimeout(() => {
        line.classList.add('typed');
      }, index * 500);
    });
  }
  
  // Initialize terminal animations
  function initTerminal() {
    setTimeout(simulateTyping, 800);
    
    // Set progress for stat circles with animation
    const progressCircles = document.querySelectorAll('.stat-progress');
    progressCircles.forEach((circle, index) => {
      setTimeout(() => {
        circle.classList.add('animate');
      }, 1500 + (index * 300));
    });
  }
  
  // Call initialization once DOM is loaded
  window.addEventListener('load', initTerminal);
  
  // Add particle effects to expertise cards
  function addParticleEffects() {
    const expertiseCards = document.querySelectorAll('.expertise-card');
    
    expertiseCards.forEach(card => {
      const particles = card.querySelector('.card-particles');
      if (particles) {
        // Create floating particles
        for (let i = 0; i < 3; i++) {
          const particle = document.createElement('span');
          particle.classList.add('floating-particle');
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          particle.style.animationDelay = `${Math.random() * 3}s`;
          particles.appendChild(particle);
        }
      }
    });
  }
  
  // Initialize particle effects
  window.addEventListener('load', addParticleEffects);

  // Profile IDE Tabs
  function setupIDETabs() {
    const ideTabs = document.querySelectorAll('.ide-tab');
    const idePanels = document.querySelectorAll('.ide-panel');

    ideTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update active tab
            ideTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active panel
            idePanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `${targetTab}-panel`) {
                    panel.classList.add('active');
                }
            });
        });
    });
  }

  // Initialize stat progress circles
  function initStatProgress() {
    const statProgressElements = document.querySelectorAll('.stat-progress');
    
    statProgressElements.forEach(element => {
        const value = parseInt(element.dataset.value);
        const maxValue = value >= 100 ? 100 : value;
        const percentage = (maxValue / 100) * 100;
        element.style.setProperty('--progress', `${percentage}%`);
    });
  }

  // Initialize expertise meters
  function initExpertiseMeters() {
    const meterElements = document.querySelectorAll('.meter-fill');
    
    meterElements.forEach(meter => {
        const level = parseInt(meter.dataset.level);
        meter.style.width = `${level}%`;
    });
  }

  // Terminal typing effect
  function setupTypedEffect() {
    const typedElement = document.querySelector('.typed-text');
    if (!typedElement) return;
    
    const text = typedElement.textContent;
    typedElement.textContent = '';
    typedElement.style.borderRight = '2px solid var(--primary-color)';
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            typedElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 30);
        } else {
            typedElement.style.borderRight = 'none';
        }
    }
    
    setTimeout(typeWriter, 1000);
  }

  // Initialize about section components
  function initAboutSection() {
    setupIDETabs();
    initStatProgress();
    initExpertiseMeters();
    setupTypedEffect();
  }

  // Initialize all components when DOM is loaded
  initAboutSection();

  // Initialize Experience Gallery functionality
  function initExperienceGallery() {
    console.log('Initializing experience gallery...');
    const galleries = document.querySelectorAll('.experience-gallery-container');
    
    galleries.forEach(gallery => {
      const slides = gallery.querySelectorAll('.gallery-slide');
      const dots = gallery.querySelectorAll('.dot');
      const prevBtn = gallery.querySelector('.gallery-control.prev');
      const nextBtn = gallery.querySelector('.gallery-control.next');
      let currentIndex = 0;
      
      // Function to show a specific slide
      function showSlide(index) {
        // Check bounds
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        // Update current index
        currentIndex = index;
        
        // Hide all slides and update dots
        slides.forEach((slide, i) => {
          slide.classList.toggle('active', i === index);
        });
        
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
        });
      }
      
      // Set up event listeners for controls
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          showSlide(currentIndex - 1);
        });
      }
      
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          showSlide(currentIndex + 1);
        });
      }
      
      // Set up event listeners for dots
      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          showSlide(i);
        });
      });
      
      // Auto-rotate slides every 5 seconds
      let slideInterval = setInterval(() => {
        showSlide(currentIndex + 1);
      }, 5000);
      
      // Pause rotation on hover
      gallery.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
      });
      
      gallery.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
          showSlide(currentIndex + 1);
        }, 5000);
      });
      
      // Initialize with first slide
      showSlide(0);
    });
  }

  // Call gallery initialization function when the DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing features...');
    
    // Initialize the experience gallery
    initExperienceGallery();
    
    // Initialize data engineer section
    initDataEngineerSection();
    
    // Run any other initializations here
  });

  // Also call it immediately to ensure it works
  initExperienceGallery();
  initDataEngineerSection();

  // Data Engineer Section - Tab Switching & Thumbnail Gallery
  function initDataEngineerSection() {
    console.log('Initializing data engineer section...');
    // Tab switching functionality
    const deTabs = document.querySelectorAll('.de-tab');
    const dePanels = document.querySelectorAll('.de-panel');
    
    if (deTabs.length === 0 || dePanels.length === 0) {
      console.log('Data Engineer tabs or panels not found');
      return;
    }
    
    console.log(`Found ${deTabs.length} tabs and ${dePanels.length} panels`);
    
    deTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetPanel = tab.getAttribute('data-panel');
        console.log(`Tab clicked: ${targetPanel}`);
        
        // Skip if already active
        if (tab.classList.contains('active')) {
          return;
        }
        
        // Update active tab
        deTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show the corresponding panel
        dePanels.forEach(panel => {
          panel.classList.remove('active');
          
          if (panel.id === `${targetPanel}-panel`) {
            panel.classList.add('active');
          }
        });
      });
    });
    
    // Thumbnail gallery functionality
    const thumbnails = document.querySelectorAll('.de-thumbnail');
    const featuredImage = document.querySelector('.de-featured-image img');
    const imageCaption = document.querySelector('.de-image-caption');
    
    if (thumbnails.length > 0 && featuredImage && imageCaption) {
      console.log(`Found ${thumbnails.length} thumbnails`);
      
      thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
          // Skip if already active
          if (thumbnail.classList.contains('active')) {
            return;
          }
          
          // Get the image source and caption
          const imageSrc = thumbnail.getAttribute('data-image');
          const caption = thumbnail.getAttribute('data-caption');
          
          // Update active thumbnail
          thumbnails.forEach(t => t.classList.remove('active'));
          thumbnail.classList.add('active');
          
          // Fade out current image
          featuredImage.style.opacity = '0';
          setTimeout(() => {
            // Update featured image source and caption
            featuredImage.src = imageSrc;
            imageCaption.textContent = caption;
            
            // Fade in new image
            featuredImage.style.opacity = '1';
          }, 300);
        });
      });
    }
  }
});
  
  
 
  




          
    









        

          

  

          













          
          


