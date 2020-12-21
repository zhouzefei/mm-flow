"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _mmEditor = _interopRequireDefault(require("@tntd/mm-editor"));

var _NodeDetail = _interopRequireDefault(require("./NodeDetail"));

var _LineDetail = _interopRequireDefault(require("./LineDetail"));

var _flowExclusivity = _interopRequireDefault(require("../sources/images/flow-exclusivity.svg"));

var _flowParallel = _interopRequireDefault(require("../sources/images/flow-parallel.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var labelCfg = {
  "refX": 0,
  "refY": 0,
  "showNum": 10,
  "autoRotate": false,
  "style": {
    "fontSize": "12px",
    "fill": "#333",
    "stroke": "#f0f2f5"
  }
};

var Flow = /*#__PURE__*/function (_PureComponent) {
  _inherits(Flow, _PureComponent);

  var _super = _createSuper(Flow);

  function Flow() {
    var _this;

    _classCallCheck(this, Flow);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _this.watchHistory = function () {
      if (_this.watchHistoryTimeout) {
        clearTimeout(_this.watchHistoryTimeout);
      }

      _this.watchHistoryTimeout = setTimeout(function () {
        var activeNode = _this.rightbarNode.state.activeNode;
        var activeLine = _this.rightbarLine.state.activeLine;

        if (activeNode) {
          var nodes = _this.editor.graph.node.nodes;
          var uuid = activeNode.uuid;

          var _ref = nodes[uuid] || {},
              data = _ref.data;

          _this.rightbarNode.setState({
            activeNode: _objectSpread({}, data)
          });
        }

        if (activeLine) {
          var lines = _this.editor.graph.line.lines;
          var _uuid = activeLine.uuid;
          var line = lines[_uuid] || {};

          _this.rightbarLine.setState({
            activeLine: line.data
          });
        }

        var auditedNodes = _this.props.auditedNodes;

        if (auditedNodes && auditedNodes.length > 0) {
          _this.runFlow();
        }
      }, 0);
    };

    _this.initEditorShape = function () {
      var _assertThisInitialize = _assertThisInitialized(_this),
          editor = _assertThisInitialize.editor;

      if (!editor) {
        return null;
      } // 开始


      editor.graph.node.registeNode("flow-start", {
        render: function render(data, snapPaper) {
          var node = snapPaper.circle(25, 25, 25);
          var text = snapPaper.text(25, 25, data.name);
          node.attr({
            fill: "#ca808b",
            class: "flow-icon-node"
          });
          text.attr({
            fill: "#fff"
          });
          return snapPaper.group(node, text);
        },
        linkPoints: [{
          x: 0.5,
          y: 0
        }, {
          x: 1,
          y: 0.5
        }, {
          x: 0.5,
          y: 1
        }, {
          x: 0,
          y: 0.5
        }]
      }, "default"); //  结束

      editor.graph.node.registeNode("flow-end", {
        render: function render(data, snapPaper) {
          var node = snapPaper.circle(25, 25, 25);
          var text = snapPaper.text(25, 25, data.name);
          node.attr({
            fill: "#748993",
            class: "flow-icon-node"
          });
          text.attr({
            fill: "#fff"
          });
          return snapPaper.group(node, text);
        },
        linkPoints: [{
          x: 0.5,
          y: 0
        }, {
          x: 1,
          y: 0.5
        }, {
          x: 0.5,
          y: 1
        }, {
          x: 0,
          y: 0.5
        }]
      }, "default"); // 审批

      editor.graph.node.registeNode("flow-audit", {
        render: function render(data, snapPaper) {
          var name = data.name,
              iconPath = data.iconPath;

          if (name && name.length > 10) {
            name = name + "...";
          }

          var icon = null,
              iconW = 0;

          if (iconPath) {
            icon = snapPaper.image(iconPath, 12, 8, 24, 24);
            icon.node.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
            iconW = icon.getBBox().w;
          }

          var spacePad = 18; // 左右两边留白距离

          var text = snapPaper.text(iconW ? iconW + spacePad : 50, 20, name);

          var _text$getBBox = text.getBBox(),
              textW = _text$getBBox.w;

          var node = snapPaper.rect(0, 0, Math.max(textW + (iconW + 36), 100), 40, 20, 20);
          node.attr({
            fill: "#bdd9fc",
            stroke: "#7faee8",
            class: "flow-icon-node"
          });
          text.attr({
            fill: "#333"
          });

          if (iconPath) {
            text.attr({
              "textAnchor": "start"
            });
          }

          if (iconPath) {
            return snapPaper.group(node, text, icon);
          } else {
            return snapPaper.group(node, text);
          }
        },
        linkPoints: [{
          x: 0.5,
          y: 0
        }, {
          x: 1,
          y: 0.5
        }, {
          x: 0.5,
          y: 1
        }, {
          x: 0,
          y: 0.5
        }]
      }, "iconNode"); // 排他

      editor.graph.node.registeNode("flow-exclusivity", {
        render: function render(data, snapPaper) {
          var image = snapPaper.image(_flowExclusivity.default, 0, 0, 78, 72);
          image.node.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
          var text = snapPaper.text(39, 36, data.name);
          text.attr({
            fill: "#333"
          });
          return snapPaper.group(image, text);
        },
        linkPoints: [{
          x: 0.5,
          y: 0
        }, {
          x: 1,
          y: 0.5
        }, {
          x: 0.5,
          y: 1
        }, {
          x: 0,
          y: 0.5
        }]
      }, "default"); // 并行

      editor.graph.node.registeNode("flow-parallel", {
        render: function render(data, snapPaper) {
          var image = snapPaper.image(_flowParallel.default, 0, 0, 78, 72);
          image.node.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
          var text = snapPaper.text(39, 36, data.name);
          text.attr({
            fill: "#333"
          });
          return snapPaper.group(image, text);
        },
        linkPoints: [{
          x: 0.5,
          y: 0
        }, {
          x: 1,
          y: 0.5
        }, {
          x: 0.5,
          y: 1
        }, {
          x: 0,
          y: 0.5
        }]
      }, "default"); // 判断

      editor.graph.node.registeNode("flow-decide", {
        render: function render(data, snapPaper) {
          var image = snapPaper.image(FlowDecide, 0, 0, 78, 72);
          image.node.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
          var text = snapPaper.text(39, 36, data.name);
          text.attr({
            fill: "#333"
          });
          return snapPaper.group(image, text);
        },
        linkPoints: [{
          x: 0.5,
          y: 0
        }, {
          x: 1,
          y: 0.5
        }, {
          x: 0.5,
          y: 1
        }, {
          x: 0,
          y: 0.5
        }]
      }, "default");
    };

    _this.defaultAnimate = function () {
      var auditedNodes = _this.props.auditedNodes;

      var _assertThisInitialize2 = _assertThisInitialized(_this),
          _assertThisInitialize3 = _assertThisInitialize2.editor.graph,
          node = _assertThisInitialize3.node,
          line = _assertThisInitialize3.line;

      var lines = line.lines;
      var nodes = node.nodes;

      _this.editor.repaint();

      var hasAuditedNodeUuids = [];
      auditedNodes.forEach(function (node) {
        hasAuditedNodeUuids.push(node.uuid);
      });
      auditedNodes.forEach(function (hasAudited) {
        var _ref2 = hasAudited || {},
            uuid = _ref2.uuid;

        var status = "success instance";

        switch (hasAudited.status) {
          case 1:
            status = "running instance";
            break;

          case 4:
            status = "error instance";
            break;

          case 3:
            status = "reject instance";
            break;

          default:
            status = "success instance";
            break;
        }

        Object.values(lines).forEach(function (line) {
          if (uuid === line.data.to && hasAuditedNodeUuids.indexOf(line.data.from) > -1) {
            line.addClass(status);

            if (status.indexOf("running") > -1) {
              _this.updateRunningLine(line);
            }
          }
        });
        Object.values(nodes).forEach(function (node) {
          if (node.data.uuid === uuid) {
            var iconClass = "";

            if (hasAudited.status === 4) {
              iconClass = "catch-icon";
            }

            if (hasAudited.status === 3) {
              iconClass = "reject-icon";
            }

            if (iconClass) {
              var _node$select$node$get = node.select("rect").node.getBBox(),
                  rectW = _node$select$node$get.width;

              var obj = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
              obj.innerHTML = "<span xmlns=\"http://www.w3.org/1999/xhtml\" class=\"".concat(iconClass, "\"></span>");
              var icon = window.Snap(obj);
              icon.attr({
                width: 24,
                height: 24,
                x: rectW - 18 + 4,
                y: 8
              });
              node.shape.add(icon);
              node.shape.errorIcon = icon;
              node.select("rect").node.setAttribute("width", Math.max(rectW + 28, 108));
              node.linkPoints.forEach(function (circle) {
                _this.editor.graph.node.shapes[node.data.type || "default"].updateLinkPoint(node, circle, true);
              });
            }

            _this.editor.graph.line.updateByNode(node);

            node.addClass(status);
          }
        });
      });
    };

    _this.runFlow = function () {
      if (_this.watchHistoryTimeout) {
        clearTimeout(_this.watchHistoryTimeout);
      }

      var animate = _this.props.animate;

      if (animate) {
        animate();
      } else {
        _this.defaultAnimate();
      }
    };

    return _this;
  }

  _createClass(Flow, [{
    key: "addEditorEvent",
    // 初始化编辑器事件
    value: function addEditorEvent() {
      var _this2 = this;

      var _this$props = this.props,
          onNodeClick = _this$props.onNodeClick,
          onLineClick = _this$props.onLineClick,
          onLineAdd = _this$props.onLineAdd,
          click = _this$props.click,
          redoHistory = _this$props.redoHistory,
          undoHistory = _this$props.undoHistory; // 选中节点

      this.editor.graph.on("node:click", function (_ref3) {
        var node = _ref3.node;
        var fromLines = node.fromLines;
        var fromNodes = [];
        var nodes = _this2.editor.graph.node.nodes;
        var lines = _this2.editor.graph.line.lines;
        fromLines.forEach(function (lineId) {
          var line = lines[lineId];
          fromNodes.push(nodes[line.data.from].data);
        });

        _this2.rightbarNode.setState({
          activeNode: node.data,
          fromNodes: fromNodes
        });

        _this2.rightbarLine.setState({
          activeLine: {}
        }); // 接收回调


        onNodeClick && onNodeClick({
          node: node,
          fromNodes: fromNodes
        });
      });
      this.editor.graph.on("delete", function () {
        _this2.rightbarNode.setState({
          activeNode: {},
          fromNodes: null
        });

        _this2.rightbarLine.setState({
          activeLine: {}
        });
      }); // 选中线条

      this.editor.graph.on("line:click", function (_ref4) {
        var line = _ref4.line;
        var lineNeedConfig = _this2.props.lineNeedConfig;
        var fromNode = _this2.editor.graph.node.nodes[line.data.from];

        _this2.rightbarLine.setState({
          activeLine: line.data,
          needConfig: lineNeedConfig({
            line: line,
            fromNode: fromNode
          })
        });

        _this2.rightbarNode.setState({
          activeNode: {}
        });

        onLineClick && onLineClick({
          line: line,
          rightbarLine: _this2.rightbarLine,
          fromNode: fromNode
        });
      }); // 添加完线条

      this.editor.graph.on("line:add", function (_ref5) {
        var line = _ref5.line;
        line.data.component = "line";
        line.data.label = "";
        line.data.labelCfg = labelCfg;
        var lineRed = _this2.props.lineRed;

        if (lineRed({
          line: line
        })) {
          line.addClass("error");
        }

        onLineAdd && onLineAdd({
          line: line
        });
      }); // 空白页点击

      this.editor.graph.on("paper:click", function () {
        _this2.rightbarNode.setState({
          activeNode: {},
          fromNodes: null
        });

        _this2.rightbarLine.setState({
          activeLine: {}
        });

        click && click();
      }); // 监听撤销等事件

      this.editor.on("redo", function () {
        _this2.watchHistory();

        redoHistory && redoHistory();
      });
      this.editor.on("undo", function () {
        _this2.watchHistory();

        undoHistory && undoHistory();
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props2 = this.props,
          mode = _this$props2.mode,
          data = _this$props2.data,
          checkNewLine = _this$props2.checkNewLine,
          init = _this$props2.init,
          auditedNodes = _this$props2.auditedNodes;
      this.editor = new _mmEditor.default({
        dom: this.editorRef,
        mode: mode,
        showBackGrid: false
      });
      this.initEditorShape();

      if (checkNewLine) {
        this.editor.graph.line.shapes["default"].checkNewLine = checkNewLine;
      }

      init && init();

      if (data) {
        this.editor.schema.setInitData(data); // 初始值
      }

      this.addEditorEvent();

      if (auditedNodes && auditedNodes.length > 0) {
        this.runFlow();
      }
    } // 默认动画效果

  }, {
    key: "updateRunningLine",
    // 更新线状态
    value: function updateRunningLine(line) {
      var _this3 = this;

      var angel = 0;

      if (line && line.arrow) {
        angel = line.arrow.angle;

        if (angel === 0) {
          angel += 180;
        } else if (angel === 90) {
          angel += 90;
        } else if (angel === 270) {
          angel -= 90;
        }
      }

      var length = line.shape.getTotalLength();

      if (!line.hasClass("running")) {
        this.props.editor.graph.line.updateLine(line.data.uuid);
        return;
      }

      var lineAnimate = window.Snap.animate(0, length, function (val) {
        if (line.arrow) {
          var coord = line.shape.getPointAtLength(val);
          var matrix = new window.Snap.Matrix();
          matrix.translate(coord.x, coord.y);
          matrix.rotate(coord.alpha + angel + 90, 0, 0);
          line.arrow.attr({
            transform: matrix.toTransformString()
          });
        }
      }, length * 20, function () {
        if (line.arrow) {
          _this3.updateRunningLine(line);
        } else {
          if (lineAnimate) {
            lineAnimate.stop();
            lineAnimate = null;
          }
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$props3 = this.props,
          className = _this$props3.className,
          disabled = _this$props3.disabled,
          nodeComponents = _this$props3.nodeComponents,
          lineComponents = _this$props3.lineComponents,
          changeNode = _this$props3.changeNode,
          changeLine = _this$props3.changeLine,
          _this$props3$needRemo = _this$props3.needRemoveError,
          needRemoveError = _this$props3$needRemo === void 0 ? true : _this$props3$needRemo;
      return /*#__PURE__*/React.createElement("div", {
        className: "flex-flow-wrap"
      }, /*#__PURE__*/React.createElement("div", {
        className: "".concat(className || "", " flow-editor-content flow"),
        ref: function ref(g) {
          return _this4.editorRef = g;
        }
      }), /*#__PURE__*/React.createElement(_NodeDetail.default, {
        changeNode: changeNode,
        editor: this.editor,
        components: nodeComponents,
        disabled: disabled,
        needRemoveError: needRemoveError,
        ref: function ref(_ref6) {
          _this4.rightbarNode = _ref6;
        }
      }), /*#__PURE__*/React.createElement(_LineDetail.default, {
        changeLine: changeLine,
        editor: this.editor,
        components: lineComponents,
        disabled: disabled,
        ref: function ref(_ref7) {
          _this4.rightbarLine = _ref7;
        }
      }));
    }
  }]);

  return Flow;
}(_react.PureComponent);

exports.default = Flow;