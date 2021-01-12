var React = require('react');
var PropTypes = require('prop-types');
var createReactClass = require('create-react-class');

var uniqueId = 0;
// selectData.disableWindowClose = true 代表需要透過 JavaScript 去關閉
// selectData.disableClickDropdownClose = true 代表打開的 Dropdown 按下後不會關閉
function withDropdownEvent(WrappedComponent, selectData) {
  if (selectData === undefined) {
    selectData = {};
  }

  var DropdownEvent = createReactClass({
    getInitialState() {
      uniqueId += 1;
      return {
        id: 'dropdown-' + uniqueId,
        isActive: false,
      };
    },

    componentWillUnmount() {
      document.removeEventListener('click', this.bindWindowToCloseDropdown, selectData.useCapture);
    },

    bindWindowToCloseDropdown(event) {
      if (selectData.disableWindowClose) {
        return;
      }
      if (selectData.disableClickDropdownClose) {
        var target = document.getElementById(this.state.id);
        if (target) {
          var allChildNodes = target.querySelectorAll('*');
          if (Array.prototype.includes.call(allChildNodes, event.target)
            || target === event.target) {
            return;
          }
        }
      }
      event.preventDefault();
      this.toggleDropdown(false);
    },

    showDropdown() {
      this.toggleDropdown(true);
    },

    toggleDropdown(isActive) {
      this.setState(function (prevState) {
        return {
          isActive: (isActive !== void 0)
            ? isActive
            : !prevState.isActive,
        };
      });
      window.setTimeout(function (self) {
        var eventListener = isActive ? 'addEventListener' : 'removeEventListener';
        document[eventListener]('click', self.bindWindowToCloseDropdown, selectData.useCapture);
      }, 0, this);
    },

    render() {
      var props = Object.assign({}, this.props, {
        id: this.state.id,
        ref: this.props.forwardedRef,
        dropdownActive: this.state.isActive,
        toggleDropdown: this.toggleDropdown,
      });
      delete props.forwardedRef;

      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return React.createElement(
        WrappedComponent,
        props,
      );
    },

    getDefaultProps() {
      return {
        forwardedRef: void 0,
      };
    },

    propTypes: {
      forwardedRef: PropTypes.any,
    },
  });

  function forwardRef(props, ref) {
    var myProps = Object.assign({}, props, {
      forwardedRef: ref,
    });

    return React.createElement(
      DropdownEvent,
      myProps,
    );
  }

  return React.forwardRef(forwardRef);
}

module.exports = withDropdownEvent;
