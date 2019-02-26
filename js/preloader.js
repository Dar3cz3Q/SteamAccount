window.addEventListener("load", function() {
  $("#preloader").addClass("preloader-hidding");
  var preloaderEl = document.querySelector("#preloader");
  preloaderEl.addEventListener("transitionend", function() {
    $("#preloader").addClass("preloader-hidden");
    $("#preloader").removeClass("preloader-hidding");
    $(".nav_info_text").addClass("nav_come_in_first");
    $(".nav_info_text_sec").addClass("nav_come_in_second");
    $(".button_start_frame").addClass("button_come_in_third");
  });
});
