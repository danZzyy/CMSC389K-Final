var mongoose = require('mongoose');

var venueSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  venue_type: {
    type: String
  },
  capacity: {
    type: Number
  }
});

var Venue = mongoose.model("Venue", venueSchema);

var bandSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  }
});

var Band = mongoose.model("Band", bandSchema);

var showSchema = new mongoose.Schema({
  date: {
    type: Date
  },
  venue_name: {
    type: String
  },
  bands: {
    type: [String]
  },
  description: {
    type: String
  }
});

var Show = mongoose.model("Show", showSchema);


module.exports = { Venue: Venue, Show: Show, Band: Band };
