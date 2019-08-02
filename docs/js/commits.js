const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
const millisOfADay = 86400000;
const millisOfFourteenDays = 1209600000;

$.getJSON('https://api.github.com/repos/DunkleMango/StarboundModManager/commits', function(data) {
  var count = Object.keys(data).length;
  var dates = [];
  var authors = [];
  var authorsImg = [];
  var authorsLink = [];
  var messages = [];
  for (var i = 0; i < count; i++) {
    dates[i] = new Date(data[i].commit.author.date);
    authors[i] = data[i].author.login;
    authorsImg[i] = data[i].author.avatar_url;
    authorsLink[i] = data[i].author.html_url;
    messages[i] = data[i].commit.message;
  }

  $(".commits").html(function() {
    var builder = "";
    var lastDate = null;
    for (var i = 0; i < dates.length; i++) {
      var diff = getDateDifference(lastDate, dates[i]);
      if (lastDate == null || diff > millisOfADay) {
        if (i > 0) {
          builder += `<div class=\"commitGroupDateSeparator\"></div>`;
        }
        builder += `<h3 class=\"commitGroupDate\">Commits on ${monthNames[dates[i].getMonth()]} ${dates[i].getDate()}, ${dates[i].getFullYear()}</h3>`;
        lastDate = dates[i];
      }
      builder += buildCommitDiv(i);
    }
    return builder;
  });

  function buildCommitDiv(index) {
    var builder = "";
    builder += `<div class=\"commitWrapper\">`;
    builder += `<div class=\"commitInfoWrapper\">`;
    builder += `<p class=\"commitMessage\">${messages[index].replace(/\n/g, "<br>")}</p>`;
    builder += `<div class=\"commitUserWrapper\">`;
    builder += `<div class=\"commitUserImgWrapper\"><a href=${authorsLink[index]} class=\"imgLink\">
                <img src=\'${authorsImg[index]}\' class=\"commitUserImg\"/></a></div>`;
    builder += `<p class=\"commitUserName\">${authors[index]}</p>`;
    builder += `<p class=\"commitDate\">committed `;
    var curDate = new Date();
    var dateDiff = getDateDifference(curDate, dates[index]);
    var diffDate = new Date(dateDiff);
    if (dateDiff < millisOfADay) {
      builder += `${diffDate.getHours()} hours ago`;
    } else if (dateDiff < millisOfFourteenDays) {
      builder += `${diffDate.getDate()} days ago`;
    } else {
      builder += `on ${monthNames[dates[index].getMonth()]} ${dates[index].getDate()}, ${dates[index].getFullYear()}`;
    }
    builder += `</p>`;
    builder += `</div>`;
    builder += `</div>`;
    builder += `</div>`;
    return builder;
  }

});

function getDateDifference(d1, d2) {
  return Math.abs(d1 - d2);
}