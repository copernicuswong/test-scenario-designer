joint.shapes.vpl = {};

// Prototype to allow adding cross button
joint.shapes.vpl.toolElement = joint.shapes.basic.Generic.extend({
    toolMarkup: ['<g class="element-tools">',
        '<g class="element-tool-remove"><circle fill="red" r="11"/>',
        '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
        '<title>Remove this element from the model</title>',
        '</g>',
        '</g>'].join(''),

    defaults: joint.util.deepSupplement({
        attrs: {
            text: { 'font-weight': 400, 'font-size': 'small', fill: 'black', 'text-anchor': 'middle', 'ref-x': .5, 'ref-y': .5, 'y-alignment': 'middle' },
        },
    }, joint.shapes.basic.Generic.prototype.defaults)
});

joint.shapes.vpl.ToolElementView = joint.dia.ElementView.extend({
    initialize: function() {
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);
    },

    render: function () {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
        this.renderTools();
        this.update();
        return this;
    },

    renderTools: function () {
        var toolMarkup = this.model.toolMarkup || this.model.get('toolMarkup');
        if (toolMarkup) {
            var nodes = V(toolMarkup);
            V(this.el).append(nodes);
        }
        return this;
    },

    pointerdblclick: function (evt, x, y) {
        this._dx = x;
        this._dy = y;
        this._action = '';
        var className = evt.target.parentNode.getAttribute('class');
        switch (className) {

            case 'element-tool-remove':
                this.model.remove();
                return;
                break;

            default:
        }
        joint.dia.CellView.prototype.pointerdblclick.apply(this, arguments);
    }
});

/* ==============================================================================================
Objects starting from below are specific to Visual Programming Language
==============================================================================================*/
var vplConst = {
    portRad : 5, // radius
    portDist : 25 // distance
};

joint.shapes.vpl.Block = joint.shapes.vpl.toolElement.extend({
    defaults: joint.util.deepSupplement({
        type: 'vpl.Block',
        size: { width: 50, height: 50 },
        attrs: {
            '.': { magnet: false },
            '.body': { width: 100, height: 100 },
            '.frame': { width: 100, height: 100, 'ref-x': 0, 'ref-y': 0, stroke: 'black', fill: 'transparent', 'stroke-width': 1},
            '.annotation': { ref: '.body', 'font-size': 25, 'font-weight': 'bold', fill: '#0000FF', 'ref-x': 2, 'ref-y': 2},
            '.input':{ r: vplConst.portRad, stroke: 'black', fill: 'green', 'stroke-width': 1 },
            '.output, .trueOutput, .falseOutput':{ r: vplConst.portRad, stroke: 'black', fill: 'blue', 'stroke-width': 1 },
            '.loopBody':{ r: vplConst.portRad, stroke: 'black', fill: 'yellow', 'stroke-width': 1 },
        },
        params: {}
    }, joint.shapes.vpl.toolElement.prototype.defaults),
});

/* base node of start/end node*/
joint.shapes.vpl.Terminal = joint.shapes.vpl.Block.extend({

    markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><path class="wire"/><circle/><text/></g>',

    defaults: joint.util.deepSupplement({

        type: 'vpl.Terminal',
        size: { width: 60, height: 30 },
        attrs: {
            '.body': { fill: 'white', stroke: 'black', 'stroke-width': 2 },
            '.wire': { ref: '.body', 'ref-y': .5, stroke: 'blue' },
            text: {
                fill: 'black',
                ref: '.body', 'ref-x': .5, 'ref-y': .5, 'y-alignment': 'middle',
                'text-anchor': 'middle',
                'font-weight': 'bold',
                'font-variant': 'small-caps',
                'text-transform': 'capitalize',
                'font-size': '14px'
            }
        }

    }, joint.shapes.vpl.Block.prototype.defaults)

});

joint.shapes.vpl.Start = joint.shapes.vpl.Terminal.extend({

    defaults: joint.util.deepSupplement({

        type: 'vpl.Start',
        attrs: {
            '.wire': { 'ref-dx': 0, d: 'M 0 0 L 10 0' },
            circle: { ref: '.body', 'ref-dx': 10, 'ref-y': 0.5, magnet: true, 'class': 'output', port: 'out' },
            text: { text: 'Start' }
        }

    }, joint.shapes.vpl.Terminal.prototype.defaults)
});

