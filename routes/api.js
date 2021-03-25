'use strict';
// connect to DB
const mongoose = require('mongoose');
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
// create schema and model
const issueSchema  =  new mongoose.Schema({ 
  issue_title: { type: String, required: true},
  issue_text: { type: String, required: true},
  created_on: { type: Date, required: true},
  updated_on: Date,
  created_by: { type: String, required: true},
  assigned_to: String,
  open: Boolean,
  status_text: String
});
const Issue =  mongoose.model('Issue', issueSchema);

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
    })

    .post(function (req, res){
      let project = req.params.project;
      const  { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      if(issue_title && issue_text && created_by) {
        const created_on = new Date();
        const updated_on = new Date();
        const open = true;
        const issue = new Issue({ issue_title, issue_text, created_on, updated_on, created_by, assigned_to, open, status_text});
        issue.save((err, data) => {
          if(data) res.send(data);
        });
      } else {
        res.send({ error: 'required field(s) missing' });
      }

    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
