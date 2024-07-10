document.addEventListener('DOMContentLoaded', () => {
    function mostrarTodasLasPeliculas() {
        const peliculas = document.querySelectorAll('.pelicula');
        peliculas.forEach(pelicula => {
            pelicula.style.display = '';
        });
    }

    function buscarPelicula(nombre) {
        const peliculas = document.querySelectorAll('.pelicula');
        peliculas.forEach(pelicula => {
            const titulo = pelicula.querySelector('h2').textContent.toLowerCase();
            if (titulo.includes(nombre.toLowerCase())) {
                pelicula.style.display = '';
            } else {
                pelicula.style.display = 'none';
            }
        });
    }

    document.getElementById('busqueda').addEventListener('input', (event) => {
        const nombre = event.target.value;
        if (nombre) {
            buscarPelicula(nombre);
        } else {
            mostrarTodasLasPeliculas();
        }
    });
});