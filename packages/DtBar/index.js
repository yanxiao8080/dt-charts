/*
 * @Description: 柱状图组件 DtBar: 接收 data 返回 seriesItem
 * @Author: yanxiao
 * @Github: https://github.com/yanxiaos
 * @Date: 2021-12-22 14:54:40
 * @LastEditors: yanxiao
 */
import Emitter from "../../emitter";
import { isObject, isString } from "../../utils/getType";
export default {
  name: 'DtBar',
  componentName: 'DtBar',
  render () { },
  mixins: [Emitter],
  props: {
    rows: { type: Array, default: () => [] },
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
      // copy columns
      let columns = { ...this.columns }
      // 每次处理时数据置空
      this.option = {}
      this.xAxis = []
      this.yAxis = []

      let series = []

      for (const col in columns) {
        // 
        if (['xAxis', 'yAxis'].includes(columns[col])) {
          this.setAxis(col)
          continue
        }

        // 设置seriesItem.name
        if (isObject(columns[col])) {
          // 如果是对象且对象内没有name，设置col为name
          columns[col].name ? null : columns[col].name = col
        } else if (isString(columns[col])) {
          // 如果是字符串，
          columns[col] = { name: columns[col] }
        } else {
          throw '[DtBar Function handlerData] columns 不是Object也不是String'
        }
        let seriesItem = {
          // 设置默认配置
          ...this.itemOpt,
          data: this.rows.map(row => row[col]),
          // 该seriesItem额外的配置
          ...columns[col],
          // 该组件固定为 bar
          type: 'bar'
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