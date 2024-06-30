document.addEventListener('DOMContentLoaded', function () {
    const carruselItems = document.querySelectorAll('.carrusel-item');
    const puntosContainer = document.querySelector('.carrusel-puntos');
    let currentIndex = 0;

    // Crear puntos según la cantidad de elementos en el carrusel
    carruselItems.forEach((item, index) => {
        const punto = document.createElement('span');
        punto.classList.add('punto');
        if (index === 0) punto.classList.add('active');
        puntosContainer.appendChild(punto);
    });

    const puntos = document.querySelectorAll('.punto');

    function updateCarrusel(index) {
        carruselItems.forEach((item, i) => {
            const totalWidth = item.clientWidth + 20; // Ancho de la imagen más el margen
            item.style.transform = `translateX(${-totalWidth * index}px)`;
        });
        puntos.forEach((punto, i) => {
            punto.classList.toggle('active', i === index);
        });
    }

    puntos.forEach((punto, i) => {
        punto.addEventListener('click', () => {
            currentIndex = i;
            updateCarrusel(currentIndex);
        });
    });

    function autoPlay() {
        currentIndex = (currentIndex + 1) % carruselItems.length;
        updateCarrusel(currentIndex);
    }

    setInterval(autoPlay, 5000); // Cambia la imagen cada 5 segundos

    updateCarrusel(currentIndex);
});