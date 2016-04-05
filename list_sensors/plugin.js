var kitchen = require("meteor-kitchen");
var component = kitchen.getInput();

component.html = '';
component.html += '<template name="TEMPLATE_NAME">';
component.html += '<select id=\"sensor_list-select\">';
component.html += ' <option disabled=\"disabled\" selected=\"selected\">Please Select</option>';
component.html += '     {{#each sensor_list}}';
component.html += '     <option value=\"{{this}}\">{{this}}</option>';
component.html += '     {{/each}}';
component.html += '</select>';
component.html += '</template>';
component.js = function () {

    Template.TEMPLATE_NAME.helpers({
        sensor_list: function(){
            var data    = Devices.find({device: "arduino01"}).fetch();
            var sensors = _.pluck(data, 'sensor');
            return sensors; 
        }
    });

    Template.TEMPLATE_NAME.events({
            "change #sensor_list-select": function (event, template) {
                var category = $(event.currentTarget).val();
                console.log("sensor_list : " + category);
            }
    });
};

kitchen.setOutput(component);

