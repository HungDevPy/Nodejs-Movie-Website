class PhimleController {
    static index(req, res) {
        // Fetch movies from both pages in parallel
        Promise.all([PhimleController.phimle(1), PhimleController.phimle(2)])
            .then(([moviesPage1, moviesPage2]) => {
                // Combine items from both pages
                const allMovies = [...moviesPage1, ...moviesPage2];
                
                console.log("Phim le: ", allMovies);

                res.render("movie/listmovie", { movies: allMovies.slice(0, 18), });
            })
            .catch((error) => {
                console.error("Error fetching movies:", error);
                res.render("movie/listmovie", { movies: [] });
            });
    }

    static phimle(page) {
        const apiUrl = `https://phim.nguonc.com/api/films/the-loai/phim-le?page=${page}`;

        return fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                // Log data for debugging purposes
                console.log(`Response from page ${page}:`, data);

                if (data.status === "success") {
                    return data.items; // Return movie items
                } else {
                    console.error("Lỗi khi lấy dữ liệu:", data.message);
                    return []; // Return empty array on error
                }
            })
            .catch((error) => {
                console.error("Lỗi mạng:", error);
                return []; // Return empty array on network error
            });
    }
}

module.exports = PhimleController;
