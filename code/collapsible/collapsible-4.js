////	collapsible-block-4.js
////	2021-06-27 usp

function clickEventHandler ( ) {
	if ( this.hasAttribute( "force-visible" )) this.removeAttribute( "force-visible" );
	const expanding = this.toggleAttribute( "expand" );
	const block = this.nextElementSibling;
	if ( expanding ) block.style.maxHeight = block.scrollHeight + "px";
	else {
		block.style.maxHeight = block.scrollHeight + "px" ;
		window.requestAnimationFrame( function ( ) { 
			block.style.maxHeight = "0px" ;
			} ) ; } } 

// Document init code

const controllers = document.querySelectorAll( "[cbc]" );
for ( let i = 0; i < controllers.length; i++ ) {
	const controller = controllers[ i ];
	controller.insertBefore( document.createElement( "span" ), controller.firstChild ).innerHTML = "&nbsp;" ;
	if ( controller.hasAttribute( "expand" )) controller.nextElementSibling.style.maxHeight = "none" ;
	controller.addEventListener( "click", clickEventHandler );
	controller.nextElementSibling.addEventListener( "transitionend", function ( ) { 
		// Remove max height limitation if block was expanded
		if ( this.style.maxHeight !== "0px" ) this.style.maxHeight = "none" ;
		} ) ; }
let button = document.getElementById( "collapse-all" );
if ( button ) button.addEventListener( "click", collapseBlocks );
button = document.getElementById( "expand-all" );
if ( button ) button.addEventListener( "click", expandBlocks );

// Support functions

export function expandBlocks ( ) {
	const controllers = document.querySelectorAll( "[cbc]:not([expand])" );
	for ( let i = 0; i < controllers.length; i++ ) {
		clickEventHandler.call( controllers[ i ] );
		} }

export function collapseBlocks ( ) {
	const controllers = document.querySelectorAll( "[cbc]" );
	for ( let i = 0; i < controllers.length; i++ ) {
		const controller = controllers[ i ];
		if ( controller.hasAttribute( "expand" )) clickEventHandler.call( controller );
		} }
	
export function showContent ( ) {
	const controllers = document.querySelectorAll( "[cbc]:not([expand])" );
	for ( let i = 0; i < controllers.length; i++ ) {
		const controller = controllers[ i ];
		controller.setAttribute( "force-visible", "" );
		controller.nextElementSibling.style.maxHeight = controller.nextElementSibling.scrollHeight + "px";
		} }
	
export function hideContent ( ) {
	const controllers = document.querySelectorAll( "[cbc][force-visible]" );
	for ( let i = 0; i < controllers.length; i++ ) {
		const controller = controllers[ i ];
		controller.removeAttribute( "force-visible" );
		block = controller.nextElementSibling;
		block.style.maxHeight = block.scrollHeight + "px" ;
		window.requestAnimationFrame( function ( ) { 
			this.style.maxHeight = "0px" ;
			}.bind( block )) ; } }


