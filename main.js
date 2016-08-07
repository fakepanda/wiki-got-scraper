const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');

const url = 'https://en.wikipedia.org/wiki/List_of_Game_of_Thrones_characters';

request(url, (error, response, html) => {
  if (!error && response.statusCode === 200) {
    let $ = cheerio.load(html);
    
    // grab the first 2 tables for "Main Cast" and "Supporting Cast"
    $('#mw-content-text table').slice(0, 2);
    $ = cheerio.load($.html());
    // nth-child(2) matches the character, we only care about major characters who have links to
    // their own wiki page.
    const gotNames = $('tr > td:nth-child(2) > a').map(function (i__, el__) {
      return $(this).text();
    }).get();
    
    const output = `export default ${JSON.stringify(gotNames, null, 2)};`;
    fs.writeFile('got.js', output, (err) => {
      if (!err) {
        console.log('success! output saved as got.json');
      }
    });
  }
});
