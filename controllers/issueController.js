const Issue = require('../models/issue')
const User = require('../models/user')
const asyncHandler = require('express-async-handler')

// @desc Get all issues
// @route GET /issues
// @access Private
const getAllIssues = asyncHandler(async (req, res) => {
    const issues = await Issue.find().lean();
    if (!issues?.length) {
        return res.status(400).json({ message: 'No issues found' });
    }

    const issuesWithUser = await Promise.all(issues.map(async (issue) => {
        const user = await User.findById(issue.user).lean().exec();

        return { ...issue, username: user?.username };
    }));
    res.json(issuesWithUser);
});

// @desc Create new issue
// @route POST /issues
// @access Private
const createNewIssue = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body;
    
    if (!title || !text) {
        return res.status(400).json({ message: 'Invalid information submitted' });
    }

    const issue = await Issue.create({ user, title, text });

    if (issue) {
        res.status(201).json({ message: `New issue ${title} created` });
    } else {
        res.status(400).json({ message: 'Invalid information submitted' });
    }
});

// @desc Update issue
// @route PATCH /issues
// @access Private
const updateIssue = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body;

    if (!id || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'Invalid information submitted' });
    }

    const issue = await Issue.findById(id).exec();

    if (!issue) {
        return res.status(400).json({ message: 'Issue not found' });
    }

    issue.user = user;
    issue.title = title;
    issue.text = text;
    issue.completed = completed;

    const updatedIssue = await issue.save();

    res.json({ message: `Issue ${updatedIssue.title} updated` });
});

// @desc Delete issue
// @route DELETE /issue
// @access Private
const deleteIssue = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Issue id required' });
    }

    const issue = await Issue.findById(id).exec();
    if (!issue) {
        return res.status(400).json({ message: 'Issue not found' });
    }

    const result = await issue.deleteOne();
    const reply = `Issue ${result.title} with id ${result._id} deleted`;
    res.json(reply);
});

module.exports = {
    getAllIssues,
    createNewIssue,
    updateIssue,
    deleteIssue
};