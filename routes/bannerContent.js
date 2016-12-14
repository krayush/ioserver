var express = require('express');
var bannerController = require('../controllers/bannerContent');
module.exports = (function () {
    var router = express.Router();
    console.log("Reached Banner Content Route");
    router.get("/get-top-banner", bannerController.getTopBannerImageData);
    router.get("/get-three-image-banner", bannerController.getThreeImageData);
    router.get("/get-wide-banner", bannerController.getWideBanner);
    router.get("/get-category-list-banner", bannerController.getCategoryListBanner);
    router.get("/get-detail-banner", bannerController.getDetailBanner);
    router.get("/get-eight-image-banner", bannerController.getEightImageBanner);
    return router;
})();