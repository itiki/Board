define(function (require, exports) {

    exports.addLoadEvent = function () {
        var oldonload = window.onload
        if (typeof window.onload != 'function') {
            window.onload = func;
        } else {
            window.onload = function () {
                oldonload();
                func();
            }
        }
    }

    exports.addClass = function addClass(element, value) {
        if (!element.className) {
            element.className = value;
        } else {
            element.className += " ";
            element.className += value;
        }
    }

    exports.insertAfter = function insertAfter(newElement, targetElement) {
        var parent = targetElement.parentNode;
        if (parent.lastChild == targetElement) {
            parent.appendChild(newElement);
        } else {
            parent.insertBefore(newElement, targetElement.nextSibling);
        }
    }

    exports.getNextElement = function (node) {
        if (node.nodeType == 1) return node; if (node.nextSibling) {
            return getNextElement(node.nextSibling);
        }
    }

});