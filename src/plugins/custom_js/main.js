// preloader
paceOptions = {
  ajax: true,
  document: true,
  eventLag: false,
};

Pace.on("done", function () {
  $("#preloader").addClass("isdone");
  $(".loading-text").addClass("isdone");
});
