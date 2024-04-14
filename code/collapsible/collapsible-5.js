//
// collapsible-block-5.js  2022-09-24  usp
//

const urlDefaultState = new URLSearchParams( document.location.search ).get( "cbc-override" );
const blockTransitionStyle = "height 0.5s linear " ;
const controllerTransitionStyle = "margin-top 0.5s linear" ;

function getInitialControllerState ( e ) {
	///		Determine the initial state of a cbc controller
	///		The initial state of a controller is defined manually, or by a cbc-default attribute 
	///		of a parent container, or "expanded". 
	///		The initial state can be overridden by an url parameter "cbc-override", except if
	///		a parent container has an attribute "cbc-no-override".
	let initialState = e.getAttribute( "cbc" ) ;
	let preventOverride = false ;
	while ( ! initialState && ! preventOverride  ) { 
		if ( ! e.getAttribute ) break ;
		preventOverride = preventOverride || e.hasAttribute( "cbc-no-override" )
		initialState = initialState || e.getAttribute( "cbc-default" );
		e = e.parentNode ; 
		} 
	if ( ! preventOverride ) initialState = urlDefaultState || initialState ;
	return initialState || "expanded" ; 
	}
function initCollapsibleULtrees( container = document ) {
	const trees = container.querySelectorAll( "ul.collapsible,ol.collapsible" );
	for ( let i = 0 ; i < trees.length ; i ++ ) {
		const tree = trees[ i ];
		const blocks = tree.querySelectorAll( "UL,OL" );   // all nested lists
		for ( let j = 0 ; j < blocks.length ; j ++ ) {
			let block = blocks[ j ];
			let controller = block.parentNode;
			while ( controller && controller.tagName !== "LI" ) controller = controller.parentNode ;
			if ( !controller ) break;
				// Set initial controller state if necessary.
			let controllerState = getInitialControllerState( controller );
			controller.setAttribute( "cbc", controllerState );	
			controller.addEventListener( "click", iconClickHandler );
				// Register collapsible block with block controllers.
			if ( ! controller.synesis ) controller.synesis = { } ;
			controller.synesis.collapsibleBlocks = [ block ];
				// Initialize inline styles.
			block.style.transition = blockTransitionStyle;
			block.style.height = controllerState === "collapsed" ? "0px" : "auto" ;
			block.addEventListener( "transitionend", transitionEndHandler );
				// The element following the collapsible block is affected by collapsing vertical margins...
		if ( block.nextElementSibling ) block.nextElementSibling.style.transition = controllerTransitionStyle ;
	}	}	}
function initCollapsibleDLtrees ( container = document ) {
		// Find all block controllers in a collapsible DL
	const controllers = container.querySelectorAll( "dl.collapsible > dt" ) ;
	for ( let i = 0 ; i < controllers.length ; i ++ ) {
		const controller = controllers[ i ];
			// Set initial controller state if necessary.
		let controllerState = getInitialControllerState( controller );
		controller.setAttribute( "cbc", controllerState );	
		controller.addEventListener( "click", iconClickHandler );
			// Register all collapsible blocks with block controllers.
		if ( ! controller.synesis ) controller.synesis = { } ;
		controller.synesis.collapsibleBlocks = [ ];
		let block = controller.nextElementSibling ;
		while ( block && block.tagName === "DD" ) {
			controller.synesis.collapsibleBlocks.push( block );
			block.style.transition = blockTransitionStyle;
			block.addEventListener( "transitionend", transitionEndHandler );
				// Initialize inline styles.
			block.style.height = controllerState === "collapsed" ? "0px" : "auto" ;
			block = block.nextElementSibling ;
			}
			// The element following the collapsible block is affected by collapsing vertical margins...
		if ( block && block.nextElementSibling ) block.nextElementSibling.style.transition = controllerTransitionStyle ;
	}	}
