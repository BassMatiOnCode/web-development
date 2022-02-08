//
//	loader-4.js  2021-07-30  usp
//

export let requests = [ ] ;
	// Holds request promises.

export function initPage ( ) {
	/// Starts the loading process for the entire document.
	// requests.push( new Promise( (resolve, reject) => {
	//	setTimeout( ( ) => { console.log( "Timer elapsed" ); return resolve( "foo" ); } , 1000 ) } ) ) ;
	await loadResources( document );
	}

async function loadResources ( container, baseUrl = "/" ) { 
	/// Loads the snippets into containers asynchronously,
	/// adds the requests to the global requests array.
	let snippetContainers = container.querySelectorAll( "[load-src]" );
	for ( let i = 0 ; i < snippetContainers.length ; i ++ ) {
		let snippetContainer = snippetContainers[ i ];
		await loadResource( snippetContainer, baseUrl );
		} 
	}

function loadResource ( container, baseUrl ) {
	/// Loads a resource into a container
	// Find request URL
	if ( typeof container === "string" ) container = document.getElementById( container );
	let url = container.getAttribute( "load-src" );
	url = prefixUrl( baseUrl, url );
	let request = fetch( url )
		.then( response => response.ok ? response.text( ) : `Failed to load ${url}` ) // return response body text, or failure hint for 404 errors
		.then( html => container.innerHTML += html ) // integrate response text
		.then ( ( ) => console.log( "loadResource: url=", url ))
		.then ( ( ) => { if (container.hasAttribute( "remove-wrapper" )) container.firstChild.remove ; } )
		.then( ( ) => prefixUrls( container, stripFileName( url )))
		.then( ( ) => await loadResources( container, stripFileName( url ))) // recursively load other resources
		.catch( err => console.warn( "Error: ", err ))
		.finally( ( ) => console.log( `Request finished: ${url}` ));
	requests.push( request );
	console.log( "Requesting: ", url, requests.length, requests[ requests.length-1 ] );
	return request;
	}
	
function stripFileName( path ) {
	/// Return the substring up to (but not including) the last forward slash.
	let i = path.lastIndexOf( "/" );
	if ( i < 0 ) return "/" ;
	else return path.substr( 0, i ) + "/" ;
	}

function prefixUrl( prefix, url ) {
	/// Add a prefix to relative urls, return absolute urls unchanged. 
	if ( url[ 0 ] === "/" || url.indexOf( "://" ) >= 0 ) return url; 
	return prefix + url;
	}

function prefixUrls ( container, baseUrl ) {
	/// Prefix relative links with the path to the source folder.
	/// This is necessary because the resource was "moved" from its source folder 
	/// to the curren document folder.
	// console.log( "prefixUrls: baseUrl=", baseUrl );
	function adjustRelativeUrls ( attributeName ) {
		/// Collects link attributes and prefixes relative URLs
		container.querySelectorAll( `[${attributeName}]` ).forEach( link => { 
			let url = link.getAttribute( attributeName );
			url = prefixUrl( baseUrl, url );
			// console.log( "prefixUrls: url=", url );
			link.setAttribute( attributeName, url );
			} ) ;
		}
	adjustRelativeUrls( "href" );
	adjustRelativeUrls( "src" );
	}


