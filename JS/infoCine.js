document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const theatreId = urlParams.get('theatre');
    if (theatreId) {
        fetchTheatreDetails(theatreId);
    }
});

async function fetchTheatreDetails(theatreId) {
    try {
        const theatreResponse = await fetch(`https://cinexunidos-production.up.railway.app/theatres/${theatreId}`);
        if (!theatreResponse.ok) throw new Error('Error al obtener detalles del cine');
        const theatre = await theatreResponse.json();
        populateTheatreDetails(theatre);
        fetchAuditoriums(theatreId);
    } catch (error) {
        console.error('Error al obtener la información del cine:', error);
    }
}

function populateTheatreDetails(theatre) {
    const container = document.getElementById('cine-detalle-container');
    const theatreElement = document.createElement('div');
    theatreElement.classList.add('cine-detalle');
    theatreElement.innerHTML = `
        <h2>${theatre.name}</h2>
        <p>${theatre.location}</p>
        <img src="recursos/cines/${theatre.id}.jpg" alt="${theatre.name}">
    `;
    container.appendChild(theatreElement);
}

async function fetchAuditoriums(theatreId) {
    try {
        const auditoriumsResponse = await fetch(`https://cinexunidos-production.up.railway.app/theatres/${theatreId}/auditoriums`);
        if (!auditoriumsResponse.ok) throw new Error('Error al obtener las salas del cine');
        const auditoriums = await auditoriumsResponse.json();
        const allShowtimes = await fetchShowtimes(theatreId, auditoriums);
        populateShowtimes(allShowtimes);
    } catch (error) {
        console.error('Error al obtener las salas del cine:', error);
    }
}

async function fetchShowtimes(theatreId, auditoriums) {
    const allShowtimes = [];
    for (const auditorium of auditoriums) {
        try {
            const showtimesResponse = await fetch(`https://cinexunidos-production.up.railway.app/theatres/${theatreId}/auditoriums/${auditorium.id}/showtimes`);
            if (!showtimesResponse.ok) throw new Error('Error al obtener las funciones de una sala');
            const showtimes = await showtimesResponse.json();
            showtimes.forEach(showtime => {
                allShowtimes.push({
                    movie: showtime.movie,
                    startTime: showtime.startTime,
                    auditoriumName: auditorium.name
                });
            });
        } catch (error) {
            console.error('Error al obtener las funciones de una sala:', error);
        }
    }
    return allShowtimes;
}

function populateShowtimes(showtimes) {
    const container = document.getElementById('cine-detalle-container');
    showtimes.forEach(showtime => {
        const showtimeElement = document.createElement('div');
        showtimeElement.classList.add('showtime-detalle');
        showtimeElement.innerHTML = `
            <h3>${showtime.movie ? showtime.movie.title : 'Título no disponible'}</h3>
            <p>Hora: ${showtime.startTime ? new Date(showtime.startTime).toLocaleTimeString() : 'Hora no disponible'}</p>
            <p>Sala: ${showtime.auditoriumName}</p>
        `;
        container.appendChild(showtimeElement);
    });
}
