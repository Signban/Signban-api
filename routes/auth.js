const router = require("express").Router();

router.get("/login", (req, res) => {
	res.status(200).json("login");
});

module.exports = router;
