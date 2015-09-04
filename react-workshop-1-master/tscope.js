(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./src/tscope');

},{"./src/tscope":2}],2:[function(require,module,exports){
// Creates a shallow copy of source object
function copyObject(source) {
  var copy = {};
  for (var prop in source) {
    copy[prop] = source[prop];
  }
  return copy;
}

var Tscope = {o:{}};

Tscope.makeLens = function(getter, setter){
  var f = function(){
    if (arguments.length == 1) {
      return getter.apply(this, arguments);
    } 
    else if(arguments.length == 2) {
      return setter.apply(this, arguments);
    };
  };

  f.get = getter; // l(a) = l.get(a);
  f.set = setter; // l(a, val) = l.set(a,val);
  
  f.mod = function (a, f) { 
    var _val = getter(a);
    if (!Array.isArray(_val)){
      return setter(a, f(_val)); 
    } 
    else {
      return setter(a, _val.map(f));
    }
  };

  f.then = function() {
    return Array.prototype.slice.call(arguments, 0).reduce(function(lens1, lens2){
      return Tscope.makeLens(
        function(a) {
          var _a = lens1(a);
          return lens2(_a);
        },
        function(a, val) {
          var _a = lens1(a);
          var _val = lens2(_a, val);
          return lens1(a, _val);
        }
      );
    });
  }.bind(null, f);

  return f;
};

Tscope.at = function(i) {
  var _l = Tscope.makeLens(
    function(a) {
      return a[i];
    },
    function(a, val) {
      var _a = a.slice(0);
      _a[i] = val;
      return _a;
    }
  );
  
  return _l;
};

Tscope.attr = function(name) {
  var createLens = function (name) {
    if (Tscope.o.hasOwnProperty(name)) {
      return Tscope.o[name];
    };

    var _l = Tscope.makeLens(
      function(a) {
        return a[name];
      },
      function(a, val) {
        var o = copyObject(a || {});
        o[name] = val;
        return o;
      }
    );

    return _l;
  }

  var l = createLens(name);

  if (arguments.length == 1) {
    return l;
  } 
  else {
    return Array.prototype.slice.call(arguments, 1).reduce(function(lens, name){
      return lens.then(createLens(name));
    }, l);
  }
};

Tscope.traversed = function(lens){
  var _l = Tscope.makeLens(
    function(xs) {
      return xs.map(function(x){return lens(x)});
    },
    function(xs, vals) {
      if (!Array.isArray(vals)){
        return xs.map(function(x){return lens(x, vals)});
      }
      else {
        return xs.map(function(x,i){return lens(x, vals[i])});
      }
    }
  );

  return _l;
}

Tscope.full = Tscope.makeLens(
  function(a) {return a},
  function(a, val) {return val}
);


/// Cursors
Tscope.makeCursor = function(getter, setter, lens) {
  lens = lens || Tscope.full;

  var c = function(value) {
    if (arguments.length === 0) {
      return c.get()
    } else {
      return c.set(value);
    }
  }
  c.get = function() {
    return lens(getter());
  };
  c.set = function(value) {
    return setter(lens(getter(), value));
  }
  c.mod = function(f) {
    return c.set(f(c.get()));
  }

  c.then = function() {
    return Tscope.makeCursor(getter, setter, lens.then.apply(null, arguments));
    // var lenses = [].slice.call(arguments);
    // return Tscope.makeCursor(getter, setter, lens.then.call(lens, lenses));
  }

  return c;
}

Tscope.dataCursor = function(data, lens) {
  return Tscope.makeCursor(
    function(){return data},
    function(value){data = value},
    lens
  )
}


module.exports = Tscope;
if(typeof window == "object") {
  window.Tscope = Tscope;
}

},{}]},{},[1])