joint.shapes.vpl.End = joint.shapes.vpl.Terminal.extend({

    defaults: joint.util.deepSupplement({

        type: 'vpl.End',
        attrs: {
            '.wire': { 'ref-x': 0, d: 'M 0 0 L -10 0' },
            circle: { ref: '.body', 'ref-x': -10, 'ref-y': 0.5, magnet: 'passive', 'class': 'input', port: 'in' },
            text: { text: 'End' }
        }

    }, joint.shapes.vpl.Terminal.prototype.defaults)

});

/*
Base class of general blocks with 1 input node and 1 output node
*/
joint.shapes.vpl.Block_1_1 = joint.shapes.vpl.Block.extend({

    markup: [
            '<g class="rotatable">',
            '<g class="scalable"><image class="body"/><text class="annotation"/><rect class="frame"/></g>',
            '<circle class="input"/><circle class="output"/>',
            '</g>'
            ].join(''),

    defaults: joint.util.deepSupplement({

        type: 'vpl.Block_1_1',
        attrs: {
            '.input': { ref: '.body', 'ref-x': -vplConst.portRad, 'ref-y': 0.5, magnet: 'passive', port: 'in' },
            '.output': { ref: '.body', 'ref-dx': vplConst.portRad, 'ref-y': 0.5, magnet: true, port: 'out' }
        }

    }, joint.shapes.vpl.Block.prototype.defaults)
});

joint.shapes.vpl.Connect = joint.shapes.vpl.Block_1_1.extend({
    defaults: joint.util.deepSupplement({

        type: 'vpl.Connect',
        attrs: { image: { 'xlink:href': '../resources/plug.png' }},
        params: { pluginName: '', as : ''}
    }, joint.shapes.vpl.Block_1_1.prototype.defaults)
});

joint.shapes.vpl.Disconnect = joint.shapes.vpl.Block_1_1.extend({
    defaults: joint.util.deepSupplement({

        type: 'vpl.Disconnect',
        attrs: { image: { 'xlink:href': '../resources/plug_delete.png' }}

    }, joint.shapes.vpl.Block_1_1.prototype.defaults)
});

joint.shapes.vpl.Send = joint.shapes.vpl.Block_1_1.extend({
    defaults: joint.util.deepSupplement({

        type: 'vpl.Send',
        attrs: { image: { 'xlink:href': '../resources/send.png' }},
        params: { pluginName: '', message: ''}
    }, joint.shapes.vpl.Block_1_1.prototype.defaults)
});

joint.shapes.vpl.SetVariable = joint.shapes.vpl.Block_1_1.extend({
    defaults: joint.util.deepSupplement({

        type: 'vpl.SetVariable',
        attrs: { image: { 'xlink:href': '../resources/set_variable.png' }}
    }, joint.shapes.vpl.Block_1_1.prototype.defaults)
});

joint.shapes.vpl.Print = joint.shapes.vpl.Block_1_1.extend({
    defaults: joint.util.deepSupplement({

        type: 'vpl.Print',
        attrs: { image: { 'xlink:href': '../resources/print.png' }},
        params: {tokens: ''}

    }, joint.shapes.vpl.Block_1_1.prototype.defaults)
});

joint.shapes.vpl.Wait = joint.shapes.vpl.Block_1_1.extend({
    defaults: joint.util.deepSupplement({

        type: 'vpl.Wait',
        attrs: { image: { 'xlink:href': '../resources/wait.png' }},
        retValDest: ''
    }, joint.shapes.vpl.Block_1_1.prototype.defaults)
});

joint.shapes.vpl.WaitForMessage = joint.shapes.vpl.Block_1_1.extend({
    defaults: joint.util.deepSupplement({

        type: 'vpl.WaitForMessage',
        params:{pluginName: '', message: '', timeOutMs: ''}
    }, joint.shapes.vpl.Wait.prototype.defaults)
});

joint.shapes.vpl.WaitForLog = joint.shapes.vpl.Block_1_1.extend({
    defaults: joint.util.deepSupplement({

        type: 'vpl.WaitForLog',
        attrs: { '.annotation': { text: 'L' }}

    }, joint.shapes.vpl.Wait.prototype.defaults)
});

