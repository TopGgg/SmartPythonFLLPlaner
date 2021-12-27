var  timerId;
var  timerId2;
var  searchBoxDom  =  document.getElementById('track');
var  searchBoxDom2  =  document.getElementById('diameter');

// This represents a very heavy method. Which takes a lot of time to execute
function  makeAPICall() {
	request = $.ajax({
        url: "/updateProperties",
        type: "POST",
        data: JSON.stringify([parseInt($(".diameter").val()), parseInt($(".track").val())]),
    });

    request.fail(function (jqXHR, textStatus, errorThrown){
        console.error(
            "The following error occurred: "+
            textStatus, errorThrown
        );
        alert("Error updating properties, please try again.");
    });
}

// Debounce function: Input as function which needs to be debounced and delay is the debounced time in milliseconds
var  debounceFunction  =  function (func, delay) {
	// Cancels the setTimeout method execution
	clearTimeout(timerId)

	// Executes the func after delay time.
	timerId  =  setTimeout(func, delay)
}
var  debounceFunction2  =  function (func, delay) {
	// Cancels the setTimeout method execution
	clearTimeout(timerId2)

	// Executes the func after delay time.
	timerId2  =  setTimeout(func, delay)
}

// Event listener on the input box
searchBoxDom.addEventListener('input', function () {
	debounceFunction(makeAPICall, 200)
})
searchBoxDom2.addEventListener('input', function () {
	debounceFunction(makeAPICall, 200)
})
$(document).ready(function(){
    request = $.ajax({
        url: "/getProperties",
        type: "GET"
    });
    request.done(function (response, textStatus, jqXHR){
        $(".diameter").val(JSON.parse(response)[0]);
        $(".track").val(JSON.parse(response)[1]);
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        // Log the error to the console
        console.error(
            "The following error occurred: "+
            textStatus, errorThrown
        );
        alert("Error getting properties, please try again.");
    });
});