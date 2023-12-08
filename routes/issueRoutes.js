const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.route('/')
    .get(issueController.getAllIssues)
    .post(issueController.createNewIssue)
    .patch(issueController.updateIssue)
    .delete(issueController.deleteIssue)

module.exports = router;