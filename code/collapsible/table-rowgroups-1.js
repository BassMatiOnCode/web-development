//
//		table-rowgroups-1.js
//

export function initPage ( container = document ) {
	const controllers = document.querySelectorAll ( "thead[collapsible]" );
	for ( let i = 0 ; i < controllers.length ; i ++ ) {
		controllers[ i ].addEventListener( "click", function ( evt = window.event ) { 
			evt.stopPropagation( );
			evt.preventDefault( );
			this.toggleAttribute( "collapsed" );
			} ) ; }	 
	}	

