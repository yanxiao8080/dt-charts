/*
 * @Description: 
 * @Author: yanxiao
 * @Github: https://github.com/yanxiaos
 * @Date: 2022-01-05 10:56:40
 * @LastEditors: yanxiao
 */
import Emitter from "../../emitter";
import { isObject, isString } from "../../utils/getType";
export default {
  name: 'DtPictorialBar',
  componentName: 'DtPictorialBar',
  render () { },
  mixins: [Emitter],
  props: {
    rows: { type: [Array], default: () => [] },
    columns: { type: [Object], default: () => { } },
    itemOpt: { type: Object, default: () => { } },
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
      xAxis: [],
      yAxis: []
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
      this.xAxis = []
      this.yAxis = []

      let series = []
      for (const col in this.columns) {
        // 
        if (['xAxis', 'yAxis'].includes(this.columns[col])) {
          this.setAxis(col)
          continue
        }

        // 设置seriesItem.name
        if (isObject(this.columns[col])) {
          this.columns[col].name ? null : this.columns[col].name = col
          // 如果是对象且对象内没有name，设置col为name
          this.columns[col].name = col
        } else if (isString(this.columns[col])) {
          // 如果是字符串，
          this.columns[col] = { name: this.columns[col] }
        } else {
          throw '[DtBar Function handlerData] columns 不是Array也不是Object'
        }
        let seriesItem = {
          // 设置默认配置
          ...this.itemOpt,
          data: this.rows.map(row => row[col]),
          // 该seriesItem额外的配置
          ...this.columns[col],
          // 该组件固定为 bar
          type: 'pictorialBar'
        }
        series.push(seriesItem)
      }
      this.option = {
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        series: series,
        tooltip: {
          trigger: 'axis'
        },
        legend: {},
      }
      if (!this.hidden) {
        this.dispatch('DtCharts', 'handleChild', [this.option, this._uid]);
      }
    },

    // 设置x，y轴(需要继续优化：支持设置坐标轴其他配置)
    setAxis (col) {
      if (this.columns[col] === 'xAxis') {
        this.xAxis.push({
          type: 'category',
          data: this.rows.map(row => row[col])
        })
        this.yAxis.push({
          type: 'value',
        })
      } else {
        this.yAxis.push({
          type: 'category',
          data: this.rows.map(row => row[col])
        })
        this.xAxis.push({
          type: 'value',
        })
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