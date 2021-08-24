//	recursive-snippet-loader.js
// 2021-07-02 usp

//	Page init code

	// This array of promises should not fulfil 
	// before the last snippet arrived.
let fetchPromises = [ ];
	
	// Load all snippets found in the document.
loadSnippets( document );

// Support functions

async function loadSnippets ( parent ) {
		// Searches for snippet definitions in the parent element
		// and loads the associated resources.
	let snippetContainers = parent.querySelectorAll( "[snippet-src]" );
	for ( let i = 0 ; i < snippetContainers.length ; i ++ ) {
		let snippetContainer = snippetContainers[ i ];
		let url = snippetContainer.getAttribute( "snippet-src" );
		// Fetch the resource and add a promise for the request to the array.
		fetchPromises.push( fetch( url )
			.then ( response => response.text ( ) ) 
			.then ( html => snippetContainer.innerHTML = html )
			.then ( ( ) => loadSnippets ( snippetContainer ) )
			.catch ( err => console.error ( "SnippetLoader: ", err ) ) ) ; 
		} }
