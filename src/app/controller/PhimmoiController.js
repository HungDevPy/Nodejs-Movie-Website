
class PhimmoiController {
    static index(req, res) {
        Promise.all([PhimmoiController.phimmoi()])
            .then(([movies]) => {
                // console.log("Movies:", movies); // Log movies data
                // console.log("Odd Movies:", odd_Movies); // Log odd movies data
                res.render("movie/listmovie", { movies});
            })
            .catch((error) => {
                console.error("Error fetching movies:", error);
                res.render("movie/listmovie", { movies: []});
            });
    }
    static phimmoi() {
        const page = 1;
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
