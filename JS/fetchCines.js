document.addEventListener('DOMContentLoaded', () => {
    fetchTheatres();
});

function fetchTheatres() {
    console.log('Fetching all theatres...');
    fetch('https://cinexunidos-production.up.railway.app/theatres')
        .then(response => response.json())
        .then(theatres => {
            console.log('Theatres:', theatres);
            populateTheatres(theatres);
        })
        .catch(error => {
            console.error('Error fetching theatres:', error);
        });
}

function populateTheatres(theatres) {
    const theatresContainer = document.getElementById('theatres-container');
    theatresContainer.innerHTML = '';

    if (theatres.length === 0) {
        theatresContainer.innerHTML = '<p>No theatres found.</p>';
        return;
    }

    theatres.forEach(theatre => {
        const theatreElement = document.createElement('div');
        theatreElement.classList.add('cine');
        theatreElement.innerHTML = `
            <img src="recursos/cines/${theatre.id}.jpg" alt="${theatre.name}">
            <div class="descripcion">
                <h3>${theatre.name}</h3>
                <p>${theatre.location}</p>
            </div>
        `;
        theatreElement.addEventListener('click', () => {
            window.location.href = `infoCine.html?theatre=${theatre.id}`;
        });
        theatresContainer.appendChild(theatreElement);
    });
}
