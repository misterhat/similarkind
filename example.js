var similarkind = require('./');

similarkind.to({
    title: 'married... with children',
    year: 1987
}, console.log);

similarkind.getGenres({ title: 'the simpsons' }, console.log);
// [ 'animation', 'television-comedy', 'family', 'comedy' ]

similarkind.withGenres([ 'comedy', 'animation' ], 'movies', console.log);
/* [ { id: '15228', year: 2008, title: 'WALL-E' },
  { id: '16645', year: 1995, title: 'Toy Story' },
  { id: '23202', year: 2009, title: 'Up' },
  { id: '9078', year: 2003, title: 'Finding Nemo' }, ... ] */
