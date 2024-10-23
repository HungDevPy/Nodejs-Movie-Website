
class PhimboController {
    static index(req, res) {
        Promise.all([PhimboController.phimbo()])
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
    static phimbo() {
        const page = 1;
        const apiUrl = `https://phim.nguonc.com/api/films/the-loai/phim-bo?page=${page}`;
    
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
