const express = require('express');
const router = express.Router();

const homeController = require('../app/controller/HomeController'); // Ensure this path is correct// Ensure this path is correct

// Define routes
router.get('/', homeController.index);
router.get('/phim/:slug', homeController.slug);
router.get('/search', homeController.search);
// router.get('/', homeController.slug);
module.exports = router;