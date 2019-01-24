// Requirements and declarations
const fs = require('fs');
const util = require('util');
const express = require('express');
const contents = require('./contents');

const router = express.Router();
const readFileAsync = util.promisify(fs.readFile);

// Error catcher
function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

// Fetches lectures from a json file and parses it
async function getLectures() {
  const data = await readFileAsync('lectures.json');
  return JSON.parse(data);
}

// Creates a list of lectures which it sends to index.ejs
async function list(req, res) {
  const title = 'Verkefni 1';
  const header = ['Vefforitun', 'Fyrirlestrar'];
  const { lectures } = await getLectures();

  res.render('index', {
    title, header, lectures, background: './public/img/header.jpg',
  });
}

// Assembles the contents of a lecture which it
// then sends to lecture.ejs
async function lecture(req, res, next) {
  const { slug } = req.params;
  const { lectures } = await getLectures();

  // lectures is an array so array.find() works
  const foundLecture = lectures.find(dis => dis.slug === slug);

  if (!foundLecture) {
    return next();
  }

  // Variables to be passed
  const { title } = foundLecture;
  const header = [foundLecture.category, title];
  const html = contents.createHtml(foundLecture.content);
  let background = lectures[0].image;

  if (foundLecture.image != null) {
    background = foundLecture.image;
  }

  // Pass variables
  return res.render('lecture', {
    title, header, lecture: foundLecture, html, background,
  });
}

router.get('/', catchErrors(list));
router.get('/:slug', catchErrors(lecture));

module.exports = router;
