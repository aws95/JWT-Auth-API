const router = require('express').Router();

//make the route private 

const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {
    // res.json({ posts: { title: 'my first post', description: 'should not access!' } });
    res.send(req.user);
    //find user of this token 
    User.findbyOne({_id: req.user});
});


module.exports = router;