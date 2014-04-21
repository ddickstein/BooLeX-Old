class Gate extends Device
  constructor: (@numIns, @numOuts) ->
    super(@numIns, @numOuts, Gate)

  @registerType: (gateClass) ->
    @types.push(gateClass)

  # helper function to create a Gate's DisplayObject. Helps to easily build toolbox display.
  @createGraphics: (device) ->
    container = new createjs.Container()
    bitmap = new createjs.Bitmap(@bitmap)
    bitmap.x = -$gateSize * 0.5
    bitmap.y = -$gateSize * 0.5
    container.addChild(bitmap)
    box = new createjs.Shape()
    box.graphics.beginFill(createjs.Graphics.getRGB(255,0,0));
    box.graphics.rect(0, 0, $gateSize, $gateSize)
    box.x = -$gateSize * 0.5
    box.y = -$gateSize * 0.5
    container.hitArea = box
    container

  createDSL: ->
    # abstract method, must be overrided

  @createDSL: ->
    inputs = []
    unless Gate.all?
      return "circuit main()\nend"
    for gate in Gate.all
      for socket in gate.inputSockets
        if socket.wires.length < 1
          inputs.push(socket)
    dsl = "circuit main(#{[s.name for s in inputs].join(', ')})\n"
    for gate in @all
      dsl += '  ' + gate.createDSL() + '\n'
    outs = $.grep(Socket.all, (socket) -> socket.type == 'out' && !socket.connectedToGate())
    dsl += '  out ' + [socket.name for socket in outs].join(', ') + '\n'
    dsl += 'end'
    dsl

  @displayName: 'GATE'
  @bitmap: "" # path to png file with gate graphic TODO

  @types: []

class AndGate extends Gate

  constructor: ->
    super(2, 1)

  createDSL: ->
    in1 = @inputSockets[0]
    in2 = @inputSockets[1]
    out = @outputSockets[0]
    "#{out.name} = #{in1.name} * #{in2.name}"

  @displayName: 'AND'
  @bitmap: '/assets/images/and_gate.png'


class OrGate extends Gate

  constructor: ->
    super(2, 1)

  createDSL: ->
    in1 = @inputSockets[0]
    in2 = @inputSockets[1]
    out = @outputSockets[0]
    "#{out.name} = #{in1.name} + #{in2.name}"

  @displayName: 'OR'
  @bitmap: '/assets/images/or_gate.png'


class NotGate extends Gate

  constructor: ->
    super(1, 1)

  createDSL: ->
    in1 = @inputSockets[0]
    out = @outputSockets[0]
    "#{out.name} = #{in1.name}'"

  @displayName: 'NOT'
  @bitmap: '/assets/images/not_gate.png'


class XorGate extends Gate

  constructor: ->
    super(2, 1)

  createDSL: ->
    in1 = @inputSockets[0]
    in2 = @inputSockets[1]
    out = @outputSockets[0]
    "#{out.name} = #{in1.name} ^ #{in2.name}"

  @displayName: 'XOR'
  @bitmap: '/assets/images/xor_gate.png'

class NandGate extends Gate

  constructor: ->
    super(2, 1)

  createDSL: ->
    in1 = @inputSockets[0]
    in2 = @inputSockets[1]
    out = @outputSockets[0]
    "#{out.name} = #{in1.name} nand #{in2.name}"

  @displayName: 'NAND'
  @bitmap: '/assets/images/nand_gate.png'

class NorGate extends Gate

  constructor: ->
    super(2, 1)

  createDSL: ->
    in1 = @inputSockets[0]
    in2 = @inputSockets[1]
    out = @outputSockets[0]
    "#{out.name} = #{in1.name} nor #{in2.name}"

  @displayName: 'NOR'
  @bitmap: '/assets/images/nor_gate.png'

class XnorGate extends Gate

  constructor: ->
    super(2, 1)

  createDSL: ->
    in1 = @inputSockets[0]
    in2 = @inputSockets[1]
    out = @outputSockets[0]
    "#{out.name} = #{in1.name} xnor #{in2.name}"

  @displayName: 'XNOR'
  @bitmap: '/assets/images/xnor_gate.png'

class BufferGate extends Gate

  constructor: ->
    super(1, 1)

  createDSL: ->
    in1 = @inputSockets[0]
    out = @outputSockets[0]
    "#{out.name} = #{in1.name}"

  @displayName: 'BUFF'
  @bitmap: '/assets/images/buffer_gate.png'

Gate.registerType(AndGate)
Gate.registerType(OrGate)
Gate.registerType(NotGate)
Gate.registerType(XorGate)
Gate.registerType(NandGate)
Gate.registerType(NorGate)
Gate.registerType(XnorGate)
Gate.registerType(BufferGate)