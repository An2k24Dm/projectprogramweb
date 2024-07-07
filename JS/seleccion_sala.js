// JS/seleccion_sala.js

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cineId = urlParams.get('cine');
    
    if (cineId) {
        fetchAuditoriums(cineId);
    }

    document.getElementById('salaForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const selectedSala = document.getElementById('sala').value;
        if (selectedSala) {
            // Aquí puedes redirigir a la página de funciones o realizar otra acción
            console.log(`Sala seleccionada: ${selectedSala}`);
        }
    });
});

function fetchAuditoriums(cineId) {
    fetch(`https://cinexunidos-production.up.railway.app/theatres/${cineId}/auditoriums`)
        .then(response => response.json())
        .then(data => {
            populateAuditoriums(data);
        })
        .catch(error => {
            console.error('Error fetching auditoriums:', error);
        });
}

function populateAuditoriums(auditoriums) {
    const auditoriumSelect = document.getElementById('sala');
    auditoriumSelect.innerHTML = '<option value="">Selecciona una sala</option>';
    
    auditoriums.forEach(auditorium => {
        const option = document.createElement('option');
        option.value = auditorium.id;
        option.textContent = auditorium.name;
        auditoriumSelect.appendChild(option);
    });
}
