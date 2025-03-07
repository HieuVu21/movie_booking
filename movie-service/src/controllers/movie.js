// const Op = require('sequelize').Op;
// const {Movie, Seats} = require('../models');
// const openMovieService = require('../services/openMovie');
// const movieTrailerService = require('movie-trailer');

// const alphabet = 'abcdefghijklmnopqrstuvwxyz';

// const SEATS_ROWS = 6;
// const SEATS_COMUNS = 6;


// module.exports = {
//     async create(data){
//         const movie = await Movie.create(data);

//         const seats = [];

//         for(let x = 0; x < SEATS_ROWS; x++){
//             const row = alphabet[x].toUpperCase();
//             for(let y = 0; y < SEATS_COMUNS; y++){
//                 const seat = Seats.create({
//                     row,
//                     column: (y + 1),
//                     movieId: movie.id
//                 });
//                 seats.push(seat);
//             }
//         }

//         await Promise.all(seats);
//         return movie;
//     },

//     async getAll(){
//         const results = [];
//         const movies = await openMovieService.getAll();


//         for(const movie of movies){
//             const movieEntity = await Movie.findOne({
//                 where: {
//                     imdbID: {[Op.eq]: movie.imdbID}
//                 }
//             });
//             results.push({
//                 ...movie,
//                 ...(movieEntity.toJSON())
//             })
//         }

//         return results;
//     },


//     async getById(id){
//         const movie = await Movie.findOne({
//             where: {
//                 id: {[Op.eq]: id}
//             },
//             include: {
//                 attributes: ['id', 'row', 'column', 'isAvailable'],
//                 model: Seats
//             },
//             order: [
//                 [{model: Seats}, 'row'],
//                 [{model: Seats}, 'column']
//             ]
//         });

//         if(movie === null){
//             return {};
//         }

//         const movieDetails = await openMovieService.getMovieDetails(movie.imdbID);

//         return {
//             ...movieDetails,
//             ...(movie.toJSON())
//         }
//     },

//     async getTrailer({title, year}){
//         const trailer = await movieTrailerService(title, year);
//         return {
//             trailerUrl: trailer
//         }
//     }
// };
const Op = require('sequelize').Op;
const {Movie, Seats} = require('../models');
const fakeData = require('./data.json');
const movieTrailerService = require('movie-trailer');

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

const SEATS_ROWS = 6;
const SEATS_COMUNS = 6;

module.exports = {
    async create(data){
        const movie = await Movie.create(data);

        const seats = [];

        for(let x = 0; x < SEATS_ROWS; x++){
            const row = alphabet[x].toUpperCase();
            for(let y = 0; y < SEATS_COMUNS; y++){
                const seat = Seats.create({
                    row,
                    column: (y + 1),
                    movieId: movie.id
                });
                seats.push(seat);
            }
        }

        await Promise.all(seats);
        return movie;
    },

    async getAll(){
        try {
            const movies = fakeData.Search;
            const results = [];

            for(const movie of movies){
                // First try to find existing movie
                let movieEntity = await Movie.findOne({
                    where: {
                        imdbID: {[Op.eq]: movie.imdbID}
                    }
                });

                // If movie doesn't exist in database, create it
                if (!movieEntity) {
                    movieEntity = await this.create({
                        imdbID: movie.imdbID,
                        title: movie.Title,
                        hall: Math.floor(Math.random() * 5) + 1,
                        date: `2024-06-13 ${Math.floor(Math.random() * 12) + 9}:00`
                    });
                }

                // Combine API data with database data
                results.push({
                    ...movie,
                    ...movieEntity.toJSON()
                });
            }

            return results;
        } catch (error) {
            console.error('Error in getAll:', error);
            throw error;
        }
    },

    async getById(id){
        try {
            const movie = await Movie.findOne({
                where: {
                    id: {[Op.eq]: id}
                },
                include: {
                    attributes: ['id', 'row', 'column', 'isAvailable'],
                    model: Seats
                },
                order: [
                    [{model: Seats}, 'row'],
                    [{model: Seats}, 'column']
                ]
            });

            if(!movie){
                return null;
            }

            // Tìm thông tin phim từ data.json
            const movieDetails = fakeData.Search.find(m => m.imdbID === movie.imdbID);

            if (!movieDetails) {
                return movie.toJSON();
            }

            return {
                ...movieDetails,
                ...movie.toJSON()
            };
        } catch (error) {
            console.error('Error in getById:', error);
            throw error;
        }
    },

    async getTrailer({title, year}){
        try {
            const trailer = await movieTrailerService(title, year);
            return {
                trailerUrl: trailer
            };
        } catch (error) {
            console.error('Error getting trailer:', error);
            return {
                trailerUrl: null
            };
        }
    }
};