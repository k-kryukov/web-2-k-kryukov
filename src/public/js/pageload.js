window.addEventListener("DOMContentLoaded", function() {
  let LoadingTime = 0;
  let endTime = new Date().getTime();
  LoadingTime = endTime - performance.timing.navigationStart; // depr but works!
  document.getElementById("time").innerHTML += `Client: ${LoadingTime} ms`
});