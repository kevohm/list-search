const express = require('express');
const router = express.Router();
const { getFruits,getOneFruit,postFruits,deleteFruits,updateFruits, searchBy} = require('../controllers/controller')

//... /v1/api/fruits
router.route("/").get(getFruits).post(postFruits);
router.route("/:id").delete(deleteFruits).get(getOneFruit).patch(updateFruits);

module.exports = router;