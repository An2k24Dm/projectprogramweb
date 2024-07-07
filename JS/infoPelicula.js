// Función para obtener los detalles de la película desde la API
async function fetchMovieDetails(movieId) {
    try {
        const theatresResponse = await fetch('https://cinexunidos-production.up.railway.app/theatres');
        if (!theatresResponse.ok) throw new Error('Error al obtener los cines');
        const theatres = await theatresResponse.json();

        let movieDetails = {
            movie: null,
            theatres: [],
        };

        theatres.forEach(theatre => {
            let currentTheatre = {
                theatreId: theatre.id,
                theatreName: theatre.name,
                auditoriums: []
            };

            theatre.auditoriums.forEach(auditorium => {
                let currentAuditorium = {
                    auditoriumId: auditorium.id,
                    auditoriumName: auditorium.name,
                    showtimes: []
                };

                auditorium.showtimes.forEach(showtime => {
                    if (showtime.movie.id === parseInt(movieId)) {
                        if (!movieDetails.movie) {
                            movieDetails.movie = showtime.movie;
                        }
                        currentAuditorium.showtimes.push({
                            id: showtime.id,
                            startTime: showtime.startTime,
                            capacity: auditorium.capacity
                        });
                    }
                });

                if (currentAuditorium.showtimes.length > 0) {
                    currentTheatre.auditoriums.push(currentAuditorium);
                }
            });

            if (currentTheatre.auditoriums.length > 0) {
                movieDetails.theatres.push(currentTheatre);
            }
        });

        return movieDetails;
    } catch (error) {
        console.error('Error al obtener la información:', error);
        return null;
    }
}

// Función para mostrar los detalles de la película en la página
function displayMovieDetails(movieDetails) {
    document.getElementById('movie-poster').src = `https://cinexunidos-production.up.railway.app/${movieDetails.movie.poster}`;
    document.getElementById('movie-title').textContent = movieDetails.movie.name;

    const theatresList = document.getElementById('theatres-list');
    theatresList.innerHTML = ''; // Limpiar cualquier contenido anterior

    movieDetails.theatres.forEach(theatre => {
        const theatreSection = document.createElement('div');
        theatreSection.className = 'theatre-section';

        const theatreNameHeader = document.createElement('h3');
        theatreNameHeader.textContent = theatre.theatreName;
        theatreSection.appendChild(theatreNameHeader);

        theatre.auditoriums.forEach(auditorium => {
            const auditoriumInfo = document.createElement('div');
            auditoriumInfo.className = 'auditorium-info';
            auditoriumInfo.textContent = `${auditorium.auditoriumName}, Capacidad: ${auditorium.showtimes[0].capacity}`;
            theatreSection.appendChild(auditoriumInfo);

            const showtimesList = document.createElement('ul');
            showtimesList.className = 'showtimes-list';
            auditorium.showtimes.forEach(showtime => {
                const showtimeItem = document.createElement('li');
                showtimeItem.textContent = `Hora: ${showtime.startTime}`;
                showtimeItem.addEventListener('click', () => {
                    redirectToSeatsPage(theatre.theatreId, auditorium.auditoriumId, showtime.id);
                });
                showtimeItem.style.cursor = 'pointer'; // Cambiar cursor a mano
                showtimesList.appendChild(showtimeItem);
            });
            theatreSection.appendChild(showtimesList);
        });

        theatresList.appendChild(theatreSection);
    });
}

// Función para redirigir a la página de selección de asientos
function redirectToSeatsPage(theatreId, auditoriumId, showtimeId) {
    // Construir la URL con los parámetros necesarios
    const seatsUrl = `asientos.html?theatreId=${encodeURIComponent(theatreId)}&auditoriumId=${encodeURIComponent(auditoriumId)}&showtimeId=${encodeURIComponent(showtimeId)}`;
    console.log('Redirigiendo a:', seatsUrl); // Añadir consola para depuración
    // Redirigir al usuario a la página de asientos
    window.location.href = seatsUrl;
}

// Función para obtener el ID de la película desde la URL
function getMovieIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Función de inicialización
async function init() {
    const movieId = getMovieIdFromUrl();
    if (movieId) {
        const movieDetails = await fetchMovieDetails(movieId);
        if (movieDetails) {
            displayMovieDetails(movieDetails);
        } else {
            console.error('No se pudieron obtener los detalles de la película');
        }
    } else {
        console.error('No se proporcionó un ID de película');
    }
}

// Evento que se ejecuta cuando el DOM se carga completamente
document.addEventListener('DOMContentLoaded', init);
