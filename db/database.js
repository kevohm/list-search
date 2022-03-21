const mongoose = require('mongoose');

const  connect  = (URL) => {
  return mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

} 
module.exports = connect