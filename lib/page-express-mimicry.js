function NotImplementedError(message) {
    if (!this instanceof NotImplementedError) return function () {
        throw new NotImplementedError(message)
    };
    this.name = "NotImplementedError";
    this.message = message || null;
}
NotImplementedError.prototype = new Error;
NotImplementedError.prototype.toString = function () {
    var errorText = 'NotImplementedError';
    if (this.message) errorText += ': ' + this.message;
    return errorText;
};


var page = require('page'),
    map = page.locals = {};

function mimicryResponse() {
    this.locals = {};
}


var LCSdiff = require('./LCSdiff');


mimicryResponse.prototype = {
    'status': NotImplementedError,
    'set': NotImplementedError,
    'get': NotImplementedError,
    'cookie': NotImplementedError,
    'clearCookie': NotImplementedError,
    'redirect': function (path) {
        if (path == path.toString()) return page(path);
        throw new TypeError;
    },
    'location': NotImplementedError,
    'send': function (data) {
        var virtualDOMTree = document.createElement('html');
        virtualDOMTree.innerHTML = data;
        ['head', 'body'].forEach(function (tagName) {
            var virtualRoot = virtualDOMTree.querySelector(tagName),
                realRoot = document.querySelector(tagName);
            console.log(document.querySelectorAll(tagName));
            if (!realRoot) {
                document.documentElement.appendChild(realRoot = document.createElement(tagName));
            }
            var diff = LCSdiff(realRoot.childNodes, virtualRoot.childNodes);

            diff.remove.forEach(function (record) {
                record.remove();
            });
            diff.addGrouped.forEach(function (record) {
                var html = record.elements.map(function (el) {
                    return el.outerHTML
                }).join('');
                if (record.prev) {
                    window.prev = record.prev;
                    window.text = html;
                    record.prev.insertAdjacentHTML('afterend', html);
                }
                else {
                    realRoot.insertAdjacentHTML('afterbegin', html);
                }
            });
            virtualRoot.remove();
        });
        virtualDOMTree.remove();
    },
    'json': NotImplementedError,
    'jsonp': NotImplementedError,
    'type': NotImplementedError,
    'format': NotImplementedError,
    'attachment': NotImplementedError,
    'sendfile': NotImplementedError,
    'download': NotImplementedError,
    'links': NotImplementedError,
    'render': function () {
        var args = Array.prototype.slice.call(arguments), cb;
        if (args[args.length - 1].call) {
            cb = args.pop();
        } else {
            cb = function (err, data) {
                if (err) throw new Error(err);
                this.send(data);
            }.bind(this);
        }
        var view = args.shift(),
            vars = args[0] || this.locals || {},
            engineName = view.split('.').slice(1).reverse()[0] || 'default',
            engine = mimicry.get('engines')[engineName] || mimicry.get('engines')[mimicry.get('view engine')];
        engine(view, vars, cb);
    }
};
var mimicryEngine = {
        getValue: function (name) {
            return map[name];
        },
        setValue: function (name, value) {
            map[name] = value;
        },
        routerMiddleware: function () {
            var args = Array.prototype.slice.call(arguments),
                callback = args.pop(),
                route = args[0] || '*';
            if (!callback.call) throw new TypeError;
            page(route, function (ctx, next) {
                try {
                    var res = ctx.res = ctx.res || new mimicryResponse;
                    //todo implement more precise request express mimicry

                    callback(ctx, res, next);
                } catch (e) {
                    document.location.href = document.location.href;
                }
            });
        }

    },
    mimicry = {
        'get': function get() {
            var args = Array.prototype.slice.call(arguments);
            if ((args.length == 1) && (!args[0].call)) return mimicryEngine.getValue(args[0]);
            if (args.length < 3 && args[args.length - 1].call) return mimicryEngine.routerMiddleware.apply(mimicryEngine, arguments);
            throw new NotImplementedError;
        },
        'set': function set(key, value) {
            return mimicryEngine.setValue(key, value);
        },
        'enable': function enable(key) {
            return mimicryEngine.setValue(key, true);
        },
        'enabled': function enabled() {
            return !!mimicryEngine.getValue(key);
        },
        'disable': function disable() {
            return mimicryEngine.setValue(key, false);
        },
        'disabled': function disabled() {
            return !mimicryEngine.getValue(key);
        },
        'use': function use() {
            var args = Array.prototype.slice.call(arguments);
            if (args.length < 3 && args[args.length - 1].call) return mimicryEngine.routerMiddleware.apply(mimicryEngine, arguments);
            throw new NotImplementedError;
        },
        'engine': function engine(ext, cb) {
            if (!this.get('engines')) this.set('engines', {});
            this.get('engines')[ext] = cb;
        }
    };

module.exports = mimicry;
page({
    dispatch: false
});
window.page = page;
