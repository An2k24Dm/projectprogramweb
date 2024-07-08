document.addEventListener('DOMContentLoaded', () => {
    // Función asincrónica para obtener y mostrar las películas
    async function fetchMovies() {
        try {
            // Obtener la lista de cines
            const theatresResponse = await fetch('https://cinexunidos-production.up.railway.app/theatres');
            if (!theatresResponse.ok) throw new Error('Error al obtener los cines');
            const theatres = await theatresResponse.json();
            console.log('Cines:', theatres);

            // Obtener todas las películas proyectadas en todos los cines
            const movies = theatres.flatMap(theatre =>
                theatre.auditoriums.flatMap(auditorium =>
                    auditorium.showtimes.map(showtime => showtime.movie)
                )
            );

            // Eliminar películas duplicadas utilizando un Map
            const uniqueMovies = [...new Map(movies.map(movie => [movie.id, movie])).values()];

            // Iterar sobre cada película única y mostrarla en la página
            uniqueMovies.forEach(movie => {
                const movieElement = createMovieElement(movie);
                document.querySelector('.peliculas').appendChild(movieElement);
            });
        } catch (error) {
            console.error('Error al obtener la información:', error);
        }
    }

    // Función para crear un elemento HTML que representa una película
    function createMovieElement(movie) {
        // Crear un contenedor <figure> para la película
        const movieContainer = document.createElement('figure');
        movieContainer.className = 'pelicula';

        // Crear una imagen <img> con el póster de la película
        const movieImage = document.createElement('img');
        movieImage.src = `https://cinexunidos-production.up.railway.app/${movie.poster}`;
        movieImage.alt = movie.name;

        const descripcion = document.createElement('figcaption');
        descripcion.className = 'descripcion';
        // Crear un título <h3> con el nombre de la película
        const movieTitle = document.createElement('h2');
        movieTitle.textContent = movie.name;
        descripcion.appendChild(movieTitle);
        // Agregar la imagen y el título al contenedor <figure>
        movieContainer.appendChild(movieImage);
        movieContainer.appendChild(descripcion);

        // Agregar un evento de clic para redirigir al usuario a la página de información de la película
        movieContainer.addEventListener('click', () => {
            window.location.href = `infopelicula.html?id=${movie.id}`;
        });

        return movieContainer;
    }

    // Llamar a la función fetchMovies() para iniciar la obtención y visualización de películas
    fetchMovies();
});