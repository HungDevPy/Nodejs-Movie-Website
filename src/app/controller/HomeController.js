const PhimleController = require("./PhimleController") ;
const PhimboController = require("./PhimboController") ;
const PhimmoiController = require("./PhimmoiController") ;
class HomeController {
    static index(req, res) {
        Promise.all([PhimmoiController.phimmoi(), PhimleController.phimle(),PhimboController.phimbo()])
            .then(([movies, odd_Movies,seri_Movies]) => {
                // console.log("Movies:", movies); // Log movies data
                // console.log("Odd Movies:", odd_Movies); // Log odd movies data
                res.render("home", { movies, odd_Movies,seri_Movies });
            })
            .catch((error) => {
                console.error("Error fetching movies:", error);
                res.render("home", { movies: [], odd_Movies: [],seri_Movies: [] });
            });
    }
    static slug(req, res) {
        const slug = req.params.slug;
        const apiUrl = `https://phim.nguonc.com/api/film/${slug}`;
        fetch(apiUrl)
            .then((response) => {
                // Kiểm tra nếu phản hồi không phải là 200 OK
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // Kiểm tra Content-Type
                const contentType = response.headers.get('Content-Type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error(`Expected JSON, but got: ${contentType}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.status === "success") { 
                    // Log the movie data
                    res.render("movie/details", { 
                        movieId: data.movie.id,
                        movie: data.movie,
                        movieNation: data.movie.category,
                        moviePractice: data.movie.episodes[0].items,
                        movieEmbed: data.movie.episodes[0].items[0].embed
                    }); 
                } else {
                    res.render("movie/details", { movie: null });
                }
            })
            .catch((error) => {
                console.error("Lỗi mạng:", error.message);
                res.render("movie/details", { movie: null });
            });
    }
    static search(req, res) {
        const key = req.query.keyword.replace(/ /g, "+");
        const apiUrl = `https://phim.nguonc.com/api/films/search?keyword=${key}`;
        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const contentType = response.headers.get('Content-Type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error(`Expected JSON, but got: ${contentType}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.status === "success") { 
                    // Log the movie data
                    console.log(data.items.length);
                    if(data.items.length == 0){
                        res.render("movie/listmovie", { alert: "Không tìm thấy kết quả nào" });
                    }
                    res.render("movie/listmovie", { 
                        movies: data.items
                    }); 
                } else {
                    res.render("movie/listmovie", { movies: null });
                }
            })
            .catch((error) => {
                console.error("Lỗi mạng:", error.message);
                res.render("movie/listmoive", { movies: null });
            });
    }
}

module.exports = HomeController; // Ensure this export is correct