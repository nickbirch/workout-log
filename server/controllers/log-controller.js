const router = require("express").Router();
const validateSession = require("../middleware/validate-session");
const Log = require("../db").import("../models/log");

/*******************
 *** Create Entry ****
 ********************/
router.post("/", validateSession, (req, res) => {
    const logEntry = {
      description: req.body.description,
      definition: req.body.definition,
      result: req.body.result,
      owner_id: req.user.id,
    };
    Log.create(logEntry)
      .then((logResult) => res.status(200).json(logResult))
      .catch((err) => res.status(500).json({ error: err }));
  });

  /**************************
 *** Get all logs for current user ****
 ***************************/
router.get("/", validateSession, (req, res) => {
    let userId = req.user.id;
    Log.findAll({ where: { owner_id: userId } })
      .then((log) => res.status(200).json(log))
      .catch((err) => res.status(500).json({ error: err }));
  });

  /**************************
 *** Get logs by specific user ****
 ***************************/
router.get("/:id", validateSession, (req, res) => {
    Log.findAll({ where: { owner_id: req.params.id } })
      .then((log) => res.status(200).json(log))
      .catch((err) => res.status(500).json({ error: err }));
  });

  /**************************
 *** Update log ****
 ***************************/
router.put("/:id", validateSession, (req, res) => {
    const query = { where: { id: req.params.id, owner_id: req.user.id } };
  
    Log.update(req.body, query)
      .then(() => res.status(200).send("Log was updated successfully"))
      .catch((err) => res.status(500).json({ error: err }));
  });

  /**************************
 *** Delete entry ****
 ***************************/
router.delete("/:id", validateSession, (req, res) => {
    const query = { where: { id: req.params.id, owner_id: req.user.id } };
  
    Log.destroy(query)
      .then(() => res.status(200).send("Log Entry Was Removed"))
      .catch((err) => res.status(500).json({ error: err }));
  });







module.exports = router;