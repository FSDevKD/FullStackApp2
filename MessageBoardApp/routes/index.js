const express = require("express");
const router = express.Router();
const message = require("../models/message");
const { ensureAuthenticated } = require("../config/auth");

router.get("/", (req, res) => res.render("index"));
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const messages = await message.find().sort({ date: -1 });
    res.render('dashboard', { user: req.user, messages });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

router.post('/messages', ensureAuthenticated, async (req, res) =>{
    const { name, msg } = req.body;
    const newMessage = new message({name, msg});
    try{
        await newMessage.save();
        res.redirect('/dashboard');
    }catch(err){
        console.log("Error deleting:",err);
        res.redirect('/dashboard');
    }
});

router.post('/messages/:messageId/delete', ensureAuthenticated, async (req, res) => {
  try {
    // Find the message by id and remove it from the database
    await message.findByIdAndRemove(req.params.messageId);

    // Redirect to the dashboard after successful deletion
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

router.get('/messages/:messageId/edit', ensureAuthenticated, async (req, res) => {
  try {
    const msgToEdit = await message.findById(req.params.messageId);
    res.render('edit', { message: msgToEdit });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

router.post('/messages/:messageId/edit', ensureAuthenticated, async (req, res) => {
  try {
    const { name, msg } = req.body;
    await message.findByIdAndUpdate(req.params.messageId, { name, msg });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});




module.exports = router;
