$(document).ready(function() {
  var $dragDropArea = $("#drag-drop-area");
  var $uploadBtn = $("#upload-btn");
  var $files = $("#files");

  var stopEvent = function(e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();

    e.returnValue = false;
    e.cancelBubble = true;
    e.stopped = true;
  };

  $uploadBtn.on("click", function(e) {
    stopEvent(e);
    $files.val('');
    $files.trigger("click");
  });

  $dragDropArea.on("click", function(e) {
    stopEvent(e);
    $files.val('');
    $files.trigger("click");
  }).on("dragover", function(e) {
    stopEvent(e);
    $dragDropArea.addClass("drag-on");
  }).on("dragenter", function(e) {
    stopEvent(e);
  }).on("dragleave", function(e) {
    stopEvent(e);
    $dragDropArea.removeClass("drag-on");
  }).on("drop", function(e) {
    stopEvent(e);
    $dragDropArea.removeClass("drag-on");
    if (e.originalEvent.dataTransfer) {
      if (e.originalEvent.dataTransfer.files.length) {
        var files = e.originalEvent.dataTransfer.files;
        console.log(files[0]);
      }
    }
  });
});