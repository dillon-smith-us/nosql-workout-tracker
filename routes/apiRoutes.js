const path = require('path');
const Workout  = require('../models/workout');
const router = require('express').Router();

router.post('/api/workouts', (req, res) => {
    Workout.create({})
    .then((workoutDB) => {
        res.json(workoutDB);
    })
    .catch((err) => {
        res.status(400).json(err)
    })
});

router.get('/api/workouts', (req, res) => {
    Workout.aggregate([
        {
            $addFields: {totalDuration: {$sum:'$exercises.duration'}}
        }

    ])
    .then((workoutDB) => {
        res.json(workoutDB);
    })
    .catch((err) => {
        res.status(400).json(err)
    })
});

router.get('/api/workouts/range', (req, res) => {
    Workout.aggregate([
        {
            $addFields: {totalDuration: {$sum:'$exercises.duration'}}
        }
    ])

    .sort({_id:-1})
    .limit(7)
    .then((workoutDB) => {
        res.json(workoutDB)
    })
    .catch((err) => {
        res.status(400).json(err);
    })
});

router.put('/api/workouts/:id', ({body, params}, res) => {
    Workout.findByIdAndUpdate(
        params.id,
        {  $push: { exercises: body }},
        { new: true }
    )
        .then(workoutDB => {res.json(workoutDB);})
        .catch(err => {res.status(404).json(err); })
});

module.exports = router;