/*
Branch structure
*/
joint.shapes.vpl.IfElse = joint.shapes.vpl.Block.extend({

    markup: [
            '<g class="rotatable">',
            '<g class="scalable"><image class="body"/><rect class="frame"/></g>',
            '<circle class="input"/>',
            '<circle class="trueOutput"/><circle class="falseOutput"/>',
            '</g>'
            ].join(''),

    defaults: joint.util.deepSupplement({

        type: 'vpl.IfElse',
        attrs: {
            '.body': { width: 100, height: 100 , 'ref-y': 0.2},
            '.frame' :{width: 100, height: 100, 'ref-y': 0.2, stroke: 'black', fill: 'transparent', 'stroke-width': 2},
            '.input': { ref: '.body', 'ref-x': -vplConst.portRad, 'ref-y': 0.5, magnet: 'passive', port: 'in' },
            '.trueOutput': { ref: '.body', 'ref-dx': vplConst.portRad, 'ref-y': 0.3, magnet: true, port: 'trueOut' },
            '.falseOutput': { ref: '.body', 'ref-dx': vplConst.portRad, 'ref-y': 0.7, magnet: true, port: 'falseOut' },
            image: { 'xlink:href': '../resources/if_else.png' }
        },
        params:{condition: ''}
    }, joint.shapes.vpl.Block.prototype.defaults)
});

/*
Loop structures
*/
joint.shapes.vpl.Loop = joint.shapes.vpl.Block.extend({

    markup: [
            '<g class="rotatable">',
            '<g class="scalable"><image class="body"/><text class="annotation"/><rect class="frame"/></g>',
            '<circle class="input"/>',
            '<circle class="loopBody"/>',
            //'<circle class="bodyOutput"/>',
            '<circle class="output"/>',
            '</g>'
            ].join(''),

    defaults: joint.util.deepSupplement({

        type: 'vpl.Loop',
        attrs: {
            '.input': { ref: '.body', 'ref-x': -vplConst.portRad, 'ref-y': 0.5, magnet: 'passive', port: 'in' },
            '.loopBody': { ref: '.body', 'ref-x': 0.5, 'ref-dy': vplConst.portRad, magnet: true, port: 'loopBody' },
            //'.returnInput': { ref: '.body', 'ref-x': 0.7, 'ref-dy': vplConst.portRad, magnet: 'passive', port: 'returnIn' },
            '.output': { ref: '.body', 'ref-dx': vplConst.portRad, 'ref-y': 0.5, magnet: true, port: 'out' },
            image: { 'xlink:href': 'loop.png' }
        }
    }, joint.shapes.vpl.Block.prototype.defaults)
});

joint.shapes.vpl.ForEachLoop = joint.shapes.vpl.Loop.extend({
    defaults: joint.util.deepSupplement({

        type: 'vpl.ForEachLoop',
        attrs: { image: { 'xlink:href': '../resources/for_loop.png' }}

    }, joint.shapes.vpl.Loop.prototype.defaults)
});

joint.shapes.vpl.WhileLoop = joint.shapes.vpl.Loop.extend({
    defaults: joint.util.deepSupplement({

        type: 'vpl.WhileLoop',
        attrs: { image: { 'xlink:href': '../resources/while_loop.png' }},
        params:{condition: ''}
    }, joint.shapes.vpl.Loop.prototype.defaults)
});

joint.shapes.vpl.ForTimesLoop = joint.shapes.vpl.Loop.extend({
    defaults: joint.util.deepSupplement({

        type: 'vpl.ForTimesLoop',
        attrs: { image: { 'xlink:href': '../resources/times_loop.png' }},
        params:{ numberOfTimes: ''}
    }, joint.shapes.vpl.Loop.prototype.defaults)
});

// Add all views
joint.shapes.vpl.BlockView = joint.shapes.vpl.ToolElementView;
joint.shapes.vpl.ConnectView = joint.shapes.vpl.BlockView;
joint.shapes.vpl.DisconnectView = joint.shapes.vpl.BlockView;
joint.shapes.vpl.IfElseView = joint.shapes.vpl.BlockView;
joint.shapes.vpl.ForEachLoopView = joint.shapes.vpl.BlockView;
joint.shapes.vpl.WhileLoopView = joint.shapes.vpl.BlockView;
joint.shapes.vpl.ForTimesLoopView = joint.shapes.vpl.BlockView;
joint.shapes.vpl.PrintView = joint.shapes.vpl.BlockView;
joint.shapes.vpl.WaitForLogView = joint.shapes.vpl.BlockView;
joint.shapes.vpl.WaitForMessageView = joint.shapes.vpl.BlockView;
joint.shapes.vpl.SendView = joint.shapes.vpl.BlockView;
joint.shapes.vpl.SetVariableView = joint.shapes.vpl.BlockView;

//=====================================================================
// translation of JSON to program code
function findVplBlockById(vplBlocksArray, targetId){
  for (var i in vplBlocksArray){
    var vplBlock = vplBlocksArray[i];
    if (vplBlock){
      if (vplBlock.id === targetId){
        return vplBlock;
      }
    }
  }
  return null;
}

