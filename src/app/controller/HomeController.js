const PhimleController = require("./PhimleController");
const PhimboController = require("./PhimboController");
const PhimmoiController = require("./PhimmoiController");
const { console } = require("inspector");
const path = require("path");
const fs = require("fs").promises;
class HomeController {
  static async banner() {
    const filePath = path.join(__dirname, "../../resources/data/banner.json");
    try {
      const data = await fs.readFile(filePath, "utf8");
      const banner = JSON.parse(data).backdrops;
      const bannerRandom = banner[Math.floor(Math.random() * banner.length)];
      return bannerRandom; // Return the backdrops array
    } catch (error) {
      console.error("Error fetching banner:", error);
      return []; // Return an empty array on error
    }
  }
  static index(req, res) {
    Promise.all([
      PhimmoiController.phimmoi(),
      PhimleController.phimle(),
      PhimboController.phimbo(),
      HomeController.banner(),
    ])
      .then(([movies, odd_Movies, seri_Movies,banner_Movies]) => {
        console.log("Baner: ", banner_Movies.logo_url);
        // console.log("Movies:", movies); // Log movies data
        // console.log("Odd Movies:", odd_Movies); // Log odd movies data
        res.render("home", { movies, odd_Movies, seri_Movies,banner_Movies });
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        res.render("home", { movies: [], odd_Movies: [], seri_Movies: [] ,banner_Movies: []});
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
        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
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
            movieEmbed: data.movie.episodes[0].items[0].embed,
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
  static tap(req, res) {
    const slug = req.params.slug;
    const tap = req.params.name;
    const apiUrl = `https://phim.nguonc.com/api/film/${slug}`;
    console.log(apiUrl);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                const movie = data.movie;
                const movieId = movie.id;
                const movieNation = movie.category;
                const episodes = movie.episodes[0].items;

                const currentEpisode = episodes.find(item => item.slug === tap);
                let movieEmbed = null;
                if (currentEpisode) {
                    movieEmbed = currentEpisode.embed;
                }
                console.log(currentEpisode);

                res.render("movie/details", {
                    movieId,
                    movie,
                    movieNation,
                    moviePractice: episodes,
                    movieEmbed
                });
            } else {
                res.render("movie/details", { movie: null });
            }
        })
        .catch(error => {
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
        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(`Expected JSON, but got: ${contentType}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "success") {
          // Log the movie data
          if (data.items.length == 0) {
            res.render("movie/listmovie", {
              alert: "Không tìm thấy kết quả nào",
            });
          }
          res.render("movie/listmovie", {
            movies: data.items,
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
