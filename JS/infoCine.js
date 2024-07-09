document.addEventListener('DOMContentLoaded', () => {
    // Obtener el ID del cine desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const theatreId = urlParams.get('theatre'); // Obtener el parámetro 'theatre' de la URL

    if (theatreId) {
        fetchTheatreDetails(theatreId); // Llamar a fetchTheatreDetails con el ID del cine
    } else {
        console.error('Error: No se proporcionó un ID de cine.');
    }
});

// Función asincrónica para obtener y mostrar los detalles del cine y sus películas
async function fetchTheatreDetails(theatreId) {
    try {
        // Obtener detalles del cine específico
        const theatreResponse = await fetch(`https://cinexunidos-production.up.railway.app/theatres/${theatreId}`);
        if (!theatreResponse.ok) throw new Error('Error al obtener detalles del cine');
        const theatre = await theatreResponse.json();
        console.log('Cine:', theatre);

        // Mostrar detalles del cine en la página
        populateTheatreDetails(theatre);

        // Iterar sobre cada sala y sus funciones para obtener todas las películas
        theatre.auditoriums.forEach(auditorium => {
            auditorium.showtimes.forEach(showtime => {
                const movieElement = createMovieElement(showtime.movie, showtime.startTime, auditorium, theatreId, auditorium.id, showtime.id);
                document.querySelector('.peliculas').appendChild(movieElement);
            });
        });
    } catch (error) {
        console.error('Error al obtener la información del cine:', error);
    }
}

// Función para poblar los detalles del cine en la página
function populateTheatreDetails(theatre) {
    const container = document.querySelector('#cine-detalle');
    const theatreDetails = document.createElement('div');
    theatreDetails.className = 'theatre-details';

    const theatreName = document.createElement('h1');
    theatreName.textContent = theatre.name;

    const theatreLocation = document.createElement('p');
    theatreLocation.textContent = theatre.location;

    theatreDetails.appendChild(theatreName);
    theatreDetails.appendChild(theatreLocation);
    container.appendChild(theatreDetails);
}

// Función para crear un elemento HTML que representa una película
function createMovieElement(movie, startTime, auditorium, theatreId, auditoriumId, showtimeId) {
    const movieContainer = document.createElement('figure');
    movieContainer.className = 'pelicula';

    const movieImage = document.createElement('img');
    movieImage.src = `https://cinexunidos-production.up.railway.app/${movie.poster}`;
    movieImage.alt = movie.name;

    const movieTitle = document.createElement('h3');
    movieTitle.textContent = movie.name;

    const movieStartTime = document.createElement('p');
    movieStartTime.textContent = `Hora de inicio: ${startTime}`;

    const movieDuration = document.createElement('p');
    movieDuration.textContent = `Duración: ${movie.runningTime}`;

    const movieRating = document.createElement('p');
    movieRating.textContent = `Clasificación: ${movie.rating}`;

    const movieAuditorium = document.createElement('p');
    movieAuditorium.textContent = `Sala: ${auditorium.name}`;

    const movieCapacity = document.createElement('p');
    movieCapacity.textContent = `Capacidad de la sala: ${auditorium.capacity}`;

    movieContainer.appendChild(movieImage);
    movieContainer.appendChild(movieTitle);
    movieContainer.appendChild(movieStartTime);
    movieContainer.appendChild(movieDuration);
    movieContainer.appendChild(movieRating);
    movieContainer.appendChild(movieAuditorium);
    movieContainer.appendChild(movieCapacity);

    // Evento click para redirigir a la página de asientos
    movieContainer.addEventListener('click', () => {
        redirectToSeatsPage(theatreId, auditoriumId, showtimeId);
    });

    return movieContainer;
}

// Función para redirigir a la página de asientos
function redirectToSeatsPage(theatreId, auditoriumId, showtimeId) {
    // Construir la URL con los parámetros necesarios
    const seatsUrl = `asientos.html?theatreId=${encodeURIComponent(theatreId)}&auditoriumId=${encodeURIComponent(auditoriumId)}&showtimeId=${encodeURIComponent(showtimeId)}`;
    console.log('Redirigiendo a:', seatsUrl); // Añadir consola para depuración
    // Redirigir al usuario a la página de asientos
    window.location.href = seatsUrl;
}