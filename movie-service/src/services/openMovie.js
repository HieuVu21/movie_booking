const got = require('got');

const API_KEY = 'aa01a285';

module.exports = {
    async getAll() {
        const { body } = await got(`http://www.omdbapi.com/?apikey=${API_KEY}&s=star`);
        const data = JSON.parse(body);
        return data.Search || [];
    },
    async getMovieDetails(imdbID) {
        const { body } = await got(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`);
        const data = JSON.parse(body);
        return data;
    }
};



