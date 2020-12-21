"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

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

var FlowNodeDetail = /*#__PURE__*/function (_PureComponent) {
  _inherits(FlowNodeDetail, _PureComponent);

  var _super = _createSuper(FlowNodeDetail);

  function FlowNodeDetail() {
    var _this;

    _classCallCheck(this, FlowNodeDetail);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.state = {};

    _this.onChange = function (data) {
      var _this$props = _this.props,
          editor = _this$props.editor,
          changeNode = _this$props.changeNode,
          needRemoveError = _this$props.needRemoveError;
      var uuid = data.uuid; // 更新editor

      var node = editor.graph.node.nodes[uuid] || {};
      _this.changeTimeout && clearTimeout(_this.changeTimeout);
      _this.changeTimeout = setTimeout(function () {
        node.data.config = data.config;
        node.data.name = data.name; // 移除节点上的error

        if (node.hasClass && node.hasClass("error") && needRemoveError) {
          node.removeClass("error");
        } // 节点展示文字


        var spacePad = 18; // 左右两边留白距离

        var showName = data.name;

        if (showName && showName.length > 10) {
          showName = showName.slice(0, 10) + "...";
        }

        node.select("text").node.innerHTML = showName || "";
        changeNode && changeNode({
          node: node
        });
        editor.graph.fire("node:change", {
          node: node
        });
        editor.graph.line.updateByNode(node);
      }, 300);
    };

    return _this;
  }

  _createClass(FlowNodeDetail, [{
    key: "render",

    /**
     * 渲染
     */
    value: function render() {
      var activeNode = this.state.activeNode;
      var _this$props2 = this.props,
          editor = _this$props2.editor,
          disabled = _this$props2.disabled,
          components = _this$props2.components;
      if (!editor || !activeNode) return null;
      var input = [];
      var nodes = editor.graph.node.nodes;
      var lines = editor.graph.line.lines;
      var node = nodes[activeNode.uuid] || {};
      var fromLines = node.fromLines || [];
      fromLines.forEach(function (lineId) {
        var line = lines[lineId];
        input.push(nodes[line.data.from].data);
      });

      if (!input.length) {
        input[0] = {
          output: []
        };
      }

      var Component = components[activeNode.component];
      return /*#__PURE__*/React.createElement("div", {
        className: "flow-detail-panel",
        style: {
          width: activeNode.uuid ? 300 : 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "flow-detail-main"
      }, Component && /*#__PURE__*/React.createElement(Component, {
        disabled: disabled,
        input: input,
        data: _objectSpread({}, activeNode),
        onChange: this.onChange
      })));
    }
  }]);

  return FlowNodeDetail;
}(_react.PureComponent);

var _default = FlowNodeDetail;
exports.default = _default;