const express = require('express');
const cors = require('cors');
const marklogic = require('marklogic');
const config = require('./config');

const app = express();
app.use(cors());

const db = marklogic.createDatabaseClient(config.client);
const qb = marklogic.queryBuilder;

function getQuery(opts) {
  let qbArr = [];
  if (opts.collection) {
  	qbArr.push(qb.collection(opts.collection));
  }
  if (opts.qtext) {
  	qbArr.push(qb.term(opts.qtext));
  }
  let pageStart = (opts.pageStart) ? opts.pageStart : config.search.pageStart;
  let pageLength = (opts.pagelength) ? opts.pagelength : config.search.pageLength;
  let query = qb.where.apply(this, qbArr).slice(pageStart, pageLength);
  return query;
}

app.get('/search', (req, res) => {
	let query = getQuery({
	  collection: req.query.collection,
	  qtext: req.query.qtext,
	  pageStart: req.query.pageStart,
	  pageLength: req.query.pageLength
	});
	db.documents.query(query).result(response => {
	    res.send(response);
	  }, error => {
	    console.log(JSON.stringify(error, null, 2));
	  }
	);
})

app.get('/entities', (req, res) => {
	let query = getQuery({
	  collection: 'http://marklogic.com/entity-services/models'
	});
	db.documents.query(query).result(response => {
	    res.send(response);
	  }, error => {
	    console.log(JSON.stringify(error, null, 2));
	  }
	);
})

app.listen(
	config.server.port, 
	() => console.log(`Server listening on port: ${config.server.port}`)
)