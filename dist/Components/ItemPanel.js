"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

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

var ItemPanel = /*#__PURE__*/function (_PureComponent) {
  _inherits(ItemPanel, _PureComponent);

  var _super = _createSuper(ItemPanel);

  function ItemPanel() {
    var _this;

    _classCallCheck(this, ItemPanel);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.state = {
      dragItem: undefined,
      moving: false,
      pageX: "",
      pageY: ""
    };

    _this.onDrop = function (item, e) {
      var _ref = item || {},
          _ref$size = _ref.size,
          size = _ref$size === void 0 ? [] : _ref$size;

      var _this$props = _this.props,
          editor = _this$props.editor,
          onDrop = _this$props.onDrop;
      var dom = editor.dom.node;
      var name = item.name;
      var transform = editor.paper.transform();
      var info = transform.globalMatrix.split();

      var _ref2 = dom && dom.getBoundingClientRect(),
          left = _ref2.left,
          top = _ref2.top;

      if (e.clientX - left < 0 || e.clientY - top < 0) return;
      var x = (e.clientX - left - info.dx) / info.scalex - size[0] / 2 * info.scalex;
      var y = (e.clientY - top - info.dy) / info.scalex - size[1] / 2 * info.scalex;
      editor.graph.node.addNode(Object.assign({}, JSON.parse(JSON.stringify(item)), {
        name: name,
        x: x,
        y: y
      }));
      onDrop && onDrop(item, e);
    };

    return _this;
  }

  _createClass(ItemPanel, [{
    key: "onDrag",
    value: function onDrag(item) {
      this.setState({
        dragItem: item,
        moving: false
      });
      this.addEvents();
    }
  }, {
    key: "addEvents",
    value: function addEvents() {
      var _this2 = this;

      var onMove = this.props.onMove;

      var mousemove = function mousemove(e) {
        var pageX = e.pageX,
            pageY = e.pageY;

        if (onMove) {
          var moveP = onMove(e);
          pageX = moveP.pageX;
          pageY = moveP.pageY;
        }

        _this2.setState({
          pageX: pageX,
          pageY: pageY,
          moving: true
        });
      };

      var mouseup = function mouseup(e) {
        _this2.onDrop(_this2.state.dragItem, e);

        _this2.setState({
          dragItem: undefined
        });

        window.document.removeEventListener("mousemove", mousemove);
        window.document.removeEventListener("mouseup", mouseup);
      };

      window.document.addEventListener("mousemove", mousemove);
      window.document.addEventListener("mouseup", mouseup);
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _ref3 = this.state || {},
          _ref3$dragItem = _ref3.dragItem,
          dragItem = _ref3$dragItem === void 0 ? {} : _ref3$dragItem,
          moving = _ref3.moving,
          _ref3$pageX = _ref3.pageX,
          pageX = _ref3$pageX === void 0 ? 0 : _ref3$pageX,
          _ref3$pageY = _ref3.pageY,
          pageY = _ref3$pageY === void 0 ? 0 : _ref3$pageY;

      var _ref4 = dragItem || {},
          _ref4$size = _ref4.size,
          size = _ref4$size === void 0 ? [] : _ref4$size;

      var _this$props2 = this.props,
          disabled = _this$props2.disabled,
          children = _this$props2.children,
          editor = _this$props2.editor;
      var transform = editor && editor.paper.transform();
      var info = transform && transform.globalMatrix.split();
      return /*#__PURE__*/React.createElement("div", {
        className: "flow-editor-sidebar"
      }, disabled && /*#__PURE__*/React.createElement("div", {
        className: "flow-item-mask"
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          left: dragItem.name ? pageX - size[0] / 2 * info.scalex : -9999,
          top: dragItem.name ? pageY - size[1] / 2 * info.scalex : -9999,
          display: moving && dragItem.name ? "block" : "none"
        },
        className: "".concat(dragItem.type || "", " flow-item drag-item")
      }, dragItem.image ? /*#__PURE__*/React.createElement("img", {
        src: dragItem.image
      }) : dragItem.name), /*#__PURE__*/React.createElement("div", {
        className: "flow-item-panel"
      }, React.Children.map(children, function (child) {
        return /*#__PURE__*/React.createElement("div", {
          draggable: false,
          onMouseDown: function onMouseDown() {
            _this3.onDrag(child.props);
          }
        }, child);
      })));
    }
  }]);

  return ItemPanel;
}(_react.PureComponent);

exports.default = ItemPanel;