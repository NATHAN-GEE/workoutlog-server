const router = require("express").Router();
const { LogModel } = require("../models");
const { UniqueConstraintError } = require("sequelize/lib/errors");
let validateJWT = require("../middleware/validate");
const User = require("../models/user");

router.post("/create", validateJWT, async (req, res) => {
  let { description, definition, result } = req.body;
  try {
    let Log = await LogModel.create({
      description,
      definition,
      result,
    });
    res.status(201).json({
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
  let { description, definition, result } = req.body;
  try {
    let updatedWorkout = await LogModel.update(
      {
        description,
        definition,
        result,
      },
      { where: { id: req.params.id } }
    );
    res.status(200).json({
      message: `Workout changed`,
      updatedWorkout,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.delete("/:id", validateJWT, async (req, res) => {
  try {
    let deleteWorkout = await LogModel.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      message: `Workout log successfully deleted`,
      deleteWorkout,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
