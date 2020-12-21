"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("antd/lib/tooltip/style");

var _tooltip = _interopRequireDefault(require("antd/lib/tooltip"));

require("antd/lib/icon/style");

var _icon = _interopRequireDefault(require("antd/lib/icon"));

var _react = require("react");

var _dagre = _interopRequireDefault(require("dagre"));

var _toolBarTypeNameMap = require("../Constants/toolBarTypeNameMap");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var Command = /*#__PURE__*/function (_PureComponent) {
  _inherits(Command, _PureComponent);

  var _super = _createSuper(Command);

  function Command() {
    var _this;

    _classCallCheck(this, Command);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.state = {};

    _this.redo = function () {
      _this.props.editor.schema.redo();
    };

    _this.undo = function () {
      _this.props.editor.schema.undo();
    };

    _this.format = function (e) {
      e.preventDefault();
      var _this$props$editor = _this.props.editor,
          schema = _this$props$editor.schema,
          _this$props$editor$gr = _this$props$editor.graph,
          node = _this$props$editor$gr.node,
          line = _this$props$editor$gr.line;
      var data = schema.getData();
      var g = new _dagre.default.graphlib.Graph();
      g.setGraph({
        nodesep: 90
      });
      g.setDefaultEdgeLabel(function () {
        return {};
      });
      Object.values(node.nodes).forEach(function (item) {
        var _item$getBBox = item.getBBox(),
            w = _item$getBBox.w,
            h = _item$getBBox.h;

        console.log(w, h);
        g.setNode(item.data.uuid, Object.assign(item.data, {
          width: w,
          height: h
        }));
      });
      data.lines.map(function (item) {
        g.setEdge(item.from, item.to);
      });

      _dagre.default.layout(g);

      var oldData = JSON.stringify(schema.data);
      g.nodes().forEach(function (key) {
        var nodeData = g.node(key);
        node.updateNode(nodeData);
        schema.data.nodesMap[key] = nodeData;
      });
      Object.keys(line.lines).forEach(function (key) {
        line.updateLine(key);
        schema.data.linesMap[key] = line.lines[key].data;
      });
      var newData = JSON.stringify(schema.data);

      if (oldData !== newData) {
        schema.history.push(JSON.parse(oldData));
      }

      ;
      setTimeout(function () {
        _this.props.editor.controller.autoFit();
      }, 300);
    };

    _this.clickEvent = function (type) {
      var _this$state = _this.state,
          canRedo = _this$state.canRedo,
          canUndo = _this$state.canUndo;

      var _ref = _this.props.editor || {},
          controller = _ref.controller,
          paper = _ref.paper;

      switch (type) {
        case "redo":
          return canRedo && _this.redo;

        case "undo":
          return canUndo && _this.undo;

        case "zoom-in":
          return function () {
            controller.zoom(1.05);
          };

        case "zoom-out":
          return function () {
            controller.zoom(0.95);
          };

        case "fullscreen":
          return function () {
            controller.autoFit();
          };

        case "fullscreen-exit":
          return function () {
            var transform = paper.transform();

            var _transform$localMatri = transform.localMatrix.split(),
                scalex = _transform$localMatri.scalex;

            controller.zoom(1 / scalex);
          };
      }
    };

    _this.getClassName = function (type) {
      var _this$state2 = _this.state,
          canRedo = _this$state2.canRedo,
          canUndo = _this$state2.canUndo;
      var disableClass = "";

      switch (type) {
        case "redo":
          if (!canRedo) {
            disableClass = "disable";
          }

          ;
          break;

        case "undo":
          if (!canUndo) {
            disableClass = "disable";
          }

          ;
          break;
      }

      return disableClass;
    };

    _this.getCommandChild = function () {
      var child = [];
      var _this$props$types = _this.props.types,
          types = _this$props$types === void 0 ? [] : _this$props$types;
      types && types.length > 0 && types.forEach(function (type) {
        var click = null;

        if (_typeof(type) === "object") {
          var _type = type;
          type = _type.type;
          click = _type.click;
        }

        if (type) {
          child.push( /*#__PURE__*/React.createElement(_tooltip.default, {
            title: _toolBarTypeNameMap.toolBarTypeNameMap[type],
            key: type
          }, /*#__PURE__*/React.createElement(_icon.default, {
            type: type,
            onClick: click || _this.clickEvent(type),
            className: _this.getClassName(type)
          })));
        }
      });
      return child;
    };

    return _this;
  }

  _createClass(Command, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.props.editor.on("change", function () {
        var history = _this2.props.editor.schema.history;
        var canRedo = history.index < history.schemaList.length - 1;
        var canUndo = history.index > 0;

        _this2.setState({
          canRedo: canRedo,
          canUndo: canUndo
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", null, this.getCommandChild());
    }
  }]);

  return Command;
}(_react.PureComponent);

exports.default = Command;