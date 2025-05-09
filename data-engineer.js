// Data Engineer Section Functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing Data Engineer section from dedicated file...');
  initDataEngineerTabs();
  initDataEngineerGallery();
});

// Initialize tab functionality
function initDataEngineerTabs() {
  const tabs = document.querySelectorAll('.de-tab');
  const panels = document.querySelectorAll('.de-panel');
  
  console.log(`Found ${tabs.length} data engineer tabs and ${panels.length} panels`);
  
  if (tabs.length === 0 || panels.length === 0) return;
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const target = this.getAttribute('data-panel');
      console.log(`Data Engineer tab clicked: ${target}`);
      
      // Remove active class from all tabs and panels
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      // Add active class to selected tab and panel
      this.classList.add('active');
      document.getElementById(`${target}-panel`).classList.add('active');
    });
  });
}

// Initialize thumbnail gallery functionality
function initDataEngineerGallery() {
  const thumbnails = document.querySelectorAll('.de-thumbnail');
  const featuredImage = document.querySelector('.de-featured-image img');
  const imageCaption = document.querySelector('.de-image-caption');
  
  if (!featuredImage || !imageCaption || thumbnails.length === 0) return;
  
  console.log(`Found ${thumbnails.length} data engineer gallery thumbnails`);
  
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', function() {
      // Skip if already active
      if (this.classList.contains('active')) return;
      
      // Update active state
      thumbnails.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Get image data
      const imgSrc = this.getAttribute('data-image');
      const caption = this.getAttribute('data-caption');
      
      // Fade out current image
      featuredImage.style.opacity = '0';
      
      // Change image and fade in
      setTimeout(() => {
        featuredImage.src = imgSrc;
        imageCaption.textContent = caption;
        featuredImage.style.opacity = '1';
      }, 300);
    });
  });
}

// Run initialization in case the DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(() => {
    initDataEngineerTabs();
    initDataEngineerGallery();
  }, 100);
} 