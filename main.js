(function() {
  $(document).ready(function() {
    var startTime = Date.now();
    var totalRecved = 0, lstRecved = 0, lstTime = Date.now();
    var __interval;
    $.ajax({
      xhr: function() {
        var xhr = new window.XMLHttpRequest();
        xhr.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            totalRecved = evt.loaded;
            $("#download_progress").css("width", Math.round(percentComplete * 100) + "%");
          }
        }, false);
        return xhr;
      },
      type: 'GET',
      url: "/1g.test",
      data: {},
      success: function(data){
        $("#download_progress").removeClass("progress-bar-animated");
        $("#download_status").text("Complete");
        $("#download_message").text(
          "In " + Math.round((Date.now() - startTime) / 1000) + " seconds. " +
          Math.round(totalRecved / (Date.now() - startTime) * 1000 / 1024 / 1024 * 100) / 100 + " MB/s or " +
          Math.round(totalRecved / (Date.now() - startTime) * 1000 / 1024 / 1024 * 8 * 100) / 100 + " Mbps"
        );
        clearInterval(__interval);
      }
    });
    var data = {
      labels: [],
      datasets: [
        {
          label: "Speed",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [],
          spanGaps: false,
        }
      ]
    };
    var speedChart = Chart.Line($("#speedChart"), {
      data: data,
      options: {
        responsive: true
      }
    });
    __interval = setInterval(function() {
      var __now = Date.now();
      $("#download_message").text(
        Math.round((totalRecved - lstRecved) / (__now - lstTime) * 1000 / 1024 / 1024 * 100) / 100 + " MB/s or " +
        Math.round((totalRecved - lstRecved) / (__now - lstTime) * 1000 / 1024 / 1024 * 8 * 100) / 100 + " Mbps"
      );
      speedChart.data.datasets[0].data.push((totalRecved - lstRecved) / (__now - lstTime) * 1000 / 1024);
      speedChart.data.labels.push(((__now - startTime) / 1000).toString());
      speedChart.data.datasets[0].data = _.takeRight(speedChart.data.datasets[0].data, 50);
      speedChart.data.labels = _.takeRight(speedChart.data.labels, 50);
      lstTime = __now;
      lstRecved = totalRecved;

      speedChart.update();
    }, 200);
  });
})();