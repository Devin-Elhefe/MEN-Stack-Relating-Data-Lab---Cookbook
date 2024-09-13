const express = require('express')
const router = express.Router();

const User = require('../models/user.js');



router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.render('users/index', { users });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

router.get('/', (req, res) => {
    res.render('foods/index.ejs')
})

router.get('/users/:userId/foods/new', function(req, res){
    res.render('foods/new.ejs', {userId: req.params.userId})
})

router.post('users/:userId/foods', async function(req, res) {
    try {
        const user = await User.findById(req.session.user._id);

        user.pantry.push({
            name: req.body.name       
        });
        await user.save();
        res.redirect('/users/' + req.session.user._id + '/foods');
    } catch (err) {
        console.log(err, " <-- error in post");
        res.redirect('/');
    }
})

router.get('/users/:userId/foods', async function(req, res) {
    try {
        const user = await User.findById(req.session.user._id)

        if (!user) {
            throw new Error('User not found')
        }

        res.render('foods/index', { pantry: user.pantry || [], userId: req.session.user._id });
     } catch (err) {
            console.log(err);
            res.redirect('/');
    }
})

router.delete('users/:userId/foods', async function(req, res) {
    try {
        const user = await User.findById(req.session.user._id);

        // Find the item by id and remove it
        user.pantry.id(req.params.itemId).remove();

        // Save the updated user
        await user.save();

        // Redirect back to the pantry index
        res.redirect('/users/' + req.session.user._id + '/foods');
    } catch (error) {
        console.error(error);
        res.redirect('/');
        }
    })
       

router.get('/users/:userId/foods/:itemId/edit', async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        const foodItem = user.pantry.id(req.params.itemId); 

        if (!foodItem) {
            throw new Error('Food item not found');
        }

        
        res.render('foods/edit', { food: foodItem, userId: req.session.user._id });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});
router.put('/users/:userId/foods/:itemId', async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        const foodItem = user.pantry.id(req.params.itemId); // Find specific food item

        if (!foodItem) {
            throw new Error('Food item not found');
        }

        // Update the food item with new data
        foodItem.set(req.body);
        await user.save(); // Save the updated user

        res.redirect(`/users/${req.session.user._id}/foods`);
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

module.exports = router;