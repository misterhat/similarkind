# similarkind
A module to access *similarkind's* features. Scrape various movies, music,
games, etc. based on similar entries or genres.

## Installation
    $ npm install similarkind

## Example
```javascript
var similarkind = require('similarkind');

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
```

## API
### sections
`'artist', 'game', 'tv', 'movies', 'book'`

### .to(entry, callback)
Find similar entries to the one provided.

`entry` is expected to be either a string or an object. If `entry` is a string,
it's presumed to be a *similarkind* identifier.
Otherwise, `entry` is expected to have either an `id` property, or a `title`
property with optional additional specifiers `year` and `section`. See above
for section options.

`callback` returns an array of similar entries. Each entry is an object
containing the following properties: `id`, `title` and `year`.

### .getGenres(entry, callback)
Get a list of genres for an entry.

`entry` is the same object as described in `.to`.

`callback` returns a list of genres for the entry (an array of strings).

### .withGenres(genres, [section], callback)
Find entries with matching genres.

`genres` is expected to be either a string, or an array of up to three strings.

`section` decides which category to look under. See above for the possible
options. By default it chooses `'movies'`.

`callback` will return a list of entries in the same format as `.to`.

## Disclaimer
The author of *similarkind* specifically disallows scraping his content without
prior permission. Bear that in mind should you disobey him by using this module
without consent.

## License
MIT
