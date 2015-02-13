'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	$('.project a').click(addProjectDetails);

	$('#colorBtn').click(randomizeColors);
	$('#userBtn').click(greetUser);
}
 function callBackU(result)
{
	console.log("Result is" + result);
	var userHTML = 'Welcome ' + result['username'];
	$(".jumbotron h1").html(userHTML);
}

function greetUser(e) {
	// Prevent following the link
	e.preventDefault();

	// Get the div ID, e.g., "project3"
	//var projectID = $(this).closest('.project').attr('id');
	// get rid of 'project' from the front of the id 'project3'
	var email = $("#email").val();
	console.log("You entered " + email);
	$.get("/user/" + username, callBackU);
}
/*
 * Make an AJAX call to retrieve project details and add it in
 */
 function callBack(result)
{
	console.log(result);
	var projectHTML = '<img src="' + result['image'] + '" class="detailsImage">' + '<p>' + result['title'] + '</p>' + '<p><small>' + result['date'] + '</small></p><p>' + result['summary'] + '</a>';
	var proj_div = 'div#project' + result['id'] + ' div.thumbnail div.details';
	console.log("selector is " + proj_div);
	$(proj_div).html(projectHTML);
}

function addProjectDetails(e) {
	// Prevent following the link
	e.preventDefault();

	// Get the div ID, e.g., "project3"
	var projectID = $(this).closest('.project').attr('id');
	// get rid of 'project' from the front of the id 'project3'
	var idNumber = projectID.substr('project'.length);
	$.get("/project/" + idNumber, callBack);
	console.log("User clicked on project " + idNumber);
	console.log("Url: /project/" + idNumber);
}


/*
 * Make an AJAX call to retrieve a color palette for the site
 * and apply it
 */
 function colorCallBack(result)
 {
 	var hex = result['colors'];
 	var colors = hex['hex'];
 	$('body').css('background-color', colors[0]);
 	$('.thumbnail').css('background-color', colors[1]);
 	$('h1, h2, h3, h4, h5, h6').css('color', colors[2]);
 	$('p').css('color', colors[3]);
 	$('.project img').css('opacity', 0.75);
 }

function randomizeColors(e) {
	console.log("User clicked on color button");

	e.preventDefault();

	$.get("/palette", colorCallBack);
}

