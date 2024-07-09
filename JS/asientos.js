let selectedSeats = [];

// Función para obtener los detalles de la función desde la API
async function fetchShowtimeDetails(theatreId, auditoriumId, showtimeId) {
    try {
        const response = await fetch(`https://cinexunidos-production.up.railway.app/theatres/${theatreId}/auditoriums/${auditoriumId}/showtimes/${showtimeId}`);
        if (!response.ok) throw new Error('Error al obtener los detalles de la función');
        const showtimeDetails = await response.json();
        return showtimeDetails;
    } catch (error) {
        console.error('Error al obtener la información:', error);
        return null;
    }
}

// Función para mostrar los detalles de la película en la página
function displayMovieDetails(movieDetails) {
    const movieDetailsSection = document.getElementById('movie-details');
    movieDetailsSection.innerHTML = `
        <h2>${movieDetails.movie.name}</h2>
        <img src="https://cinexunidos-production.up.railway.app/${movieDetails.movie.poster}" alt="${movieDetails.movie.name}" class="movie-poster">
        <p><strong>Duración:</strong> ${movieDetails.movie.runningTime}</p>
        <p><strong>Clasificación:</strong> ${movieDetails.movie.rating}</p>
    `;
}

// Función para mostrar el mapa de asientos en la página
function displaySeatMap(seats) {
    const seatMapSection = document.getElementById('seat-map');
    seatMapSection.innerHTML = '';

    const seatMap = document.createElement('div');
    seatMap.className = 'seat-map';

    const seatLabelsContainer = document.createElement('div');
    seatLabelsContainer.className = 'seat-row seat-labels';

    // Obtener la cantidad máxima de columnas
    const firstRow = Object.keys(seats)[0];
    const numColumns = seats[firstRow].length;

    // Agregar etiquetas de columna
    const columnHeader = document.createElement('span');
    columnHeader.className = 'seat-label';
    columnHeader.textContent = ' ';
    seatLabelsContainer.appendChild(columnHeader);

    for (let i = 0; i < numColumns; i++) {
        const seatLabel = document.createElement('span');
        seatLabel.className = 'seat-label';
        seatLabel.textContent = i;
        seatLabelsContainer.appendChild(seatLabel);
    }

    seatMap.appendChild(seatLabelsContainer);

    // Agregar filas y asientos
    Object.keys(seats).forEach(rowKey => {
        const rowContainer = document.createElement('div');
        rowContainer.className = 'seat-row';

        const rowLabel = document.createElement('span');
        rowLabel.className = 'seat-label';
        rowLabel.textContent = rowKey;
        rowContainer.appendChild(rowLabel);

        seats[rowKey].forEach((seat, index) => {
            const seatElement = document.createElement('div');

            switch (seat) {
                case -1:
                    seatElement.className = 'seat seat-empty';
                    break;
                case 0:
                    seatElement.className = 'seat seat-free';
                    seatElement.addEventListener('click', () => toggleSeatSelection(seatElement, seats, rowKey, index));
                    break;
                case 1:
                    seatElement.className = 'seat seat-preselected';
                    seatElement.addEventListener('click', () => alert('Ya otro usuario tiene seleccionado este asiento'));
                    break;
                case 2:
                    seatElement.className = 'seat seat-occupied';
                    break;
                default:
                    seatElement.className = 'seat';
                    break;
            }

            rowContainer.appendChild(seatElement);
        });

        seatMap.appendChild(rowContainer);
    });

    seatMapSection.appendChild(seatMap);
}

// Función para reservar un asiento
async function reserveSeat(theatreId, auditoriumId, showtimeId, seat) {
    try {
        const response = await fetch(`https://cinexunidos-production.up.railway.app/theatres/${theatreId}/auditoriums/${auditoriumId}/showtimes/${showtimeId}/reserve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ seat })
        });
        if (!response.ok) throw new Error('Error al reservar el asiento');
        return true;
    } catch (error) {
        console.error('Error al reservar el asiento:', error);
        return false;
    }
}

// Función para cancelar la reserva de un asiento
async function cancelReservation(theatreId, auditoriumId, showtimeId, seat) {
    try {
        const response = await fetch(`https://cinexunidos-production.up.railway.app/theatres/${theatreId}/auditoriums/${auditoriumId}/showtimes/${showtimeId}/reserve`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ seat })
        });
        if (!response.ok) throw new Error('Error al cancelar la reservación del asiento');
        return true;
    } catch (error) {
        console.error('Error al cancelar la reservación del asiento:', error);
        return false;
    }
}

// Función para alternar la selección de un asiento
async function toggleSeatSelection(seatElement, seats, rowKey, seatIndex) {
    const seat = `${rowKey}${seatIndex}`;

    if (seatElement.classList.contains('seat-free')) {
        seatElement.classList.remove('seat-free');
        seatElement.classList.add('seat-selected');
        selectedSeats.push(seat);
        seats[rowKey][seatIndex] = 1;
    } else if (seatElement.classList.contains('seat-selected')) {
        seatElement.classList.remove('seat-selected');
        seatElement.classList.add('seat-free');
        selectedSeats = selectedSeats.filter(s => s !== seat);
        seats[rowKey][seatIndex] = 0;
    }
}

document.querySelector('.boton.reservar').addEventListener('click', async (event) => {
    event.preventDefault();
    if (selectedSeats.length === 0) {
        alert('Por favor, seleccione al menos un asiento.');
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const theatreId = params.get('theatreId');
    const auditoriumId = params.get('auditoriumId');
    const showtimeId = params.get('showtimeId');

    let allSuccessful = true;
    for (const seat of selectedSeats) {
        const success = await reserveSeat(theatreId, auditoriumId, showtimeId, seat);
        if (!success) {
            allSuccessful = false;
            break;
        }
    }

    if (allSuccessful) {
        alert('Asientos reservados exitosamente.');
        window.location.href = 'index.html';
    } else {
        alert('Hubo un problema al reservar uno o más asientos.');
    }
});

// Función de inicialización
async function init() {
    const params = new URLSearchParams(window.location.search);
    const theatreId = params.get('theatreId');
    const auditoriumId = params.get('auditoriumId');
    const showtimeId = params.get('showtimeId');

    if (!theatreId || !auditoriumId || !showtimeId) {
        console.error('No se proporcionaron todos los parámetros necesarios');
        return;
    }

    const showtimeDetails = await fetchShowtimeDetails(theatreId, auditoriumId, showtimeId);
    if (showtimeDetails) {
        displayMovieDetails(showtimeDetails);
        displaySeatMap(showtimeDetails.seats);
    }
}

// Evento que se ejecuta cuando el DOM se carga completamente
document.addEventListener('DOMContentLoaded', init);
