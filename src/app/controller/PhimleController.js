
class PhimleController {
    static index(req, res) {
        Promise.all([PhimleController.phimle()])
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
    static phimle() {
        const apiUrl = `https://phim.nguonc.com/api/films/the-loai/phim-le?page=${page}`;
        return fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {// Log the response data
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

module.exports = PhimleController;
