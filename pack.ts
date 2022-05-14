/*
Start making Packs!
Try out the hello world sample below to create your first build.
*/

// This import statement gives you access to all parts of the Coda Packs SDK.
import * as coda from "@codahq/packs-sdk";
import * as marked from "marked";
import * as h2t from 'html-to-text';
const convert = h2t.convert;

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
  ],

  // The resultType defines what will be returned in your Coda doc. Here, we're
  // returning a simple text string.
  resultType: coda.ValueType.String,

  // Everything inside this execute statement will happen anytime your Coda
  // formula is called in a doc. An array of all user inputs is always the 1st
  // parameter.
  execute: async function ([url], context) {
	let response = await context.fetcher.fetch({
	  method: "GET",
	  url,
	});
	let data = response.body;
    const html = marked.parse(data);
    const text = convert(html, {
      wordwrap: 130
    });
	return text;
  },
});
