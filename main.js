document.addEventListener("DOMContentLoaded", function() {
    const timelineDates = document.querySelectorAll(".timeline-date");
    const timelineDetail = document.querySelector(".timeline-detail");
  
    timelineDates.forEach(item => {
      item.addEventListener("click", function() {
        const date = item.getAttribute("data-date");
        const info = item.getAttribute("data-info");
        
        const curDate = document.getElementById("curDate").getAttribute('cur-date');

        const oldHeight = timelineDetail.clientHeight;


        console.log(`${date} , ${curDate}`);
        if(date > curDate) {
            gsap.to(timelineDetail, {
                opacity: 0,
                y: -20,
                duration: 0.3,
                ease: "power2.in",
                onComplete: function() {
                

                    

                  timelineDetail.innerHTML = `<h3 id="curDate" cur-date="${date}">${date}</h3><p>${info}</p>`;
                  
                  const newHeight = timelineDetail.scrollHeight;
          
                  timelineDetail.style.height = oldHeight + "px";
                  
                  gsap.to(timelineDetail, {
                  height: newHeight,
                  duration: 0.5,
                  ease: "power2.out",
                  onComplete: function() {
                    //   timelineDetail.style.height = "auto";
                  }
                  });
      
                  gsap.fromTo(timelineDetail, 
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
                  );
                  
            
                }
              });
        } else {
            gsap.to(timelineDetail, {
                opacity: 0,
                y: 20,
                duration: 0.3,
                ease: "power2.in",
                onComplete: function() {
                
                  timelineDetail.innerHTML = `<h3 id="curDate" cur-date="${date}">${date}</h3><p>${info}</p>`;
                  
                  const newHeight = timelineDetail.scrollHeight;
          
                  timelineDetail.style.height = oldHeight + "px";
                  
                  gsap.to(timelineDetail, {
                  height: newHeight,
                  duration: 0.5,
                  ease: "power2.out",
                  onComplete: function() {
                    //   timelineDetail.style.height = "auto";
                  }
                  });
      
                  gsap.fromTo(timelineDetail, 
                    { opacity: 0, y: -20 },
                    { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
                  );
                  
                  
                }
              });
        }
        
        
        
        timelineDates.forEach(el => el.classList.remove("active"));
        item.classList.add("active");
      });
    });
  });
  
  