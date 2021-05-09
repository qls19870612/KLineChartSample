import Vue from 'vue'
import App from './App.vue'
Vue.config.productionTip = false
if (!window.cancelAnimationFrame)
  window.cancelAnimationFrame = function(id) {
    clearTimeout(id);
  };

new Vue({
  render: h => h(App),
}).$mount('#app')
