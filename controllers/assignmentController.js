const Assignment = require('../models/assignment');

function getAllAssignments(req, res) {
    Assignment.findAll()
        .then(assignments => {
            res.json(assignments);
        })
        .catch(error => {
            console.error('Error fetching assignments:', error);
            res.status(500).json({ message: 'Failed to fetch assignments' });
        });
}

function searchAssignments(req, res) {
    const { query } = req.query;
    Assignment.findAll({
        where: {
            assignmentName: {
                [Op.iLike]: `%${query}%`
            }
        }
    })
        .then(results => {
            res.json(results);
        })
        .catch(error => {
            console.error('Error searching assignments:', error);
            res.status(500).json({ message: 'Failed to search assignments' });
        });
}

module.exports = {
    getAllAssignments,
    searchAssignments
};
