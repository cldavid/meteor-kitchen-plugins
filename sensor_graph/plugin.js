var kitchen = require("meteor-kitchen");
var component = kitchen.getInput();

component.html = '';
component.html += '<template name="TEMPLATE_NAME">';
component.html += '<h3>Temperature</h3>{{> c3 data=tempChart}}';
component.html += '</template>';
component.js = function () {
    Template.TEMPLATE_NAME.helpers({
        tempChart: function() {
            var logData = [];
            var data    = Devices.find().fetch();
            devices     = _.pluck(data, 'device');
            devices     = _.uniq(devices);

            _.each(devices, function(device) {
              data        = Devices.find({device: device}).fetch();
              var sensors = _.pluck(data, 'sensor');
              sensors     = _.uniq(sensors);

              _.each(sensors, function(sensor_no) {
                data      = Measurements.find({topic: 'Measurements/Devices/' + device + '/Sensors/' + sensor_no}).fetch();
                var msg   = _.pluck(data, 'message');
                var dates = _.pluck(data, 'createdAt');

                var item   = new Array('x-' + sensor_no);
                _.each(dates, function(f) {
                    item.push(f);
                });
                logData.push(item);

                var item  = new Array(device + '/' + sensor_no);
                _.each(msg, function(g) {
                    item.push(parseInt(g));
                });
                logData.push(item);

              });
            });
        return {
          data: {
            xs: {
              'arduino01/1': 'x-1',
              'arduino01/2': 'x-2',
              'arduino01/3': 'x-3',
              'arduino01/4': 'x-4',
              'arduino01/5': 'x-5',
              'arduino01/6': 'x-6',
              'arduino01/7': 'x-7',
              'arduino01/8': 'x-8',
              'arduino01/9': 'x-9',
              'arduino01/10': 'x-10',
            },
            xFormat: '%Y-%m-%d %H:%M:%S.%LZ',
            columns: logData,
            type: 'spline',
          },
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
    });
};

kitchen.setOutput(component);
