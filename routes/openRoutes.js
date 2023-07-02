const express = require("express");
const PageInteraction = require("../controllers/pageInteractionController");
const router = express.Router();

//Any open or public routes here
router.post("/api/v1/page-interaction", (req, res) => {
  PageInteraction.createPageInteraction(req, res);
});

module.exports = router;
