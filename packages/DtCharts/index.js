/*
 * @Description: DtCharts 用于渲染echarts，1.接收每个seriesItem 2.处理成option 3.将prop传递的额外组件替换option对应的组件 4.设置option
                 优先级:this.$dtChartsGlobalOpt < this.defOpt < this.option < setting
 * @Author: yanxiao
 * @Github: https://github.com/yanxiaos
 * @Date: 2021-12-22 15:03:56
 * @LastEditors: yanxiao
 */
import * as echarts from "echarts";
import Loading from '../../components/loading'
import DataEmpty from '../../components/data-empty'
import {
  deepMergeObj,
  mergeObject,
  mergeArray
} from "../../utils/utils";
import { debounce } from "../../utils/debounce";
import {
  isObject, isArray,
  isExist
} from "../../utils/getType";

import {
  DEFAULT_THEME,
  ECHARTS_SETTINGS
} from '../../constants'

export default {
  name: 'DtCharts',
  componentName: 'DtCharts',
  // render 函数若存在，则 Vue 构造函数不会从 template 选项或通过 el 选项指定的挂载元素中提取出的 HTML 模板编译渲染函数。
  render (h) {
    return h('div', {
      // class: [camelToKebab(this.$options.name || this.$options._componentTag)],
      style: this.canvasStyle,
    }, [
      // 渲染 canvas
      h('div', {
        style: this.canvasStyle,
        // 空状态或者加载中状态 添加遮罩层class
        class: {
          'dt-charts': true,
          'v-charts-mask-status': this.dataEmpty || this.loading
        },
        ref: 'canvas'
      }),
      // 空状态
      h(DataEmpty, {
        style: { display: this.dataEmpty ? '' : 'none' }
      }),
      // 加载中状态
      h(Loading, {
        style: { display: this.loading ? '' : 'none' }
      }),
      // 插槽
      this.$slots.default
    ])
  },
  props: {
    // 初始化图表init时的配置项
    initOptions: { type: Object, default () { return {} } },
    // setOption时的配置项
    setOptionOpts: { type: Object, default () { return {} } },
    // 宽
    width: { type: String, default: '' },
    // 高
    height: { type: String, default: '' },
    // 空状态
    dataEmpty: Boolean,
    // 加载中状态
    loading: Boolean,

    // 主题: json配置文件或注册过的主题名
    theme: [Object, String],
    // 单个组件的默认配置
    defOpt: { type: Object, default: () => { } },


    // 是否开启resize，默认开启
    resizeable: { type: Boolean, default: true },
    // resize处理间隔
    resizeDelay: { type: Number, default: 0 },
    // 子组件发生改变后处理option的间隔
    changeDelay: { type: Number, default: 0 },

  },
  computed: {
    canvasStyle () {
      return {
        width: this.width,
        height: this.height,
        position: 'relative'
      }
    },
  },
  created () {
    // 处理option的防抖函数
    this.handlerOption = debounce(this.optionHandler, this.changeDelay, 11)
    // resize的防抖函数
    // this.resizeHandler = debounce(this.resize, this.resizeDelay)
    // 监听子组件数据变化
    this.$on('handleChild', this.handleChild)
    // 监听组件销毁
    this.$on('hiddenChild', this.hiddenChild)
  },
  mounted () {
    // 初始化echarts
    this.init()
    this.handlerOption({ notMerge: true })
  },

  beforeDestroy () {
    this.clean()
  },

  data () {
    return {
      echarts: null,
      option: {},
      optionObj: {}
    }
  },
  watch: {
    // 主题
    theme: {
      deep: true,
      handler: 'themeChange'
    },
    $attrs: {
      deep: true,
      handler () {
        this.handlerOption({ notMerge: true })
      }
    },
    // 是否开启resize，默认开启
    resizeable: 'resizeableHandler'
  },
  methods: {

    // 子组件数据变化
    handleChild (option, componentId) {
      // 相同子组件新数据覆盖之前的数据
      this.optionObj[componentId] = option
      this.option = {}
      // 不同子组件的option合并为一个option
      for (const key in this.optionObj) {
        this.option = this.mergeOption(this.option, this.optionObj[key])
      }
      // 处理option
      this.handlerOption({ notMerge: false })
    },

    // option合并(配置项中的 数组差量合并)
    mergeOption (option, diffOption) {
      let result = {}
      for (const opt in diffOption) {
        if (isObject(diffOption[opt])) {
          result[opt] = mergeObject(option[opt] || {}, diffOption[opt])
        } else if (isArray(diffOption[opt])) {
          // 数组合并--series数组拼接，其他配置进行数组合并（因为：例如xAxis有多个重复的配置只需要一个，series）
          if (opt === 'series') {
            result[opt] = [...option[opt] || [], ...diffOption[opt]]
          } else {
            // 其他配置只有不一样时才会拼接，如果一样会覆盖
            result[opt] = mergeArray(option[opt] || [], diffOption[opt])
          }
        } else {
          result[opt] = diffOption[opt]
        }
      }
      return { ...option, ...result }
    },
    // 处理option 优先级:defOpt < this.option < setting
    optionHandler ({ notMerge }) {
      // 1. 设置默认option
      let defOpt = deepMergeObj(this.$dtChartsGlobalOpt, this.defOpt, notMerge)
      this.option = deepMergeObj(defOpt, this.option, notMerge)
      // 2. 设置用户prop传递的option
      for (let i = 0; i < ECHARTS_SETTINGS.length; i++) {
        let opItem = ECHARTS_SETTINGS[i]
        let setting = this.$attrs[opItem]
        if (isExist(setting)) {
          this.option[opItem] = deepMergeObj(this.option[opItem], setting, notMerge)
        }
      }
      // 返回option
      this.setOption(this.option)
    },

    // 子组件隐藏
    hiddenChild (componentId) {
      // 相同子组件新数据覆盖之前的数据
      delete this.optionObj[componentId]
      this.option = {}
      // 不同子组件的option合并为一个option
      for (const key in this.optionObj) {
        this.option = this.mergeOption(this.option, this.optionObj[key])
      }
      // 处理option
      this.handlerOption({ notMerge: true })
    },

    // 初始化echarts
    init () {
      // 如果图表存在则直接退出
      if (this.echarts) return
      // 主题 优先级: 主题名 ->全局主题 -> 默认主题
      const theme = this.theme || this.$dtChartsGlobalTheme || DEFAULT_THEME
      this.echarts = echarts.init(this.$refs.canvas, theme, this.initOptions)
      // 启用resize
      if (this.resizeable) this.addResizeListener()

    },
    // 主题发生改变
    themeChange () {
      this.$emit('themeChange')
      // 销毁图表
      this.clean()
      // 重新初始化
      this.init()
    },
    // 是否开启resize，watch发生改变，重新设置
    resizeableHandler (resizeable) {
      resizeable ? this.addResizeListener() : this.removeResizeListener()
    },

    // 窗口尺寸发生变化重新设置echarts尺寸
    resize () {
      if (this.echarts) {
        this.echarts.resize()
        this.$emit('resize')
      }
    },

    // 监听resize
    addResizeListener () {
      window.addEventListener('resize', this.resizeHandler)
    },
    // 删除resize
    removeResizeListener () {
      window.removeEventListener('resize', this.resizeHandler)
    },
    // 销毁图表
    clean () {
      // 如果开启了resiz，则删除removeResizeListener
      if (this.resizeable) this.removeResizeListener()
      // 调用图表销毁方法
      this.echarts.dispose()
      this.echarts = null
    },
    // 设置配置
    setOption (options) {
      this.echarts.setOption(options, {
        notMerge: true,
        ...this.setOptionOpts
      })
      this.$emit('setOption', this.option)
    },
    getOption () {
      return this.option
    }
  }
}
