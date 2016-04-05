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
component.html += '</template>';
component.js = function () {

    Template.TEMPLATE_NAME.helpers({
        device_list: function(){
            var data    = Devices.find({device: "arduino01"}).fetch();
            var devices = _.pluck(data, 'device');
            return _.uniq(devices);
        }
    });

    Template.TEMPLATE_NAME.events({
            "change #device_list-select": function (event, template) {
                var category = $(event.currentTarget).val();
                console.log("log: device_list : " + category);
            }
    });
};

kitchen.setOutput(component);