function findVplBlockBySourcePort(vplBlocksArray, sourceId, sourcePort){
  for (var i in vplBlocksArray){
    var vplBlock = vplBlocksArray[i];
    if (vplBlock){
      var vplBlockSource = vplBlock.source;
      if (vplBlockSource){
        if (vplBlockSource.id === sourceId && vplBlockSource.port == sourcePort){
          return vplBlock;
        }
      }
    }
  }
  return null;
}

function findVplBlockByType(vplBlocksArray, targetVplBlockType){
  for (var i in vplBlocksArray){
    var vplBlock = vplBlocksArray[i];
    if (vplBlock){
        if (vplBlock.type === targetVplBlockType){
          return vplBlock;
        }
    }
  }
  return null;
}

function GraphNode(blk){
    this.block = blk;
    this.prevNode;
    this.nextNode;
    this.ifNextNode;
    this.elseNextNode;
    this.loopBodyNode;
};

function createNodeForBlockAndLink(block, latestNode){
  var node = new GraphNode(block);
  latestNode.nextNode = node;
  node.prevNode = latestNode;
  return node;
}

function hasContent(str){
  return (str && str.trim() != '');
}

convertBlockToCode = function(vplBlock){
  if (vplBlock.type === 'vpl.Start' || vplBlock.type === 'vpl.End' || vplBlock.type === 'logic.Wire'){
    return '';
  }
  var code = '';
  if (vplBlock.type === 'vpl.SetVariable'){
    for (var varName in vplBlock.params){
      if (hasContent(varName)){
        if (hasContent(code)){
          code = code.concat('\n');
        }
        code = code.concat(varName);
        code = code.concat(' = ');
        code = code.concat(vplBlock.params[varName]);
      }
    }
    return code;
  }
  if (vplBlock.type === 'vpl.Connect'){
    code = code.concat('connect ');
    code = code.concat(vplBlock.params.pluginName);
    if (hasContent(vplBlock.params.as)){
      code = code.concat(' as ');
      code = code.concat(vplBlock.params.as);
    }
    return code;
  }
  if (vplBlock.type === 'vpl.Send'){
    code = code.concat('send ');
    code = code.concat(vplBlock.params.pluginName);
    code = code.concat(' ');
    code = code.concat(vplBlock.params.message);
    return code;
  }
  if (vplBlock.type === 'vpl.WaitForMessage'){
    if (hasContent(vplBlock.retValDest)){
        code = code.concat(vplBlock.retValDest);
        code = code.concat(' = ');
    }
    code = code.concat('waitFor ');
    code = code.concat(vplBlock.params.pluginName);
    code = code.concat(' ');
    code = code.concat(vplBlock.params.message);
    if (hasContent(vplBlock.params.timeOutMs)){
        code = code.concat(' for ');
        code = code.concat(vplBlock.params.timeOutMs);
    }
    return code;
  }
  if (vplBlock.type === 'vpl.Print'){
    code = code.concat('print ');
    code = code.concat(vplBlock.params.tokens);
    return code;
  }
  return null;
}

joint.shapes.vpl.convertGraphToCode = function(graphJson){
  var structuredGraph;
  var latestNode;
  var array = graphJson.cells;
  for(var i in array){
    var vplBlock = array[i];
    var vplBlockType = vplBlock.type;
    if (!structuredGraph){
      var startBlock = findVplBlockByType(array, 'vpl.Start');
      var firstNode = new GraphNode(startBlock);
      structuredGraph = firstNode;
      latestNode = firstNode;
    }else{
      if ('logic.Wire' === latestNode.block.type){
        var nextBlock = findVplBlockById(array, latestNode.block.target.id);
        if (nextBlock){
          var node = createNodeForBlockAndLink(nextBlock, latestNode);
          latestNode = node;
        }else{
            alert("Invalid Program, no next block from wire " + latestNode.block.id);
        }
        latestNode.block.id
      }else if ('vpl.IfElse' === latestNode.block.type){
      }else if ('vpl.End' === latestNode.block.type){
        break; //done
      }else{
          var wire = findVplBlockBySourcePort(array, latestNode.block.id, 'out');
          if (wire){
            var node = createNodeForBlockAndLink(wire, latestNode);
            latestNode = node;
          }else{
            alert("Invalid Program, not wire from output of " + latestNode.block.id);
          }
      }
    }
  }// end of for loop
  var currentNode = structuredGraph;
  var code = '';
  while (currentNode){
    var convertedCode = convertBlockToCode(currentNode.block);
    if (hasContent(convertedCode)){
      if (hasContent(code)){
        code = code.concat('\n');
      }
      code = code.concat(convertedCode);
    }
    currentNode = currentNode.nextNode;
  }
  return code;
}
