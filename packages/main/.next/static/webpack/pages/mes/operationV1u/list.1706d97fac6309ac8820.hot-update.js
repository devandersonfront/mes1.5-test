webpackHotUpdate_N_E("pages/mes/operationV1u/list",{

/***/ "../shared/src/components/Formatter/TimeFormmater.tsx":
/*!************************************************************!*\
  !*** ../shared/src/components/Formatter/TimeFormmater.tsx ***!
  \************************************************************/
/*! exports provided: TimeFormatter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TimeFormatter\", function() { return TimeFormatter; });\n/* harmony import */ var _Users_user_Desktop_sizl_mono_pop_node_modules_next_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! /Users/user/Desktop/sizl/mono_pop/node_modules/next/node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral */ \"../../node_modules/next/node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js\");\n/* harmony import */ var _Users_user_Desktop_sizl_mono_pop_node_modules_next_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! /Users/user/Desktop/sizl/mono_pop/node_modules/next/node_modules/@babel/runtime/helpers/esm/slicedToArray */ \"../../node_modules/next/node_modules/@babel/runtime/helpers/esm/slicedToArray.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"../../node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! styled-components */ \"../../node_modules/styled-components/dist/styled-components.browser.esm.js\");\n\n\n\nvar _jsxFileName = \"/Users/user/Desktop/sizl/mono_pop/packages/shared/src/components/Formatter/TimeFormmater.tsx\",\n    _this = undefined,\n    _s = $RefreshSig$();\n\nvar __jsx = react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement;\n\nfunction _templateObject() {\n  var data = Object(_Users_user_Desktop_sizl_mono_pop_node_modules_next_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__[\"default\"])([\"\\n    display:flex;\\n    justify-content:flex-start;\\n    align-items:center;\\n    width:100%;\\n    height:100%;\\n    padding: 0 8px;\\n    margin:0;\\n\"]);\n\n  _templateObject = function _templateObject() {\n    return data;\n  };\n\n  return data;\n}\n\n\n\n\nvar TimeFormatter = function TimeFormatter(_ref) {\n  _s();\n\n  var _column$textAlign;\n\n  var row = _ref.row,\n      column = _ref.column,\n      setRow = _ref.setRow;\n\n  var _React$useState = react__WEBPACK_IMPORTED_MODULE_2___default.a.useState(),\n      _React$useState2 = Object(_Users_user_Desktop_sizl_mono_pop_node_modules_next_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(_React$useState, 2),\n      time = _React$useState2[0],\n      setTime = _React$useState2[1];\n\n  Object(react__WEBPACK_IMPORTED_MODULE_2__[\"useEffect\"])(function () {\n    if (row[column.key]) {\n      var sec = Number(row[column.key]);\n      var hour = Math.floor(sec / 3600);\n      sec = sec % 3600;\n      var min = Math.floor(sec / 60);\n      sec = sec % 60;\n      console.log(\"\".concat(hour, \":\").concat(min, \":\").concat(sec));\n      setTime(\"\".concat(hour >= 10 ? hour : '0' + hour, \":\").concat(min >= 10 ? min : '0' + min, \":\").concat(sec >= 10 ? sec : '0' + sec));\n    }\n  }, [row]);\n  return __jsx(Background, {\n    style: {\n      background: \"white\"\n    },\n    onClick: function onClick() {},\n    __self: _this,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 29,\n      columnNumber: 5\n    }\n  }, __jsx(\"p\", {\n    style: {\n      padding: '0 0 8px',\n      color: row[column.key] ? '#0D0D0D' : '#0D0D0D66',\n      width: '100%',\n      textAlign: (_column$textAlign = column.textAlign) !== null && _column$textAlign !== void 0 ? _column$textAlign : 'left'\n    },\n    __self: _this,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 31,\n      columnNumber: 7\n    }\n  }, time !== null && time !== void 0 ? time : \"00:00:00\"));\n};\n\n_s(TimeFormatter, \"rkMeZBHX4Eei19CRvWL8taVSCjQ=\");\n\n_c = TimeFormatter;\nvar Background = styled_components__WEBPACK_IMPORTED_MODULE_3__[\"default\"].div(_templateObject());\n_c2 = Background;\n\n\nvar _c, _c2;\n\n$RefreshReg$(_c, \"TimeFormatter\");\n$RefreshReg$(_c2, \"Background\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4uL3NoYXJlZC9zcmMvY29tcG9uZW50cy9Gb3JtYXR0ZXIvVGltZUZvcm1tYXRlci50c3g/NTExMyJdLCJuYW1lcyI6WyJUaW1lRm9ybWF0dGVyIiwicm93IiwiY29sdW1uIiwic2V0Um93IiwiUmVhY3QiLCJ1c2VTdGF0ZSIsInRpbWUiLCJzZXRUaW1lIiwidXNlRWZmZWN0Iiwia2V5Iiwic2VjIiwiTnVtYmVyIiwiaG91ciIsIk1hdGgiLCJmbG9vciIsIm1pbiIsImNvbnNvbGUiLCJsb2ciLCJiYWNrZ3JvdW5kIiwicGFkZGluZyIsImNvbG9yIiwid2lkdGgiLCJ0ZXh0QWxpZ24iLCJCYWNrZ3JvdW5kIiwic3R5bGVkIiwiZGl2Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7O0FBU0EsSUFBTUEsYUFBYSxHQUFHLFNBQWhCQSxhQUFnQixPQUFtQztBQUFBOztBQUFBOztBQUFBLE1BQWpDQyxHQUFpQyxRQUFqQ0EsR0FBaUM7QUFBQSxNQUE1QkMsTUFBNEIsUUFBNUJBLE1BQTRCO0FBQUEsTUFBcEJDLE1BQW9CLFFBQXBCQSxNQUFvQjs7QUFBQSx3QkFDL0JDLDRDQUFLLENBQUNDLFFBQU4sRUFEK0I7QUFBQTtBQUFBLE1BQ2hEQyxJQURnRDtBQUFBLE1BQzFDQyxPQUQwQzs7QUFHdkRDLHlEQUFTLENBQUMsWUFBTTtBQUNkLFFBQUdQLEdBQUcsQ0FBQ0MsTUFBTSxDQUFDTyxHQUFSLENBQU4sRUFBbUI7QUFDakIsVUFBSUMsR0FBRyxHQUFHQyxNQUFNLENBQUNWLEdBQUcsQ0FBQ0MsTUFBTSxDQUFDTyxHQUFSLENBQUosQ0FBaEI7QUFDQSxVQUFJRyxJQUFJLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXSixHQUFHLEdBQUMsSUFBZixDQUFYO0FBQ0FBLFNBQUcsR0FBR0EsR0FBRyxHQUFDLElBQVY7QUFDQSxVQUFJSyxHQUFHLEdBQUdGLElBQUksQ0FBQ0MsS0FBTCxDQUFXSixHQUFHLEdBQUMsRUFBZixDQUFWO0FBQ0FBLFNBQUcsR0FBR0EsR0FBRyxHQUFDLEVBQVY7QUFFQU0sYUFBTyxDQUFDQyxHQUFSLFdBQWVMLElBQWYsY0FBdUJHLEdBQXZCLGNBQThCTCxHQUE5QjtBQUVBSCxhQUFPLFdBQUlLLElBQUksSUFBSSxFQUFSLEdBQWFBLElBQWIsR0FBb0IsTUFBSUEsSUFBNUIsY0FBb0NHLEdBQUcsSUFBSSxFQUFQLEdBQVlBLEdBQVosR0FBa0IsTUFBSUEsR0FBMUQsY0FBaUVMLEdBQUcsSUFBSSxFQUFQLEdBQVlBLEdBQVosR0FBa0IsTUFBSUEsR0FBdkYsRUFBUDtBQUNEO0FBQ0YsR0FaUSxFQVlOLENBQUNULEdBQUQsQ0FaTSxDQUFUO0FBY0EsU0FDRSxNQUFDLFVBQUQ7QUFBWSxTQUFLLEVBQUU7QUFBQ2lCLGdCQUFVLEVBQUU7QUFBYixLQUFuQjtBQUEwQyxXQUFPLEVBQUUsbUJBQUksQ0FDdEQsQ0FERDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBRUU7QUFBRyxTQUFLLEVBQUU7QUFBQ0MsYUFBTyxFQUFFLFNBQVY7QUFBcUJDLFdBQUssRUFBRW5CLEdBQUcsQ0FBQ0MsTUFBTSxDQUFDTyxHQUFSLENBQUgsR0FBa0IsU0FBbEIsR0FBOEIsV0FBMUQ7QUFBdUVZLFdBQUssRUFBRSxNQUE5RTtBQUFzRkMsZUFBUyx1QkFBRXBCLE1BQU0sQ0FBQ29CLFNBQVQsaUVBQXNCO0FBQXJILEtBQVY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUNHaEIsSUFESCxhQUNHQSxJQURILGNBQ0dBLElBREgsR0FDVyxVQURYLENBRkYsQ0FERjtBQVFELENBekJEOztHQUFNTixhOztLQUFBQSxhO0FBMkJOLElBQU11QixVQUFVLEdBQUdDLHlEQUFNLENBQUNDLEdBQVYsbUJBQWhCO01BQU1GLFU7QUFVTiIsImZpbGUiOiIuLi9zaGFyZWQvc3JjL2NvbXBvbmVudHMvRm9ybWF0dGVyL1RpbWVGb3JtbWF0ZXIudHN4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7dXNlRWZmZWN0fSBmcm9tICdyZWFjdCdcbmltcG9ydCBzdHlsZWQgZnJvbSBcInN0eWxlZC1jb21wb25lbnRzXCI7XG5pbXBvcnQge0lFeGNlbEhlYWRlclR5cGV9IGZyb20gXCIuLi8uLi9jb21tb24vQHR5cGVzL3R5cGVcIjtcblxuaW50ZXJmYWNlIElQcm9wcyB7XG4gIHJvdzogYW55XG4gIGNvbHVtbjogSUV4Y2VsSGVhZGVyVHlwZVxuICBzZXRSb3c6IChyb3c6IGFueSkgPT4gdm9pZFxufVxuXG5jb25zdCBUaW1lRm9ybWF0dGVyID0gKHtyb3csIGNvbHVtbiwgc2V0Um93fTogSVByb3BzKSA9PiB7XG4gIGNvbnN0IFt0aW1lLCBzZXRUaW1lXSA9IFJlYWN0LnVzZVN0YXRlPHN0cmluZyB8IHVuZGVmaW5lZD4oKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYocm93W2NvbHVtbi5rZXldKXtcbiAgICAgIGxldCBzZWMgPSBOdW1iZXIocm93W2NvbHVtbi5rZXldKVxuICAgICAgbGV0IGhvdXIgPSBNYXRoLmZsb29yKHNlYy8zNjAwKVxuICAgICAgc2VjID0gc2VjJTM2MDBcbiAgICAgIGxldCBtaW4gPSBNYXRoLmZsb29yKHNlYy82MClcbiAgICAgIHNlYyA9IHNlYyU2MFxuXG4gICAgICBjb25zb2xlLmxvZyhgJHtob3VyfToke21pbn06JHtzZWN9YClcblxuICAgICAgc2V0VGltZShgJHtob3VyID49IDEwID8gaG91ciA6ICcwJytob3VyfToke21pbiA+PSAxMCA/IG1pbiA6ICcwJyttaW59OiR7c2VjID49IDEwID8gc2VjIDogJzAnK3NlY31gKVxuICAgIH1cbiAgfSwgW3Jvd10pXG5cbiAgcmV0dXJuKFxuICAgIDxCYWNrZ3JvdW5kIHN0eWxlPXt7YmFja2dyb3VuZDogXCJ3aGl0ZVwifX0gb25DbGljaz17KCk9PntcbiAgICB9fSA+XG4gICAgICA8cCBzdHlsZT17e3BhZGRpbmc6ICcwIDAgOHB4JywgY29sb3I6IHJvd1tjb2x1bW4ua2V5XSA/ICcjMEQwRDBEJyA6ICcjMEQwRDBENjYnLCB3aWR0aDogJzEwMCUnLCB0ZXh0QWxpZ246IGNvbHVtbi50ZXh0QWxpZ24gPz8gJ2xlZnQnIH19PlxuICAgICAgICB7dGltZSA/PyBcIjAwOjAwOjAwXCJ9XG4gICAgICA8L3A+XG4gICAgPC9CYWNrZ3JvdW5kPlxuICApXG59XG5cbmNvbnN0IEJhY2tncm91bmQgPSBzdHlsZWQuZGl2YFxuICAgIGRpc3BsYXk6ZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6ZmxleC1zdGFydDtcbiAgICBhbGlnbi1pdGVtczpjZW50ZXI7XG4gICAgd2lkdGg6MTAwJTtcbiAgICBoZWlnaHQ6MTAwJTtcbiAgICBwYWRkaW5nOiAwIDhweDtcbiAgICBtYXJnaW46MDtcbmA7XG5cbmV4cG9ydCB7VGltZUZvcm1hdHRlcn07XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///../shared/src/components/Formatter/TimeFormmater.tsx\n");

/***/ })

})