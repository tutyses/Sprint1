const {Router} = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.send('Router');
})


module.exports = router;