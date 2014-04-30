(function() {
  var IntegratedCircuit,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  IntegratedCircuit = (function(_super) {

    __extends(IntegratedCircuit, _super);

    IntegratedCircuit.height = $gateSize * 2;

    IntegratedCircuit.width = $gateSize * 2;

    function IntegratedCircuit(gates_or_dsl) {
      var allSockets, concatenate, dest, destinationNames, destinations, gate, i, inConnections, inputs, integratedDSL, internalDSL, internalInputSet, internalOutputSet, match, name, outConnections, outputs, setMinus, sock, socket, socks, sourceNames, sources, str, sumX, sumY, x, y, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _len7, _m, _n, _o, _p, _ref, _ref1;
      if (gates_or_dsl instanceof Array) {
        this.gates = gates_or_dsl;
        this.inputSockets = [];
        this.outputSockets = [];
        concatenate = function(items) {
          return [].concat.apply([], items);
        };
        setMinus = function(as, bs) {
          var a, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = as.length; _i < _len; _i++) {
            a = as[_i];
            if ($.inArray(a, bs) < 0) {
              _results.push(a);
            }
          }
          return _results;
        };
        internalInputSet = concatenate((function() {
          var _i, _len, _ref, _results;
          _ref = this.gates;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            gate = _ref[_i];
            _results.push(gate.inputSockets);
          }
          return _results;
        }).call(this)).map(function(inSocket) {
          return inSocket.id;
        });
        internalOutputSet = concatenate((function() {
          var _i, _len, _ref, _results;
          _ref = this.gates;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            gate = _ref[_i];
            _results.push(gate.outputSockets);
          }
          return _results;
        }).call(this)).map(function(outSocket) {
          return outSocket.id;
        });
        allSockets = concatenate([internalInputSet, internalOutputSet]);
        sources = setMinus(concatenate(internalInputSet.map(function(id) {
          var wire, _i, _len, _ref, _results;
          _ref = Socket.find(id).wires;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            wire = _ref[_i];
            _results.push(wire.fromSocket.id);
          }
          return _results;
        })), allSockets).unique();
        destinations = setMinus(concatenate(internalOutputSet.map(function(id) {
          var wire, _i, _len, _ref, _results;
          _ref = Socket.find(id).wires;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            wire = _ref[_i];
            _results.push(wire.toSocket.id);
          }
          return _results;
        })), allSockets).unique();
        sources = sources.sort(function(a, b) {
          return Socket.find(a).y() - Socket.find(b).y();
        });
        destinations = destinations.sort(function(a, b) {
          return Socket.find(a).y() - Socket.find(b).y();
        });
        sourceNames = sources.map(function(x) {
          return Socket.find(x).name;
        }).unique();
        destinationNames = destinations.map(function(x) {
          return Socket.find(x).name;
        }).unique();
        this.name = "ic_" + Math.floor(Math.random() * 100);
        integratedDSL = ("circuit " + this.name + "(") + sourceNames.join(", ") + ")\n    ";
        internalDSL = this.gates.map(function(gate) {
          return gate.createDSL();
        }).join("\n    ");
        integratedDSL += internalDSL + "\n    out " + destinationNames.join(", ") + "\nend";
        IntegratedDSL.saveDSL(this.name, integratedDSL);
        this.dsl = [];
        _ref = this.gates;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          gate = _ref[_i];
          if (gate instanceof IntegratedCircuit) {
            this.dsl.push(gate.name);
          }
        }
        IntegratedDSL.setDependencies(this.name, this.dsl);
        outConnections = [];
        for (i = _j = 0, _len1 = destinationNames.length; _j < _len1; i = ++_j) {
          name = destinationNames[i];
          outConnections[i] = [];
          for (_k = 0, _len2 = destinations.length; _k < _len2; _k++) {
            dest = destinations[_k];
            socket = Socket.find(dest);
            if (socket.name === name) {
              outConnections[i].push(socket);
            }
          }
        }
        inConnections = sources.map(function(x) {
          return [Socket.find(x)];
        });
        sumX = 0;
        sumY = 0;
        _ref1 = this.gates;
        for (_l = 0, _len3 = _ref1.length; _l < _len3; _l++) {
          gate = _ref1[_l];
          sumX += gate.x();
          sumY += gate.y();
          gate.destroy();
        }
        x = sumX / this.gates.length;
        y = sumY / this.gates.length;
        IntegratedCircuit.__super__.constructor.call(this, sourceNames.length, destinationNames.length);
        for (i = _m = 0, _len4 = outConnections.length; _m < _len4; i = ++_m) {
          socks = outConnections[i];
          for (_n = 0, _len5 = socks.length; _n < _len5; _n++) {
            sock = socks[_n];
            new Wire(this.outputSockets[i], sock);
          }
        }
        for (i = _o = 0, _len6 = inConnections.length; _o < _len6; i = ++_o) {
          socks = inConnections[i];
          for (_p = 0, _len7 = socks.length; _p < _len7; _p++) {
            sock = socks[_p];
            new Wire(sock, this.inputSockets[i]);
          }
        }
      } else {
        this.dsl = gates_or_dsl;
        match = /circuit ([a-zA-Z0-9_\-]+)\(([^)]*)\)/m.exec(this.dsl);
        this.name = match[1];
        inputs = (function() {
          var _len8, _q, _ref2, _results;
          _ref2 = match[2].split(',');
          _results = [];
          for (_q = 0, _len8 = _ref2.length; _q < _len8; _q++) {
            str = _ref2[_q];
            _results.push(str.trim());
          }
          return _results;
        })();
        match = /^\s*out ([_a-zA-Z0-9, ]+)$/m.exec(this.dsl);
        outputs = (function() {
          var _len8, _q, _ref2, _results;
          _ref2 = match[1].split(',');
          _results = [];
          for (_q = 0, _len8 = _ref2.length; _q < _len8; _q++) {
            str = _ref2[_q];
            _results.push(str.trim());
          }
          return _results;
        })();
        x = $stageWidth * 0.5;
        y = $stageHeight * 0.5;
        IntegratedDSL.saveDSL(this.name, this.dsl);
        this.dsl = [];
        IntegratedCircuit.__super__.constructor.call(this, inputs.length, outputs.length);
      }
      this.graphics.x = x;
      this.graphics.y = y;
      $(window).trigger('refreshDSL');
    }

    IntegratedCircuit.prototype.randomizeSocketLocalNames = function() {
      var socket, _i, _len, _ref, _results;
      _ref = this.inputSockets.concat(this.outputSockets);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        socket = _ref[_i];
        _results.push(socket.localName = Socket.makeName());
      }
      return _results;
    };

    IntegratedCircuit.createGraphics = function(device) {
      var bounds, box, container, text;
      container = new createjs.Container();
      box = new createjs.Shape();
      box.graphics.beginFill('black').drawRect(0, 0, $gateSize * 2, $gateSize * 2);
      box.graphics.beginFill('white').drawRect(2, 2, $gateSize * 2 - 4, $gateSize * 2 - 4);
      box.x = box.y = -$gateSize;
      container.addChild(box);
      text = new createjs.Text(device.name, '14px Helvetica');
      bounds = text.getBounds();
      text.x = -bounds.width / 2;
      this.constructor.width = bounds.width + 5;
      text.y = -bounds.height / 2;
      container.addChild(text);
      return container;
    };

    IntegratedCircuit.prototype.createDSL = function() {
      var socket;
      return "" + (((function() {
        var _i, _len, _ref, _results;
        _ref = this.outputSockets;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          socket = _ref[_i];
          _results.push(socket.name);
        }
        return _results;
      }).call(this)).join(', ')) + " = " + this.name + "(" + (((function() {
        var _i, _len, _ref, _results;
        _ref = this.inputSockets;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          socket = _ref[_i];
          _results.push(socket.name);
        }
        return _results;
      }).call(this)).join(', ')) + ")";
    };

    IntegratedCircuit.prototype.circuitDSL = function() {
      var gate, integratedCircuits, main, s, socket, _i, _len, _ref;
      if (this.dsl) {
        return this.dsl;
      }
      integratedCircuits = '';
      if (!this.gates) {
        return "circuit " + this.name + "()\nend";
      }
      main = "circuit " + this.name + "(" + (((function() {
        var _i, _len, _ref, _results;
        _ref = this.inputSockets;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          s = _ref[_i];
          _results.push(s.name);
        }
        return _results;
      }).call(this)).unique().join(', ')) + ")\n";
      _ref = this.gates;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        gate = _ref[_i];
        if (gate instanceof IntegratedCircuit) {
          integratedCircuits += gate.circuitDSL() + '\n\n';
        }
        main += '  ' + gate.createDSL() + '\n';
      }
      main += '  out ' + ((function() {
        var _j, _len1, _ref1, _results;
        _ref1 = this.outputSockets;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          socket = _ref1[_j];
          _results.push(socket.name);
        }
        return _results;
      }).call(this)).join(', ') + '\n';
      main += 'end';
      return integratedCircuits + main;
    };

    return IntegratedCircuit;

  })(Gate);

}).call(this);
