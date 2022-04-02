/*
 * @Description: 
 * @Author: yanxiao
 * @Github: https://github.com/yanxiaos
 * @Date: 2021-12-22 14:53:44
 * @LastEditors: yanxiao
 */
import './theme/charts.css';

import DtCharts from './packages/DtCharts'
import DtBar from './packages/DtBar'
import DtLine from './packages/DtLine'
import DtPie from './packages/DtPie'
import DtPictorialBar from './packages/DtPictorialBar'
import DtRadar from './packages/DtRadar'

const components = [
  DtCharts,
  DtBar,
  DtLine,
  DtPie,
  DtPictorialBar,
  DtRadar
]

function install (Vue, option = {}) {
  components.forEach(component => {
    Vue.component(component.name, component)
    // 可以在注册时绑定公共配置，默认空对象
    Vue.prototype.$dtChartsGlobalOpt = option.globalOpt || {}
    // 可以在注册时绑定全局主题，默认空对象
    Vue.prototype.$dtChartsGlobalTheme = option.theme || {}
  })
}

export {
  DtCharts,
  DtBar,
  DtLine,
  DtPie,
  DtPictorialBar,
  DtRadar,
}

export default {
  install
}
