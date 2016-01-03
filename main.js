var Bangla = function (options) {
    var self = this;

    if (!options.delimiters) {
        self.delimiters = ["{{", "}}"];
    } else {
        self.delimiters = options.delimiters;
    }

    self.mainElement = document.querySelector(options.el);
    self.data = options.data;
    self.modelNodes = [];

    self.grabModelNodes();

    self.loadModelDataToElements(self.data);

    self.mainElement.addEventListener("keyup", function(e) {
        if (e.target !== e.currentTarget) {
            var currentElementModel = e.target.getAttribute('b-model');

            if (self.data.hasOwnProperty(currentElementModel)) {
                self.data[currentElementModel] = e.target.value;

                self.renderModel(currentElementModel);
                self.loadModelDataToElements(self.data);
            }
        }

        e.stopPropagation();

    }, false);

}

Bangla.prototype = {
    grabModelNodes: function() {
        var self = this;

        if (self.mainElement.hasChildNodes()) {

            [].forEach.call(self.mainElement.childNodes, function(node) {
                if (node.nodeValue != null) {
                    var value = node.nodeValue.trim();

                    for(model in self.data) {
                        var regex = new RegExp(self.delimiters[0] + '\\s*' + model + '\\s*' + self.delimiters[1], 'g');

                        if (value.match(regex) && value != null) {

                            if (self.modelNodes.hasOwnProperty(model)) {
                                var data = [];
                                data = self.modelNodes[model];
                                data.push(node);
                            } else {
                                var data = [];
                                data.push(node);
                            }

                            self.modelNodes[model] = data;
                        }
                    }
                }
            });
        }
    },
    loadModelDataToElements: function(models) {
        var self = this;

        for(model in models) {
            var modelElements = self.mainElement.querySelectorAll("[b-model='" + model + "']");

            [].forEach.call(modelElements, function(element) {
                element.value = models[model];
            });

            self.renderModel(model);
        }
    },
    renderModel: function(model) {
        var self = this;

        var oldData = self.appInnerHTML;

        var open = self.delimiters[0];
        var close = self.delimiters[1];

        var regex;
        var newData;

        if (typeof model === 'string' && self.modelNodes[model]) {
            self.modelNodes[model].forEach(function(node) {
                node.nodeValue = self.data[model];
            });
        }
    }
};