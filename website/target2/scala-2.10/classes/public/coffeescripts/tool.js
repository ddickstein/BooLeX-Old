(function() {
  var Tool;

  Tool = (function() {

    function Tool(deviceClass, index) {
      this.deviceClass = deviceClass;
      this.index = index;
      this.graphics = new createjs.Container();
      this.graphics.addChild(deviceClass.createGraphics());
      this.graphics.on('mousedown', function(e) {
        var newGate, _ref;
        newGate = new deviceClass();
        _ref = (function(coord) {
          return [coord.x, coord.y];
        })(this.localToGlobal(0, 0)), newGate.graphics.x = _ref[0], newGate.graphics.y = _ref[1];
        return newGate.startDrag(e);
      });
    }

    return Tool;

  })();

}).call(this);
