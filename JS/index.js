// JS/index.js

document.addEventListener('DOMContentLoaded', () => {
    fetchTheatres();
});

function fetchTheatres() {
    fetch('https://cinexunidos-production.up.railway.app/theatres')
        .then(response => response.json())
        .then(data => {
            populateTheatres(data);
        })
        .catch(error => {
            console.error('Error fetching theatres:', error);
        });
}

function populateTheatres(theatres) {
    const theatresContainer = document.getElementById('cines-container');
    theatresContainer.innerHTML = ''; // Clear previous content

    theatres.forEach(theatre => {
        const cineElement = document.createElement('figure');
        cineElement.classList.add('cine');
        cineElement.innerHTML = `
            <img src="recursos/cines/${theatre.name}.jpg" alt="${theatre.name}">
            <figcaption class="descripcion">
                <h3>${theatre.name}</h3>
            </figcaption>
        `;
        cineElement.addEventListener('click', () => {
            window.location.href = `seleccion_sala.html?cine=${theatre.id}`;
        });
        theatresContainer.appendChild(cineElement);
    });
}
