// to store the id of the draggable element.

function handleDragStart(e) {
    e.dataTransfer.setData("text", this.id);
}


//The dragenter event fires when dragging an object over the target. 
//The css class " loc-box" is append to the targets object.
function handleDragEnterLeave(e) {
    if (e.type == "dragenter") {
        $(this).addClass("box loc-box")
    } else {
        $(this).addClass("")
    }
} //end function



//handle dragover event eg.. moving your source div over the target div element.
//If drop event occurs, the function retrieves the draggable element’s id from the DataTransfer object.
function handleOverDrop(e) {
    e.preventDefault();
    if (e.type != "drop") {
        return;
    }

    var draggedId = e.dataTransfer.getData("text");
    //Stores referrence to element being dragged in var draggedEl
    var draggedEl = $('#' + draggedId);


    //if  event "drop" is fired from a different target element, detach the dragged element node from it's
    //current drop target (i.e current perantNode) and append it to the new target element.
    draggedEl.remove();
    $(draggedEl).addClass("tooltips").append("<span style='display:none'>" + $(draggedEl).data("desc") + "</span>")
    $(draggedEl).on("click", function(e) {
        $(".tooltips").find("span").hide();
        $(this).find("span").addClass("showToolTip").show()
    })
    $(this).append(draggedEl); //Note: "this" references to the current target div that is firing the "drop" event.

} //end Function

//This will sort data
function sortProperties(obj) {
    var sortable = [];
    for (var key in obj)
        if (obj.hasOwnProperty(key))
            sortable.push([key, obj[key]]);
    sortable.sort(function(a, b) {
        var x = a[1].name.toLowerCase(),
            y = b[1].name.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
    });
    return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}


function getData() {
    $.ajax({
        url: "js/data.json",
        type: "GET",
        success: function(data) {
            var hotels = sortProperties(data[0].hotels)
                // data[0].hotels.sort(SortByName);
            for (var i in hotels) {
                $("#hotels").append('<div id="box' + i + '" draggable="true" data-desc ="' + hotels[i][1].description + '" class="box navy">' + hotels[i][1].name + '</div>')

            }
            for (var j in data[0].location) {
                $("#loc").append('<div id="loc' + j + '" data-drop-target="true" class="box loc-box" ><div class="loc-title">' + data[0].location[j].name + '</div></div>')

            }
        },
        error: function(err) {
            console.log(err)
        }
    })
};
getData();
$(document).ready(function() {


    //Retrieve two groups of elements, those that are draggable and those that are drop targets:
    var draggable = $('[draggable]')
    var targets = $('[data-drop-target]');


    //Register event listeners for the"dragstart" event on the draggable elements:
    for (var i = 0; i < draggable.length; i++) {
        draggable[i].addEventListener("dragstart", handleDragStart);
    }
    for (var i = 0; i < targets.length; i++) {
        targets[i].addEventListener("dragover", handleOverDrop);
        targets[i].addEventListener("drop", handleOverDrop);
        targets[i].addEventListener("dragenter", handleDragEnterLeave);
        targets[i].addEventListener("dragleave", handleDragEnterLeave);
    }


})