
class PhimmoiController {
    static index(req, res) {
        Promise.all([PhimmoiController.phimmoi(1),PhimmoiController.phimmoi(2)])
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
    static phimmoi(page) {
        const apiUrl = `https://phim.nguonc.com/api/films/phim-moi-cap-nhat?page=${page}`;

        return fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    return data.items; // Return the movies
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

module.exports = PhimmoiController;
