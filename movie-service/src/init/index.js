const movieController = require('../controllers/movie');
const openMovieService = require('../services/openMovie');

createData();

function randomHall() {
    return Math.floor(Math.random() * 5) + 1; // Halls 1-5
}

function randomHour() {
    return Math.floor(Math.random() * 12) + 9; // Hours 9-20
}

async function createData(){
    try {
        const movies = await openMovieService.getAll();
        const moviePromises = [];

        for(const movie of movies){
            console.log('Initializing movie:', movie.Title);
            
            // Check if movie already exists
            try {
                moviePromises.push(
                    movieController.create({
                        imdbID: movie.imdbID,
                        title: movie.Title,
                        hall: randomHall(),
                        date: `2024-06-13 ${randomHour()}:00`
                    }).catch(err => {
                        if (err.name === 'SequelizeUniqueConstraintError') {
                            console.log(`Movie already exists: ${movie.Title}`);
                        } else {
                            console.error(`Error creating movie ${movie.Title}:`, err);
                        }
                    })
                );
            } catch (err) {
                console.error(`Failed to process movie ${movie.Title}:`, err);
            }
        }

        await Promise.all(moviePromises);
        console.log('> Database initialization complete');
    } catch (e) {
        console.error('Error during database initialization:', e);
    }
}