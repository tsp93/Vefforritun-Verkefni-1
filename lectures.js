const fs = require('fs');
const util = require('util');
const express = require('express');

const router = express.Router();
const readFileAsync = util.promisify(fs.readFile);

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

async function getLectures() {
  const data =  await readFileAsync('lectures.json');
  return JSON.parse(data);
}

async function list(req, res) {
  const title = 'Verkefni 1';
  const data = await getLectures();

  res.render('index', {title, lectures : data.lectures});
}

async function lecture(req, res, next) {
  /* todo útfæra */
}

router.get('/', catchErrors(list));
router.get('/:slug', catchErrors(lecture));

module.exports = router;
