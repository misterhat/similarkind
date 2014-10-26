var qs = require('querystring'),

    cheerio = require('cheerio'),
    needle = require('needle');

var HOST = 'http://www.similarkind.com',

    CATEGORIES = {
        artist: 'music-artist',
        game: 'game',
        tv: 'tv-show',
        movies: 'movie',
        book: 'book'
    };

function parseList(done) {
    return function (err, res, body) {
        var $;

        if (err) {
            return done(err);
        }

        if (res.statusCode !== 200) {
            return done(new Error(
                'Invalid status code "' + res.statusCode + '" returned.'
            ));
        }

        try {
            $ = cheerio.load(body.html || body);
        } catch (e) {
            return done(e);
        }

        var parsed = [];

        $('.entityResult').each(function () {
            var id = $(this).attr('data-id'),
                title = $(this).text(),
                year;

            year = +title.slice(-5, -1);
            title = title.slice(0, -6);

            parsed.push({
                id: id,
                year: year,
                title: title
            });
        });

        done(null, parsed);
    };
}

function search(entry, done) {
    var title, year, section;

    if (typeof entry === 'string') {
        title = entry;
    } else {
        title = entry.title;
        year = entry.year;
        section = entry.section;
    }

    title = title.match(/[a-z]/ig).join('').toLowerCase();

    needle.get(HOST + '/ajaxsearch?' + qs.encode({
        query: title
    }), function (err, res, body) {
        var i, found;

        if (err) {
            return done(err);
        }

        if (res.statusCode !== 200) {
            return done(new Error(
                'Invalid status code "' + res.statusCode + '" returned.'
            ));
        }

        for (i = 0; i < body.length; i += 1) {
            if (
                title ===
                    body[i].title.match(/[a-z]/ig).join('').toLowerCase() &&
                (year ? +body[i]['search_identifier'] === +year : true) &&
                (section ? body[i].category === CATEGORIES[section] : true)
            ) {
                found = body[i];
                break;
            }
        }

        return done(null, found ? found._id : null);
    });
}

function makeQuick(goal) {
    return function (entry, done) {
        if (typeof entry === 'string') {
            return goal(entry, done);
        } else if (entry.id) {
            return goal(entry.id, done);
        }

        search(entry, function (err, id) {
            if (err) {
                return done(err);
            }

            if (!id) {
                return done();
            }

            goal(id, done);
        });
    };
}

function similarTo(id, done) {
    needle.get(HOST + '/ajaxmoresimilarentities?' + qs.encode({
        id: id,
        skip: 0
    }), parseList(done));
}

function getGenres(id, done) {
    needle.get(HOST + '/ajaxentity?id=' + id, function (err, res, body) {
        if (err) {
            return done(err);
        }

        if (res.statusCode !== 200) {
            return done(new Error(
                'Invalid status code "' + res.statusCode + '" returned.'
            ));
        }

        done(null, body.tags ? body.tags.genre : []);
    });
}

function withGenres(genres, section, done) {
    var url;

    if (typeof genres === 'string') {
        genres = [ genres ];
    }

    if (genres.length > 3) {
        return done(new Error('No more than three genres may be selected.'));
    }

    genres = genres.map(function (genre) {
        return genre.toLowerCase();
    });

    if (!done) {
        done = section;
        section = 'movies';
    }

    // If only one genre is selected, we can use the AJAX API instead of
    // the website.
    if (genres.length === 1) {
        return needle.get(HOST + '/ajaxmoreentitiesbytag?' + qs.encode({
            tag: genres[0],
            tagfield: 'genre',
            category: CATEGORIES[section],
            skip: 0,
            limit: 1000
        }), parseList(done));
    }

    url = HOST + '/advancefilters?ticked=genre+' + genres.join(';genre+');
    url += '&category=' + CATEGORIES[section];

    needle.get(url, parseList(done));
}

module.exports.to = makeQuick(similarTo);
module.exports.getGenres = makeQuick(getGenres);
module.exports.withGenres = withGenres;
