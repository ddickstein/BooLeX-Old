(function() {
  var SevenSegment,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SevenSegment = (function(_super) {

    __extends(SevenSegment, _super);

    SevenSegment.height = $gateSize * 2;

    function SevenSegment() {
      this.segments = [];
      SevenSegment.__super__.constructor.call(this, 7, 0);
    }

    SevenSegment.prepareSegments = function() {
      var baseX, baseY, digitHeight, digitWidth, i, paddingRatio, segmentLength, segmentPadding, segmentPaddingCartesian, segmentRatio, segmentThickness, segments, thicknessRatio, _i;
      baseX = -10;
      baseY = -18;
      digitHeight = $gateSize / 5;
      thicknessRatio = 0.5;
      paddingRatio = 0.2;
      segmentRatio = 0.3;
      digitWidth = digitHeight / 2;
      segmentThickness = digitHeight * thicknessRatio;
      segmentPadding = digitHeight * paddingRatio;
      segmentLength = segmentThickness / segmentRatio;
      segmentPaddingCartesian = segmentPadding * Math.sqrt(2) / 2;
      segments = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; _i <= 6; i = ++_i) {
          _results.push(new createjs.Shape());
        }
        return _results;
      })();
      segments[0].angle = 0;
      segments[1].angle = 90;
      segments[2].angle = 90;
      segments[3].angle = 0;
      segments[4].angle = 90;
      segments[5].angle = 90;
      segments[6].angle = 0;
      for (i = _i = 0; _i <= 6; i = ++_i) {
        segments[i].graphics.clear();
        segments[i].graphics.beginFill('#000');
        if (!segments[i].angle) {
          segments[i].graphics.moveTo(0, segmentThickness / 2);
          segments[i].graphics.lineTo(segmentThickness / 2, 0);
          segments[i].graphics.lineTo(segmentLength - segmentThickness / 2, 0);
          segments[i].graphics.lineTo(segmentLength, segmentThickness / 2);
          segments[i].graphics.lineTo(segmentLength - segmentThickness / 2, segmentThickness);
          segments[i].graphics.lineTo(segmentThickness / 2, segmentThickness);
          segments[i].graphics.lineTo(0, segmentThickness / 2);
        } else {
          segments[i].graphics.moveTo(segmentThickness / 2, 0);
          segments[i].graphics.lineTo(0, segmentThickness / 2);
          segments[i].graphics.lineTo(0, segmentLength - segmentThickness / 2);
          segments[i].graphics.lineTo(segmentThickness / 2, segmentLength);
          segments[i].graphics.lineTo(segmentThickness, segmentLength - segmentThickness / 2);
          segments[i].graphics.lineTo(segmentThickness, segmentThickness / 2);
          segments[i].graphics.lineTo(segmentThickness / 2, 0);
        }
      }
      segments[0].x = baseX + segmentThickness / 2 + segmentPaddingCartesian;
      segments[0].y = baseY;
      segments[1].x = segments[0].x + segmentLength - segmentThickness / 2 + segmentPaddingCartesian;
      segments[1].y = baseY + segmentThickness / 2 + segmentPaddingCartesian;
      segments[2].x = segments[1].x;
      segments[2].y = segments[1].y + segmentLength + 2 * segmentPaddingCartesian;
      segments[3].x = segments[0].x;
      segments[3].y = segments[2].y + segmentLength - segmentThickness / 2 + segmentPaddingCartesian;
      segments[4].x = baseX;
      segments[4].y = segments[2].y;
      segments[5].x = baseX;
      segments[5].y = segments[1].y;
      segments[6].x = segments[0].x;
      segments[6].y = segments[1].y + segmentLength - segmentThickness / 2 + segmentPaddingCartesian;
      return segments;
    };

    SevenSegment.createGraphics = function(device) {
      var box, container, segment, segments, _i, _len;
      container = new createjs.Container();
      box = new createjs.Shape();
      box.graphics.beginFill('#fff');
      box.graphics.rect(0, 0, $gateSize, this.height);
      box.x = -$gateSize * 0.5;
      box.y = -$gateSize;
      container.hitArea = box;
      segments = this.prepareSegments();
      if (device) {
        device.segments = segments;
      }
      for (_i = 0, _len = segments.length; _i < _len; _i++) {
        segment = segments[_i];
        container.addChild(segment);
      }
      return container;
    };

    SevenSegment.prototype.draw = function() {
      var i, _i, _results;
      _results = [];
      for (i = _i = 0; _i <= 6; i = ++_i) {
        _results.push(this.segments[i].alpha = Socket.states[this.inputSockets[i].name] === 'on' ? 1 : 0.2);
      }
      return _results;
    };

    SevenSegment.displayName = 'CHAR';

    SevenSegment.bitmapOffPath = '/assets/images/lightbulb_off.png';

    SevenSegment.bitmapOnPath = '/assets/images/lightbulb_on.png';

    return SevenSegment;

  })(IODevice);

  IODevice.registerType(SevenSegment);

}).call(this);
