const fs = require('fs');
const util = require('util');
const express = require('express');
const items = require('./item');

const router = express.Router();
const readFileAsync = util.promisify(fs.readFile);

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

async function getLectures() {
  const data = await readFileAsync('lectures.json');
  return JSON.parse(data);
}

async function list(req, res) {
  const title = 'Verkefni 1';
  const header = ['Vefforitun', 'Fyrirlestrar'];
  const data = await getLectures();

  res.render('index', {
    title, header, lectures: data.lectures, background: './public/img/header.jpg',
  });
}

async function lecture(req, res, next) {
  const { slug } = req.params;

  const { lectures } = await getLectures();

  const foundLecture = lectures.find(dis => dis.slug === slug);

  if (!foundLecture) {
    // hér væri líka hægt að skila 404 þar sem við erum að meðhöndla allt
    // með `:/slug`
    return next();
  }

  const { title } = foundLecture;
  const header = [foundLecture.category, title];
  const html = items.createHtml(foundLecture.content);
  let background = lectures[0].image;

  if (foundLecture.image != null) {
    background = foundLecture.image;
  }

  return res.render('lecture', {
    title, header, lecture: foundLecture, html, background,
  });
}

router.get('/', catchErrors(list));
router.get('/:slug', catchErrors(lecture));

module.exports = router;
