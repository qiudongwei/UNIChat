const express = require('express')
const router = express.Router()

router.post('/login', (req, res) => {
    const data = Object.assign({}, req.body)
    res.json({
        result: 1,
        code: 100,
        data: data
    })
})

module.exports = router