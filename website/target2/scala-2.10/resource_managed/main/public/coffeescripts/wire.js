(function() {
  var Wire,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Wire = (function(_super) {

    __extends(Wire, _super);

    function Wire(fromSocket, toSocket) {
      this.fromSocket = fromSocket;
      this.toSocket = toSocket;
      this.stopDrag = __bind(this.stopDrag, this);

      this.drag = __bind(this.drag, this);

      this.startDrag = __bind(this.startDrag, this);

      this.initGraphics();
      this.target = null;
      Wire.__super__.constructor.call(this);
      if ((this.fromSocket != null) && (this.toSocket != null)) {
        Socket.connect(this.fromSocket, this.toSocket, this);
      } else if (this.fromSocket != null) {
        this.startSocket = this.fromSocket;
        this.endSocket = 'toSocket';
      } else if (this.toSocket != null) {
        this.startSocket = this.toSocket;
        this.endSocket = 'fromSocket';
      }
    }

    Wire.prototype.initGraphics = function() {
      this.graphics = new createjs.Container();
      this.line = new createjs.Shape();
      this.graphics.addChild(this.line);
      this.line.snapToPixel = true;
      return window.boolexStage.addChild(this.graphics);
    };

    Wire.prototype.startDrag = function(e) {
      var startSocketPos;
      this.line.graphics.clear();
      startSocketPos = this.startSocket.graphics.localToGlobal(0, 0);
      this.drawTo(startSocketPos.x, startSocketPos.y, e.stageX, e.stageY);
      return boolexStage.dragged = this;
    };

    Wire.prototype.drag = function(e) {
      var socket, startSocketPos, _i, _len, _ref, _results;
      startSocketPos = this.startSocket.graphics.localToGlobal(0, 0);
      this.line.graphics.moveTo(startSocketPos.x, startSocketPos.y);
      if (this.target != null) {
        this.drawTo(startSocketPos.x, startSocketPos.y, this.target.x(), this.target.y());
      } else {
        this.drawTo(startSocketPos.x, startSocketPos.y, e.stageX, e.stageY);
      }
      this.target = null;
      _ref = Socket.all;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        socket = _ref[_i];
        if (distance(socket.x(), socket.y(), e.stageX, e.stageY) < $socketSize * 2) {
          if (socket.type !== this.startSocket.type) {
            if (!(socket.type === 'in' && socket.wires.length)) {
              this.target = socket;
              break;
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Wire.prototype.drawTo = function(x1, y1, x2, y2) {
      this.line.graphics.clear();
      if (this.fromSocket && Socket.states[this.fromSocket.name] === 'on' && $openConnection) {
        this.line.shadow = new createjs.Shadow("#00aaff", 0, 0, 5);
      } else {
        this.line.shadow = null;
      }
      this.line.graphics.beginStroke('black');
      this.line.graphics.moveTo(x1, y1);
      if (x1 < x2) {
        this.line.graphics.lineTo((x2 + x1) * 0.5, y1);
        this.line.graphics.lineTo((x2 + x1) * 0.5, y2);
        return this.line.graphics.lineTo(x2, y2);
      } else {
        this.line.graphics.lineTo(x1 + 30, y1);
        this.line.graphics.lineTo(x1 + 30, (y1 + y2) * 0.5);
        this.line.graphics.lineTo(x2 - 30, (y1 + y2) * 0.5);
        this.line.graphics.lineTo(x2 - 30, y2);
        return this.line.graphics.lineTo(x2, y2);
      }
    };

    Wire.prototype.stopDrag = function(e) {
      if (this.target) {
        this[this.endSocket] = this.target;
        Socket.connect(this.fromSocket, this.toSocket, this);
        return $(window).trigger('refreshDSL');
      } else {
        return this.destroy();
      }
    };

    Wire.prototype.redraw = function() {
      var fromSocketPos, toSocketPos;
      fromSocketPos = this.fromSocket.graphics.localToGlobal(0, 0);
      if (!this.toSocket) {
        return;
      }
      toSocketPos = this.toSocket.graphics.localToGlobal(0, 0);
      return this.drawTo(fromSocketPos.x, fromSocketPos.y, toSocketPos.x, toSocketPos.y);
    };

    Wire.prototype.destroy = function() {
      var id;
      window.boolexStage.removeChild(this.graphics);
      id = this.id;
      if (this.fromSocket) {
        this.fromSocket.wires = $.grep(this.fromSocket.wires, function(wire) {
          return wire.id !== id;
        });
      }
      if (this.toSocket) {
        this.toSocket.wires = $.grep(this.toSocket.wires, function(wire) {
          return wire.id !== id;
        });
      }
      return Wire.__super__.destroy.call(this);
    };

    return Wire;

  })(Collectable);

}).call(this);
