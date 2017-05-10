var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var _ = require('underscore');
var expstate = require('express-state');
var app = express();
var mongoose = require('mongoose');
var dotenv = require('dotenv');

var model = require("./models/Venue");
dotenv.load();

console.log(process.env.MONGODB);
mongoose.connect(process.env.MONGODB);

mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));
expstate.extend(app);
app.set("state namespace", 'App');

app.expose({a: 'a', b: 'b'}, 'stuff');
app.get('/', function(req, res){
  var venue_list = [];
  var venue_names = [];
  var band_list = [];
  var show_list = [];

  res.expose(venue_list, "v");
  res.expose(venue_names, "v_names");
  model.Venue.find({}, function(err, venues){
    if (err) throw err;
    venues.forEach(function(v) {
      venue_names.push(v.name);
      venue_list.push(v);
    });

    model.Band.find({}, function(err, bands){
      if (err) throw err;
      band_list = bands;
      model.Show.find({}, function(err, shows){
        if (err) throw err;
        show_list = shows;

        res.render("all", {
          v_names: venue_names,
          v: venue_list,
          b: band_list,
          s: show_list
        });
      });
    });
  });
});

app.get('/api/', function(req, res){
  model.Venue.find({}, function(err, venues){
    if (err) throw err;
    res.send(venues);
  });
});

app.get('/api/venues', function(req, res){
  model.Venue.find({}, function(err, venues){
    if (err) throw err;
    res.send(venues);
  });
});

app.get('/api/shows', function(req, res){
  model.Show.find({}, function(err, shows){
    if (err) throw err;
    res.send(shows);
  });
});

app.get('/api/bands', function(req, res){
  model.Band.find({}, function(err, bands){
    if (err) throw err;
    res.send(bands);
  });
});

app.post('/venue', function(req, res){
  var venue = new model.Venue({
    name: req.body.name,
    city: req.body.city,
    state: req.body.state,
    venue_type: req.body.type,
    capacity: req.body.capacity
  });

  venue.save(function(err){
    if (err) throw err;
    return res.render("venue_inserted", {venue: venue});
  });

});

app.post("/show", function(req, res){
  var band_names = req.body.bands.split(',');
  band_names.forEach(function(b){
    model.Band.findOne({name: b}, function(err, band_found){
      if (err) throw err;
      if(!band_found){
        band_found = new model.Band({ name: b});
        band_found.save(function(err){
          if (err) throw err;
        });
      }
    })
  });

  var show = new model.Show({
    venue_name: req.body.venue,
    date: req.body.date,
    bands: band_names,
    description: req.body.description
  });

  show.save(function(err){
    if (err) throw err;
    return res.render("show_inserted", {show: show});
  });
});

app.get('/new_venue', function(req, res){
  res.render('venue_form', {});
});

app.get('/new_show', function(req, res){
  var venue_list = [];
  model.Venue.find({}, function(err, venues){
    if (err) throw err;
    venues.forEach(function(v) {
      venue_list.push(v.name);
    });
    res.render("show_form", {v: venue_list});
  });
})

app.get('/venues_dc', function(req, res){
  model.Venue.find({state: "DC"}, function(err, venues){
    if (err) throw err;

    res.render('venues_dc', {v: venues});
  });

});

app.get('/venues_capacity', function(req, res){
  model.Venue.find({}, function(err, venues){
    if (err) throw err;
    var v_sorted = _.sortBy(venues, function(v){ return v.capacity});
    res.render('venues_capacity', {v: v_sorted.reverse()});
  });
});

app.get('/bands_abc', function(req, res){
  model.Band.find({}, function(err, bands){
    if (err) throw err;
    var bands_abc =  _.sortBy(bands, function(b){ return b.name});
    res.render('bands_abc', {b: bands_abc});
  });
});

app.get('/past_shows', function(req, res){
  var today = new Date();
  var past = []
  model.Show.find({}, function(err, shows){
    if (err) throw err;
    shows.forEach(function(s){

    });
  });
});

app.get('/upcoming_shows', function(req, res){
  var today = new Date();
  var upcoming = -[];
  model.Show.find({}, function(err, shows){
    if (err) throw err;
    shows.forEach(function(s){

    });
  });
});
/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5
 * endpoints for the API, and 5 others.
 */
/* SCHEMA
 * Venue: Location, Genre, Type
 * Show: Date/time, Bands(list), Venue(FK)
 */
app.listen(3000, function() {
    console.log('Venue App listening on port 3000!');
});
