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

var FlowLineDetail = /*#__PURE__*/function (_PureComponent) {
  _inherits(FlowLineDetail, _PureComponent);

  var _super = _createSuper(FlowLineDetail);

  function FlowLineDetail() {
    var _this;

    _classCallCheck(this, FlowLineDetail);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.state = {};

    _this.onChange = function (data) {
      var _this$props = _this.props,
          editor = _this$props.editor,
          changeLine = _this$props.changeLine;
      var activeLine = _this.state.activeLine; // // 更新editor

      var line = editor.graph.line.lines[activeLine.uuid];
      var fromNode = editor.graph.node.nodes[data.from];
      _this.changeTiemout && clearTimeout(_this.changeTiemout);
      _this.changeTiemout = setTimeout(function () {
        line.data = data;
        changeLine && changeLine({
          line: line,
          fromNode: fromNode
        });
        editor.graph.line.updateLine(line.data.uuid);
        editor.graph.fire("line:change", {
          line: line
        });
      }, 300);
    };

    return _this;
  }

  _createClass(FlowLineDetail, [{
    key: "render",

    /**
     * 渲染
     */
    value: function render() {
      var _this$state = this.state,
          activeLine = _this$state.activeLine,
          needConfig = _this$state.needConfig;
      var _this$props2 = this.props,
          editor = _this$props2.editor,
          disabled = _this$props2.disabled,
          components = _this$props2.components;
      if (!editor || !activeLine) return null;
      var lines = editor.graph.line.lines;
      var line = lines[activeLine.uuid] || {};
      var Component = components[activeLine.component];
      return /*#__PURE__*/React.createElement("div", {
        className: "flow-detail-panel",
        style: {
          width: activeLine.uuid ? 300 : 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "flow-detail-main"
      }, Component && /*#__PURE__*/React.createElement(Component, {
        disabled: disabled,
        needConfig: needConfig,
        data: _objectSpread({}, activeLine),
        onChange: this.onChange,
        editor: editor
      })));
    }
  }]);

  return FlowLineDetail;
}(_react.PureComponent);

var _default = FlowLineDetail;
exports.default = _default;