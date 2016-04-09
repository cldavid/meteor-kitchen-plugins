var kitchen = require("meteor-kitchen");
var component = kitchen.getInput();

component.html = '';
component.html += '<template name="TEMPLATE_NAME">';
component.html += '<select id=\"device_list-select\">';
component.html += ' <option disabled=\"disabled\" selected=\"selected\">Please Select</option>';
component.html += '     {{#each device_list}}';
component.html += '     <option value=\"{{this}}\">{{this}}</option>';
component.html += '     {{/each}}';
component.html += '</select>';
component.html += '<select id=\"sensor_list-select\">';
component.html += ' <option disabled=\"disabled\" selected=\"selected\">Please Select</option>';
component.html += '     {{#each sensor_list}}';
component.html += '     <option value=\"{{this}}\">{{this}}</option>';
component.html += '     {{/each}}';
component.html += '</select>';
component.html += '<h3>Temperature</h3>{{> c3 data=tempChart}}';
component.html += '</template>';
component.js = function () {
    Template.TEMPLATE_NAME.helpers({
        device_list: function(){
            var data    = Devices.find().fetch();
            var devices = _.pluck(data, 'device');
            return _.uniq(devices);
        },
        sensor_list: function() {
            return;
        },
        tempChart: function() {
            var colX = ['x'];
            var colY = ['t1'];
            var data = Measurements.find({topic: 'Measurements/Devices/arduino01/Sensors/1'}).fetch();
            var msg   = _.pluck(data, 'message');
            var dates = _.pluck(data, 'createdAt');
            _.each(dates, function(f) {
                colX.push(f);
            });
            _.each(msg, function(g) {
                colY.push(parseInt(g));
            });
        return {
          data: {
            x: 'x',
            xFormat: '%Y-%m-%d %H:%M:%S.%LZ',
            columns: [colX, colY],
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

    Template.TEMPLATE_NAME.events({
            "change #device_list-select": function (event, template) {
                var device = $(event.currentTarget).val();
                var data    = Devices.find({device: device}).fetch();
                var sensors = _.pluck(data, 'sensor');

                var sensorsList = document.getElementById('sensor_list-select');
                if (sensorsList == null) {
                  alert('list box is null');
                  return;
                }
                sensorsList.options.length = 0;
                var opt = document.createElement('option');
                opt.innerHTML = "Please Select";
                opt.disabled = true;
                opt.selected = true;
                sensorsList.appendChild(opt);
                _.each(sensors, function(sensor) {
                  var opt = document.createElement('option');
                  opt.value = sensor;
                  opt.innerHTML = sensor;
                  sensorsList.appendChild(opt);
                });
            },
            "change #sensor_list-select": function (event, template) {
                var category = $(event.currentTarget).val();
                console.log("sensor_list : " + category);
            }

    });
};

kitchen.setOutput(component);
