/*
 * @Description: 饼图组件DtPie: 接收data 返回seriesItem
 * @Author: yanxiao
 * @Github: https://github.com/yanxiaos
 * @Date: 2021-12-22 15:09:35
 * @LastEditors: yanxiao
 */
import Emitter from "../../emitter";
import { isObject, isString } from "../../utils/getType";
export default {
  name: 'DtPie',
  componentName: 'DtPie',
  render () { },
  mixins: [Emitter],
  props: {
    rows: { type: [Array], default () { return [] } },
    columns: { type: Object, default: () => ({}) },
    itemOpt: { type: Object, default: () => ({}) },
    hidden: { type: Boolean, default: false }
  },

  watch: {
    rows: {
      deep: true,
      handler (v) { if (v) { this.handlerData() } }
    },
    columns: {
      deep: true,
      handler (v) { if (v) { this.handlerData() } }
    },
    itemOpt: {
      deep: true,
      handler (v) { if (v) { this.handlerData() } }
    },
    // 子组件隐藏
    hidden: 'hiddenChange'
  },


  data () {
    return {
      option: {},
    }
  },

  mounted () {
    this.handlerData()
  },

  methods: {
    // 处理data 返回 seriesItem
    handlerData () {
      // 每次处理时数据置空
      this.option = {}

      let series = []

      for (const col in this.columns) {
        // 设置seriesItem.name
        let dataName = ''
        if (isObject(this.columns[col])) {
          // 如果是对象且对象内没有name，设置col为name
          this.columns[col].name ? null : this.columns[col].name = col
        } else if (isString(this.columns[col])) {
          // 如果是字符串，
          this.columns[col] = { name: this.columns[col] }
        }
        dataName = this.columns[col].dataName || this.itemOpt.dataName || ''
        let seriesItem = {
          // 设置默认配置
          ...this.itemOpt,
          data: this.rows.map(row => {
            return {
              value: row[col],
              name: row[dataName]
            }
          }),
          // 该seriesItem额外的配置
          ...this.columns[col],
          // 该组件固定为 bar
          type: 'pie'
        }
        series.push(seriesItem)
      }
      this.option = {
        series: series,
        tooltip: {
          trigger: 'item',
        },
        legend: {},
      }
      if (!this.hidden) {
        this.dispatch('DtCharts', 'handleChild', [this.option, this._uid]);
      }
    },

    // 隐藏子组件
    hiddenChange () {
      this.hidden ?
        this.dispatch('DtCharts', 'hiddenChild', [this._uid]) :
        this.dispatch('DtCharts', 'handleChild', [this.option, this._uid]);
    },
  }
}