'use strict';
// connect to DB
const mongoose = require('mongoose');
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
// create schema and model
const issueSchema  =  new mongoose.Schema({ 
  issue_title: { type: String, required: true},
  issue_text: { type: String, required: true},
  created_by: { type: String, required: true},
  assigned_to: { type: String, default: ""},
  status_text: { type: String, default: "" },
  open: { type: Boolean, default: true}
  }, {
  versionKey: false,
  timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' }
});
const Issue =  mongoose.model('Issue', issueSchema);

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let query = {};
      const issueProperties = ["_id", "issue_title", "issue_text", "created_on", "updated_on","created_by", "assigned_to", "open", "status_text"];
      issueProperties.forEach(element => {
        if(req.query[element]) query[element] = req.query[element];
      });
      console.log(query)
      Issue.find(query, (err, data) => {
        if(err) console.log(err);
        if(data) {
          res.json(data);
          console.log(data.length)
        }
      });
    })

    .post(function (req, res){
      let project = req.params.project;
      const  { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      if(issue_title && issue_text && created_by) {
        const open = true;
        const issue = new Issue({issue_title, issue_text, created_by, assigned_to, open, status_text});
        issue.save((err, data) => {
          if(data) res.send(data);
        });
      } else {
        res.send({ error: 'required field(s) missing' });
      }

    })
    
    .put(function (req, res){
      let project = req.params.project;
      const id = req.body._id;
      if(id) {
        let update = {};
        for (const [key, value] of Object.entries(req.body)) {
          if(key !== "_id" && value) update[key] = value;
        }
        if(Object.keys(update).length === 0) {
          res.send({
            error: 'no update field(s) sent',
            '_id': id
          });
        } else {
          Issue.findByIdAndUpdate(id, update, (err, data) => {
            if(err) {
              res.send({
                error: 'could not update',
                '_id': id
              });
            }
            if(data) {
              res.send({
                result: 'successfully updated',
                '_id': id
              });
            } else {
              res.send({
                error: 'could not update',
                '_id': id
              });
            }
          });
        }
      } else {
        res.send({
          error: 'missing _id'
        });
      }
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      const id = req.body._id;
      if(id){
        Issue.findByIdAndDelete(id, (err, data) => {
          if(data) { 
                        console.log("sucessful delete")

            res.send({
              result: 'successfully deleted','_id': id
            });
          } else {
            res.send({
              error: 'could not delete',
              '_id': id
            });
          }
        });
      } else {
        res.send({
          error: 'missing _id'
        });
      }
    });
    
};