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
      selected = editor.getSelectedText();
      down(selected);
    }
  }

};

function down(url){
  request('http://www.google.com', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body.header) // Show the HTML for the Google homepage.
    }
  })
}
