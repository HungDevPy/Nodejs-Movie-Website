
class PhimboController {
    static index(req, res) {
        Promise.all([PhimboController.phimbo(1),PhimboController.phimbo(2)])
        .then(([moviesPage1, moviesPage2]) => {
            // Combine items from both pages
            const allMovies = [...moviesPage1, ...moviesPage2];
            

            res.render("movie/listmovie", { movies: allMovies.slice(0, 18), });
        })
        .catch((error) => {
            console.error("Error fetching movies:", error);
            res.render("movie/listmovie", { movies: [] });
        });
    }
    static phimbo(page) {
        const apiUrl = `https://phim.nguonc.com/api/films/the-loai/phim-bo`;
    
        return fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => { 
                if (data.status === "success") {
                    return data.items; // Return the odd movies
                } else {
                    console.error("Lỗi khi lấy dữ liệu:", data.message);
                    return []; // Return an empty array on error
                }
            })
            .catch((error) => {
                console.error("Lỗi mạng:", error);
                return []; // Return an empty array on network error
            });
    }
}

module.exports = PhimboController;
