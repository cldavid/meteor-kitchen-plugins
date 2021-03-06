var kitchen = require("meteor-kitchen");
var component = kitchen.getInput();

component.html = '';
component.html += '<template name="TEMPLATE_NAME">';
component.html += '<h3>Temperature</h3>{{> c3 data=tempChart}}';
component.html += '</template>';
component.js = function () {
  function getSensorData(lastHours) {
    var logData = [];
    var xsData  = {};
    var curDate = new Date();
    curDate.setTime(curDate.getTime()-(lastHours*3600*1000));

    var data    = Devices.find().fetch();
    devices     = _.pluck(data, 'device');
    devices     = _.uniq(devices);

    _.each(devices, function(device) {
      data        = Devices.find({device: device}).fetch();
      var sensors = _.pluck(data, 'sensor');
      sensors     = _.uniq(sensors);

      _.each(sensors, function(sensor_no) {
        data      = Measurements24h.find({topic: 'Devices/' + device + '/Sensors/' + sensor_no, createdAt: {$gt: curDate}}).fetch();
        var xName   = 'x-' + sensor_no;
        var yName   = device + '/' + sensor_no;
        var item1   = new Array(xName);
        var item2   = new Array(yName);

        data.forEach(function(item) {
            item1.push(item.createdAt);
            item2.push(parseFloat((item.sum / item.nmeasurements)));
            console.log(item.createdAt);
        });
        logData.push(item1);
        logData.push(item2);
        xsData[yName] = xName;
      });
    });
  return {
    data: {
      xs: xsData,
      xFormat: '%Y-%m-%d %H:%M:%S.%LZ',
      columns: logData,
      type: 'area-spline',
    },
    subchart: { show: false},
    axis: {
      x: {
        type: 'timeseries',
        localtime: false,
        tick: {
          count: 20,
          format: '%Y-%m-%d %H:%M:%S'
        }
      }
    }
    };
  }

  Template.TEMPLATE_NAME.helpers({
      tempChart: function () {
        var data = getSensorData(6);
        return(data);
      }
    });
};

kitchen.setOutput(component);
