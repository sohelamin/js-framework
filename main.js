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

    var timeout;
    self.mainElement.addEventListener("keyup", function(e) {
        if (e.target !== e.currentTarget) {

            // Execute the listener
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

            var nodes = self.mainElement.childNodes;
            var value, regex, docFragment;

            // Split the matched textNode into multiple nodes
            [].forEach.call(self.mainElement.childNodes, function(node) {
                if (node.nodeValue != null) {
                    value = node.nodeValue.trim();

                    for(model in self.data) {
                        regex = new RegExp(self.delimiters[0] + '\\s*' + model + '\\s*' + self.delimiters[1], 'g');

                        if (value.match(regex) && value != null) {
                            highlightNodeText(self.mainElement, node, regex);
                        }
                    }
                }
            });

            // Store the node for interaction
            [].forEach.call(self.mainElement.childNodes, function(node) {
                if (node.nodeValue != null) {
                    value = node.nodeValue.trim();

                    for(model in self.data) {
                        regex = new RegExp(self.delimiters[0] + '\\s*' + model + '\\s*' + self.delimiters[1], 'g');

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

        if (typeof model === 'string' && self.modelNodes[model]) {
            self.modelNodes[model].forEach(function(node) {
                node.nodeValue = self.data[model];
            });
        }
    }
};

/**
 * Helpers function start here
 */
function strpos (haystack, needle, offset) {
    var i = (haystack+'').indexOf(needle, (offset || 0));

    return i === -1 ? false : i;
}

function highlightNodeText(mainElement, node, keywords) {
    var text = node.textContent;
    node.textContent = ""; // Clear the node
    var match, pos = 0;
    var before, beforeNode, after, afterNode, targetNode;

    var docFragment = document.createDocumentFragment();

    while (match = keywords.exec(text)) {
        before = text.slice(pos, match.index);
        pos = keywords.lastIndex;
        after = text.slice(pos);

        beforeNode = document.createTextNode(before);
        targetNode = document.createTextNode(match[0]);
        afterNode = document.createTextNode(after);

        docFragment.appendChild(beforeNode);
        docFragment.appendChild(targetNode);
    }

    if (afterNode) {
        docFragment.appendChild(afterNode);
        node.parentNode.replaceChild(docFragment, node);
    }

}
