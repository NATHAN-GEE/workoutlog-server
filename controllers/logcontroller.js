const router = require("express").Router();
const { LogModel } = require("../models");
const Log = require("../models/log");
const { UniqueConstraintError } = require("sequelize/lib/errors");
let validateJWT = require("../middleware/validate");
const User = require("../models/user");

router.post("/create", validateJWT, async (req, res) => {
  let { description, definition, result, owner_id } = req.body.Log;
  try {
    let Log = await LogModel.create({
      description,
      definition,
      result,
      owner_id,
    });
    res.status(201).json({
      id: owner_id,
      post: Log,
    });
  } catch (err) {
    message: `failed ${err}`;
  }
});

router.get("/", validateJWT, async (req, res) => {
  try {
    let findWorkout = await LogModel.findAll();
    res.status(200).json(findWorkout);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/:id", validateJWT, async (req, res) => {
  try {
    const workoutId = await LogModel.findOne({
      where: {
        owner_id: req.params.id,
      },
    });
    res.status(200).json({
      message: `Workout found`,
      workoutId,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.put("/:id", validateJWT, async (req, res) => {
  let { description, definition, result, owner_id } = req.body.Log;
  try {
    let updatedWorkout = await LogModel.update(
      {
        description,
        definition,
        result,
        owner_id,
      },
      { where: { owner_id: req.params.id } }
    );
    res.status(200).json({
      message: `Workout changed`,
      updatedWorkout,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.delete('/:id', validateJWT, async (req, res) => {
    try {
        let deleteWorkout = await LogModel.destroy({
            where: {
                owner_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Workout log successfully deleted`,
            deleteWorkout
        })
    } catch (err) {
        res.status(500),json({error: err})
    }
})

module.exports = router;
