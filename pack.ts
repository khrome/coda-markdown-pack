/*
Start making Packs!
Try out the hello world sample below to create your first build.
*/

// This import statement gives you access to all parts of the Coda Packs SDK.
import * as coda from "@codahq/packs-sdk";
import * as marked from "marked";
import { convert } from 'html-to-text';
import * as xpath from 'xpath';
import { DOMParser } from 'xmldom';

const xpathText = (selector, value)=>{
  var doc = new DOMParser({
        locator: {},
        errorHandler: { warning: function (w) { }, 
        error: function (e) { }, 
        fatalError: function (e) { console.error(e) } }
    }).parseFromString(value)
  var nodes = xpath.select(selector, doc)
  return nodes.map((n)=>{
    return n.toString();
  });
};

// This line creates your new Pack.
export const pack = coda.newPack();

pack.addNetworkDomain("raw.githubusercontent.com");

// Here, we add a new formula to this Pack.
pack.addFormula({
  // This is the name that will be called in the formula builder.
  // Remember, your formula name cannot have spaces in it.
  name: "Markdown",
  description: "Display some markdown inline",

  // If your formula requires one or more inputs, you’ll define them here.
  // Here, we're creating a string input called “name”.
  parameters: [
	  coda.makeParameter({
	    type: coda.ParameterType.String,
	    name: "url",
	    description: "The markdown you would like to display",
	  }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "section",
      description: "The section you want to start extracting with",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "terminal",
      description: "The section you want to stop extracting with",
    }),
  ],

  // The resultType defines what will be returned in your Coda doc. Here, we're
  // returning a simple text string.
  resultType: coda.ValueType.String,

  // Everything inside this execute statement will happen anytime your Coda
  // formula is called in a doc. An array of all user inputs is always the 1st
  // parameter.
  execute: async function ([url, section, terminal], context) {
	let response = await context.fetcher.fetch({
	  method: "GET",
	  url,
	});
	let data = response.body;
    const html = marked.parse(data);
    let result = html;
    if(section){
      let start = xpathText(section, html)[0];
      let stop = xpathText(terminal, html)[0];
      if(start){
        let index = html.indexOf(start);
        if(index && index !== -1){
          result = result.substring(index);
        }
      }
      if(stop){
        let index = result.indexOf(stop);
        if(index && index !== -1){
          result = result.substring(0, index);
        }
      }
    }
    const text = convert(result, {
      wordwrap: 130
    });
	return text;
  },
});
