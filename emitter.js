function broadcast (componentName, eventName, params) {
  this.$children.forEach(child => {
    var name = child.$options.componentName;

    if (name === componentName) {
      // 调用指定组件的$emit方法
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    // 向上广播，直到找到指定的组件名 componentName
    dispatch (componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        // 调用指定组件的$emit方法
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    // 向下递归广播，直到找到指定的组件名componentName
    broadcast (componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
};
