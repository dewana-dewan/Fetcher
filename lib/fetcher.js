'use babel';

import { CompositeDisposable } from 'atom';
var request = require('request');
var cheerio = require('cheerio');
var google = require('google');

export default {

  subscriptions: null,

  activate() {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'fetcher:fetch': () => this.fetch()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  fetch() {
    console.log('hi this is toggle!');
    if (editor = atom.workspace.getActiveTextEditor()) {
      half_query = editor.getSelectedText();

      lang = 'python';
      console.log('half_query is :' + half_query + 'and language is : ' + lang);
      get_res(half_query, lang).then(function(url){
        down(url).then(function(result){
            atom.notifications.addSuccess("We have it, google page downloaded");
            // editor.insertText(result);
            console.log(result);
            snip = scrape(result);
              atom.notifications.addSuccess("We have it, StackOverflow scraped");
            if(snip == "")
              atom.notifications.addWarning("No snippet forund on StackOverflow ");
            else
              editor.insertText(snip);
          }, function(err){
            atom.notifications.addWarning(err.reason);
            //console.log(reason);
          });
        }, function(err){
          atom.notifications.addWarning(err.reason);
      });
    };
  }
}

function get_res(query, language) {
  return new Promise(function(resolve, reject) {
    final_query = query + ' in ' + language + ' site:stackoverflow.com';
    console.log(final_query);

    // google.resultsPerPage = 1;

    google(final_query, function (err, res){
      if (err){
        console.log(res);
        reject({reason:'Error encountered'});
      }
      else if ( res.links.length == 0) {
        // no result
        console.log('no result available');
        reject({reason:'google could not find any result'});
      }
      else
        resolve( res.links[0].href);


    })
  });
};

function scrape(body){
  $ = cheerio.load(body);
  return $('div.accepted-answer pre code').text();
}
// function scrape(bod){
//   var final_scraped=[];
//   acc_ans = bod.getElementsByClassName('accepted-answer');
//   for (var i = 0; i < acc_ans.length; i++) {
//     pre_tags = acc_ans[i].getElementsByTagName('pre');
//     for (var j = 0; j < pre_tags.length; j++) {
//       bongs = pre_tags[i].getElementsByTagName('code');
//       for (var k = 0; k < bongs.length; k++) {
//         final_scraped.append(bongs[k]);
//       }
//     }
//   }
//   return final_scraped;
// }


function down(url) {
  return new Promise(function(resolve, reject) {
    request(url , function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body)
      }
      else {
        reject({reason:'Not working'});
      }
    });
  });
}
