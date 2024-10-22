const express = require('express');
const coachController = require('../controllers/coach.controller');
const { isCoach } = require('../middleware/auth.middleware');
const router = express.Router();


// Coach signup route
router.post('/register', coachController.signup);

// Coach login route
router.post('/login', coachController.login);

// Update coach details route
router.put('/update/:id', coachController.updateCoachDetails);


router.get('/dashboard', isCoach, coachController.getDashbaord);



module.exports = router;
