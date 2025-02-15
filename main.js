


document.addEventListener("DOMContentLoaded", function() {


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



  gsap.registerPlugin();
  gsap.registerPlugin(TextPlugin);
  gsap.registerPlugin(ScrollTrigger);

  
  
  
  
  
  
  
  
  
  
  
  
  

 

  gsap.to(".top-bar", {
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    },
    x: "-150%",    
    scaleX: 2      
  });
  
  
  gsap.to(".bottom-bar", {
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    },
    x: "150%",     
    scaleX: 2      
  });
  

const descriptiveWords = [
  "Innovative", "Analytical", "Creative", "Driven", "Passionate", "Resourceful",
  "Versatile", "Collaborative", "Visionary", "Dedicated", "Strategic", "Dynamic",
  "Curious", "Intuitive", "Adaptive", "Proactive", "Methodical", "Detail-Oriented",
  "Resilient", "Tech-Savvy", "Efficient", "Inspirational", "Ambitious", "Cutting-Edge",
  "Forward-Thinking", "Agile", "Modern", "Futuristic", "Scalable", "C++", "AI",
  "TensorFlow", "Algorithms", "Unity", "Machine Learning", "Data-Driven", "Robust",
  "Optimized", "Architect", "Leader"
];


const fonts = [
  "'Bebas Neue', sans-serif",
  "'Candal', sans-serif",
  "'DM Mono', monospace",
  "'DM Serif Text', serif",
  "'Domine', serif",
  "'Encode Sans SC', sans-serif",
  "'Kumar One', sans-serif",
  "'Playwrite AU NSW', serif",
  "'Quintessential', cursive",
  "'Radley', sans-serif",
  "'Roboto Condensed', sans-serif",
  "'Spline Sans', sans-serif",
  "'Tangerine', cursive"
];

const container = document.getElementById("word-map");


function getHeroRect() {
  const heroContent = document.querySelector(".hero-content");
  return heroContent ? heroContent.getBoundingClientRect() : null;
}


function intersectsHero(candidateRect, heroRect) {
  if (!heroRect) return false;
  return !(
    candidateRect.right < heroRect.left ||
    candidateRect.left > heroRect.right ||
    candidateRect.bottom < heroRect.top ||
    candidateRect.top > heroRect.bottom
  );
}

function spawnWord() {
  
  const word = descriptiveWords[Math.floor(Math.random() * descriptiveWords.length)];
  
  const font = fonts[Math.floor(Math.random() * fonts.length)];
  const fontSize = Math.random() * 40 + 20; 

  
  const temp = document.createElement("span");
  temp.style.fontFamily = font;
  temp.style.fontSize = fontSize + "px";
  temp.style.whiteSpace = "nowrap";
  temp.style.position = "absolute";
  temp.style.visibility = "hidden";
  temp.innerText = word;
  document.body.appendChild(temp);
  const textWidth = temp.offsetWidth;
  const textHeight = temp.offsetHeight;
  document.body.removeChild(temp);

  
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;
  
  const heroRect = getHeroRect();

  
  let posX, posY;
  const maxAttempts = 50;
  let candidateRect;
  let valid = false;
  for (let i = 0; i < maxAttempts; i++) {
    posX = Math.random() * (containerWidth - textWidth);
    posY = Math.random() * (containerHeight - textHeight);
    candidateRect = {
      left: posX,
      top: posY,
      right: posX + textWidth,
      bottom: posY + textHeight
    };
    if (heroRect && intersectsHero(candidateRect, heroRect)) {
      continue;
    } else {
      valid = true;
      break;
    }
  }
  
  if (!valid) {
    posX = Math.random() * (containerWidth - textWidth);
    posY = Math.random() * (containerHeight - textHeight);
  }

  
  const wordElem = document.createElement("span");
  wordElem.classList.add("word");
  wordElem.style.fontFamily = font;
  wordElem.style.fontSize = fontSize + "px";
  wordElem.style.left = posX + "px";
  wordElem.style.top = posY + "px";
  container.appendChild(wordElem);

  
  gsap.to(wordElem, {
    duration: 2,
    text: { value: word },
    ease: "none"
  });
  
  gsap.to(wordElem, {
    duration: 0.5,
    opacity: 1,
    delay: 0.5
  });
  
  gsap.to(wordElem, {
    duration: 1,
    opacity: 0,
    delay: 4,
    onComplete: () => {
      container.removeChild(wordElem);
    }
  });
}


setInterval(spawnWord, 1500);






    
    const timelineDates = document.querySelectorAll(".timeline-date");
    const timelineDetail = document.querySelector(".timeline-detail");
  
    timelineDates.forEach(item => {
      item.addEventListener("click", function() {
        const date = item.getAttribute("data-date");
        const info = item.getAttribute("data-info");
        
        const curDate = document.getElementById("curDate").getAttribute('cur-date');

        const oldHeight = timelineDetail.clientHeight;


        console.log(`${date} , ${curDate}`);
        
        gsap.to("#curDate", {
          duration: 1,
           text: `20`, rtl:true});

        gsap.to("#curDate", {
          duration: 1,
           text: `${date}`, delay: 1});


           gsap.to("#dateText", {
            duration: 1,
              text: ``, rtl: true});

        gsap.to("#dateText", {
        duration: 5,
          text: `${info}`, delay: 1});
        
        
        timelineDates.forEach(el => el.classList.remove("active"));
        item.classList.add("active");
      });
    });
    const form = document.getElementById("contact-form");
    const responseMsg = document.getElementById("form-response");
    const loadingMsg = document.getElementById("form-loading");
    const submitButton = form.querySelector("button");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      
      submitButton.disabled = true;
      
      loadingMsg.style.display = "flex";
  
      try {
        
        
        const token = await grecaptcha.enterprise.execute("6LeZZdQqAAAAAK11RLs8Hoa7UH4aw1E5Gh4NXZvE", { action: 'submit' });
        
        
  
        
        const formData = {
          name: form.name.value,
          _replyto: form._replyto.value,
          subject: form.subject.value,
          message: form.message.value,
          gCaptchaResponse: token,  
        };
  
        
        const url = form.action;
  
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(formData),
        });
  
        const data = await res.json();
        
        
        gsap.to(form, { duration: 0.5, opacity: 0, onComplete: () => form.style.display = "none" });
        
        loadingMsg.style.display = "none";
        gsap.to(responseMsg, { duration: 0.5, opacity: 1, delay: 0.5 });
      } catch (err) {
        console.error("Submission error:", err);
        alert("There was an error submitting the form. Please try again.");
        
        submitButton.disabled = false;
        loadingMsg.style.display = "none";
      }
    });
  });
  
  
 
  





        

            


          

  

          













          
    









        

          

  

          













          
          


