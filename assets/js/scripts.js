// ================= SLIDER FUNCTIONALITY =================
let slideIndex = 0;
const slides = document.querySelectorAll('.img-slider');
const dots = document.querySelectorAll('.dot');
let slideInterval;

// Función para mostrar slide específico
function showSlide(n) {
    // Ocultar todos los slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Ajustar índice si es necesario
    if (n >= slides.length) slideIndex = 0;
    if (n < 0) slideIndex = slides.length - 1;
    
    // Mostrar slide actual
    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
}

// Función para cambiar slide (botones laterales)
function changeSlide(n) {
    slideIndex += n;
    showSlide(slideIndex);
    resetInterval();
}

// Función para ir a slide específico (dots)
function currentSlide(n) {
    slideIndex = n - 1;
    showSlide(slideIndex);
    resetInterval();
}

// Función para avanzar automáticamente
function nextSlide() {
    slideIndex++;
    showSlide(slideIndex);
}

// Función para reiniciar el intervalo
function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 3000); // 3 segundos
}

// Inicializar slider
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar primera imagen
    showSlide(slideIndex);
    
    // Iniciar slider automático
    slideInterval = setInterval(nextSlide, 5000);
    
    // Pausar en hover del slider
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        // Reanudar al salir del hover
        sliderContainer.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }

    // ================= SLIDERS HORIZONTALES MÚLTIPLES =================
  document.querySelectorAll('.slider-horizontal').forEach(slider => {
    const slides = Array.from(slider.querySelectorAll('.slides img'));
    const dotsContainer = slider.querySelector('.dots-container');
    let currentIndex = 0;
    let interval;

    // Crear dots dinámicamente
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        showSlideMultiple(i);
        resetIntervalMultiple();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    function showSlideMultiple(n) {
      currentIndex = n;
      if (currentIndex >= slides.length) currentIndex = 0;
      if (currentIndex < 0) currentIndex = slides.length - 1;

      slider.querySelector('.slides').style.transform = `translateX(-${currentIndex * 100}%)`;

      dots.forEach(d => d.classList.remove('active'));
      dots[currentIndex].classList.add('active');
    }

    function nextSlideMultiple() {
      showSlideMultiple(currentIndex + 1);
    }

    function resetIntervalMultiple() {
      clearInterval(interval);
      interval = setInterval(nextSlideMultiple, 4000);
    }

    showSlideMultiple(0);
    interval = setInterval(nextSlideMultiple, 4000);

    slider.addEventListener('mouseenter', () => clearInterval(interval));
    slider.addEventListener('mouseleave', resetIntervalMultiple);
  });

    // ================= 6-ITEMS BLOCK CAROUSEL =================
    const viewport = document.querySelector('.carousel-viewport');
    const track = document.querySelector('.carousel-imgs');
    let items = track ? Array.from(track.querySelectorAll('img')) : [];
    const blockSize = 6; // cantidad visible por bloque
    let blockIndex = 0;
    let blockTimer;
    let baseBlocks = 0; // bloques del set base (después de completar múltiplo de 6)

    function updateBlockPosition() {
        if (!track || items.length === 0) return;
        const itemWidth = 315; // fijo por CSS
        const gap = 0; // sin gap
        const translateX = -((itemWidth + gap) * blockIndex * blockSize);
        track.style.transform = `translateX(${translateX}px)`;
    }

    function nextBlock() {
        if (!track) return;
        const total = items.length;
        const totalBlocks = Math.ceil(total / blockSize);
        blockIndex = (blockIndex + 1) % totalBlocks;
        updateBlockPosition();
    }

    function startBlockTimer() {
        clearInterval(blockTimer);
        blockTimer = setInterval(nextBlock, 5000);
    }

    if (viewport && track && items.length > 0) {
        // 1) Completar a múltiplos de 6
        const remainder = items.length % blockSize;
        if (remainder !== 0) {
            const toClone = blockSize - remainder;
            const clones = items.slice(0, toClone).map(node => node.cloneNode(true));
            clones.forEach(clone => track.appendChild(clone));
            items = Array.from(track.querySelectorAll('img'));
        }

        // 2) Guardar tamaño base y duplicar todo el set base para bucle infinito suave
        const baseCount = items.length; // ya es múltiplo de 6
        baseBlocks = Math.ceil(baseCount / blockSize);
        const baseClones = Array.from(track.children).slice(0, baseCount).map(n => n.cloneNode(true));
        baseClones.forEach(c => track.appendChild(c));
        items = Array.from(track.querySelectorAll('img'));

        // 3) Ajuste inicial y temporizador
        updateBlockPosition();
        startBlockTimer();

        // 4) Pausa en hover del carrusel de logos
        viewport.addEventListener('mouseenter', () => clearInterval(blockTimer));
        viewport.addEventListener('mouseleave', startBlockTimer);

        // 5) Recalcular en resize para asegurar precisión del translate
        let resizeTO;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTO);
            resizeTO = setTimeout(updateBlockPosition, 150);
        });

        // 6) Al completar un ciclo (llegar al primer bloque del set clonado), saltar sin transición
        track.addEventListener('transitionend', () => {
            if (blockIndex === baseBlocks) {
                // quitar transición, saltar a inicio, reactivar transición
                const prev = track.style.transition;
                track.style.transition = 'none';
                blockIndex = 0;
                updateBlockPosition();
                // forzar reflujo
                void track.offsetHeight;
                // restaurar transición definida en CSS
                track.style.transition = prev || '';
            }
        });
    }
});