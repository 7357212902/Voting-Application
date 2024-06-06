const express = require('express');
const router = express.Router();
const user = require('../user');
const {
    jwtAuthMiddleware,
    generateToken
} = require('./jwt');


router.post('/signup', async(req, res) => {
    try {
        const data = req.body;
        // create a new user documnet using mongoose model
        const newuser = new user(data);

        //save the new user to the database
        const response = await newuser.save();
        console.log("data saved");
        const payload = {
            id: response.id
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("token is:", token);
        res.status(200).json({
            response: response,
            token: token
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Internal server error",
        });
    }
});

//login route
router.post('/login', async(req, res) => {

        try {
            //extract username and password from request body
            const { AadharCardNumber, password } = req.body;
            //find the user by username
            const user = await user.findone({ AadharCardNumber: AadharCardNumber });

            //if user doest not exist or password does not match , return error
            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({ error: 'Invalid username and password' });
            }
            //generate token

            const payload = {
                id: user.id,

            }
            const token = generatetoken(payload);

            //returnb token as response

            res.json({ token })
        } catch (err) {
            console.log(err);
            res.status(401).json({ error: 'Internal server error' });
        }
    })
    //profile route
router.get('/profile', jwtAuthMiddleware, async(req, res) => {

        try {
            const userdata = req.body;
            const userId = userdata.id;
            const user = await user.findById(userId);
            res.status(200).json({ user });
        } catch (err) {
            console.log(err);
            res.status(401).json({ error: 'Internal server error' });
        }
    })
    // Get user data
router.get('/', jwtAuthMiddleware, async(req, res) => {
    try {
        const data = await user.find();
        console.log("data fetched successfully");
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Internal server error",
        });
    }
});
router.get('/:workType', async(req, res) => {
    try {
        const workType = req.params.workType;
        if (workType === 'chef' || workType === 'waiter' || workType === 'manager') {
            const response = await user.find({ work: workType });
            console.log("data fetched successfully");
            res.status(200).json(response);
        } else {
            res.status(404).json({ error: 'Invalid work Type' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.put('/profile/password', jwtAuthMiddleware, async(req, res) => {
    try {
        const userID = req.user;
        const { currentPasssword, newPassword } = req.body;
        // find the user by userid
        const user = await user.findById(userId);
        //if  password does not match , return error
        if (!(await user.comparePassword(currentPasssword))) {
            return res.status(401).json({ error: 'Invalid username and password' });
        }
        //update the user password
        user.password = newPassword;
        awaituser.save();
        console.log('password updated');
        res.status(200).json({ message: 'password uppdated' });

        if (!response) {
            res.status(404).json({ error: 'user not found' });
        }
        console.log('user updated successfully');
        res.status(200).json(response);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });

    }

})
router.delete('/:id', async(req, res) => {
    try {
        const userID = req.params.id;
        const response = await user.findByIdAndDelete(userID);
        if (!response) {
            return res.status(404).json({
                error: "user not found "
            });
        }
        console.log('data deleted successfully');
        res.status(200).json(response);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
})
module.exports = router;
