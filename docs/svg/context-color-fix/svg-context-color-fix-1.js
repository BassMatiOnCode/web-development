//		svg-context-color-fix-1.js    2023-05-11    usp
//		JavaScript module. To use it, simply add or link to this script in your html file.

	// These might be useful elsewhere:
export const cssColorParser = new RegExp( "rgb\\((\\d+), (\\d+), (\\d+)\\)" );
	// used to extract the values from an "rgb(r, g, b)" expression
export const cssUrlParser = new RegExp( "url\\s*\\(\\s*#([^)]+)\\)$" );
	// used to retrieve the ID of the referenced element in the document

export function fixMarkerContextColors ( svgs ) {
	// 
	// Purpose: Fix the content-stroke bug for markers.
	// svgs: Array of SVG elements which may contain markers with context-stroke colors.
	
	// Loop through the SVG elements passed in the arguments
	svgs.forEach( svg => {

		// Find and process all elements with marker attributes
		const elements = svg.querySelectorAll( "[marker-start],[marker-mid],[marker-end]" );
		elements.forEach( (element) => { 
	
			// Test all possible marker attributes on the current element
			[ "marker-start", "marker-mid", "marker-end" ].forEach( ( attributeName ) => {
				
				// Exit if the element does not have the current attribute
				if ( ! element.hasAttribute( attributeName )) return ;

				// Retrieve the ID of the referenced marker and get a reference to it
				const markerID =  element.getAttribute( attributeName ).match( cssUrlParser )[ 1 ];
				const marker = document.querySelector( `#${markerID}` );

				// Set flags that indicate that a fix is needed
				const fixFillAttribute = marker.hasAttribute( "fill" ) && marker.getAttribute( "fill" ).startsWith( "context-" ) 
				const fixStrokeAttribute = marker.hasAttribute( "stroke" ) && marker.getAttribute( "stroke" ).startsWith( "context-" );
				if ( ! fixFillAttribute && ! fixStrokeAttribute ) return ;

				// If so, find, parse and convert the element's stroke color
				let m = window.getComputedStyle( element ).stroke.match( cssColorParser );
				const colorCode = `${(+m[1]).toString(16).padStart(2, "0")}${(+m[2]).toString(16).padStart(2, "0")}${(+m[3]).toString(16).padStart(2, "0")}`;
		
				// Then check if a marker with that ID already exists
				// and duplicate the original marker if not
				if ( svg.querySelector( `#${marker.ID}-${colorCode}` )) return;
				const clone = marker.cloneNode( true );
		
				// Encode the color in the clone ID
				clone.id = `${marker.id}-${colorCode}` ;

				// Fix the color value(s)
				if ( fixStrokeAttribute ) clone.setAttribute( "stroke", `#${colorCode}` );
				if ( fixFillAttribute ) clone.setAttribute( "fill", `#${colorCode}` );

				// Add the new marker to the definitions
				marker.parentNode.appendChild( clone );
		
				// Change the marker reference in the element attribute accordingly.
				element.setAttribute( attributeName, `url( #${clone.id} )` );

	} ) ;	} ) ;	} ) ;	} 

export function initPage( ) {
	fixMarkerContextColors( document.querySelectorAll( "svg" ));
	}

