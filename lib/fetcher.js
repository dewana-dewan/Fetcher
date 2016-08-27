'use babel';

import { CompositeDisposable } from 'atom';
var request = require('request');

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
      url = editor.getSelectedText();
      console.log(url);
        down(url).then(function(result){
            console.log(result);
          }, function(reason){
            console.log(reason);
          });
      };
    }
}




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