function initCollapsibleChapters ( container = document ) {
		// Find all block controllers in a collapsible 
	const controllers = container.querySelectorAll( "h1[cbc],h2[cbc],h3[cbc],h4[cbc],h5[cbc]" ) ;  // All heading elements with a cbc attribute
	for ( let i = 0 ; i < controllers.length ; i ++ ) {
		const controller = controllers[ i ];
			// Set initial controller state if necessary.
		let controllerState = getInitialControllerState( controller );
		controller.setAttribute( "cbc", controllerState );	
		controller.addEventListener( "click", iconClickHandler );
			// Register collapsible block with block controller.
		const block = controller.nextElementSibling ;   // usually a DIV element
		if ( ! controller.synesis ) controller.synesis = { } ;
		controller.synesis.collapsibleBlocks = [ block ];
			// Initialize inline styles.
		block.style.transition = blockTransitionStyle;
		block.style.height = controllerState === "collapsed" ? "0px" : "auto" ;
		block.addEventListener( "transitionend", transitionEndHandler );
			// The element following the collapsible block is affected by collapsing vertical margins...
		if ( block.nextElementSibling ) block.nextElementSibling.style.transition = controllerTransitionStyle ;
	}	}
export function initPage ( container ) {
		///		Decorate controller elements in collapsible trees.
	console.info( "collapsible:initPage" );
	initCollapsibleULtrees( container );
	initCollapsibleDLtrees( container );
	initCollapsibleChapters( container );
	}
function toggleBlockState( controller ) {
	if ( controller.getAttribute( "cbc" ) === "collapsed" ) expand ( controller );
	else if ( controller.getAttribute( "cbc" ) === "expanded" ) collapse( controller );
	}
function iconClickHandler ( evt ) { 
	if ( ! this.synesis || ! this.synesis.collapsibleBlocks || evt.target.tagName === "A" || evt.offsetX > 30 || evt.offsetY > this.scrollHeight ) 
		return ;
	toggleBlockState( this );
	evt.preventDefault();
	evt.stopPropagation( );
	}
function transitionEndHandler ( evt ) { 
	if ( evt.target.style.height !== "0px" ) evt.target.style.height = "auto" ;
	evt.preventDefault();
	evt.stopPropagation( );
	}
function expand( controller ) {
	controller.synesis.collapsibleBlocks.forEach ( block => {
		block.style.height = "auto" ;
		const height = block.scrollHeight + "px" ;
		block.style.height = "0px" ;
		window.requestAnimationFrame (( function( ) { 
			this.style.height = height ; 
			block.style.overflowY = "hidden" ; // 2024-04-14
			} ).bind( block )) ;
		}	)
	controller.setAttribute( "cbc", "expanded" );
	}
function collapse( controller ) {
	controller.synesis.collapsibleBlocks.forEach ( block => {
		block.style.height = block.scrollHeight + "px" ;
		window.requestAnimationFrame( (function ( ) {  
			this.style.height = "0px" ;
			block.style.overflowX = "hidden" ;
			} ).bind( block )) ;
		}	)
	controller.setAttribute( "cbc", "collapsed" );
	}
export function expandAllBlocks (  ) {
	/// Expand all collapsible content blocks.
	document.querySelectorAll( "#page-content [cbc='collapsed']" ).forEach( expand );
	}
export function collapseAllBlocks ( ) {
	/// Collapse all collapsible content blocks.
	document.querySelectorAll( "#page-content [cbc='expanded']" ).forEach( collapse );
	}
export function toggleAllBlocks ( evt ) {
	/// Toggles the visibility of collapsible blocks inside the content div element.
	/// Used as button click event handler.
	if ( this.toggleAttribute( "expand" )) collapseAllBlocks( ); else expandAllBlocks( );
	}
export function expandPath( id ) {
	///		Ensures that an element is not in a collapsed block
	let e = document.getElementById( id );
	if ( ! e ) return;
	if ( e.tagName === "LI" ) {
		if ( e.getAttribute( "cbc" ) === "collapsed" ) iconClickHandler( { target : e } ) ;
		e = e.parentNode ; } 
	else {
		if ( e.previousElementSibling.getAttribute( "cbc" ) === "collapsed" ) iconClickHandler( { target : e.previousElementSibling , offsetX : 0 , offsetY : 0 } ) ;
		e = e.parentNode;
		} }
