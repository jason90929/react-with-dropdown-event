# How to use it

Like HOC usage, and bind on your dropdown components, bind props.id, props.dropdownActive, and props.toogleDropdown function on your components
```
export default withDropdownEvent(MyCustomDropdown, {
  disableClickDropdownClose: false,
  useCapture: false,
});
```
