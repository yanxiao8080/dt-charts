/*
 * @Description: 
 * @Author: yanxiao
 * @Github: https://github.com/yanxiaos
 * @Date: 2022-02-11 11:35:55
 * @LastEditors: yanxiao
 */
import Emitter from "../../emitter";
import { isObject, isString } from "../../utils/getType";
import { mergeArray } from "../../utils/utils";
export default {
  name: 'DtRadar',
  componentName: 'DtRadar',
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
      let legendData = []
      let radarList = []
      let indicatorText = ''

      for (const col in this.columns) {
        // 设置seriesItem.name
        if (isObject(this.columns[col])) {
          // 如果是对象且对象内没有name，设置col为name
          this.columns[col].name ? null : this.columns[col].name = col
          if (isObject(this.columns[col].data)) {
            this.columns[col].data.name ? null : this.columns[col].data.name = this.columns[col].name
          } else if (isString(this.columns[col].data)) {
            this.columns[col].data = { name: this.columns[col].data }
          }
        } else if (isString(this.columns[col])) {
          // 如果是字符串，
          this.columns[col] = {
            name: this.columns[col],
            data: {
              name: this.columns[col]
            }
          }
        }
        indicatorText = this.columns[col].indicatorText || ''
        legendData.push(this.columns[col].data.name)
        let seriesItem = {
          // 设置默认配置
          ...this.itemOpt,
          // 该seriesItem额外的配置,包含空data
          ...this.columns[col],
          // 所以将data放在下面
          data: [{
            ...this.itemOpt.data,
            value: this.rows.map(row => row[col]),
            ...this.columns[col].data
          }],
          // 该组件固定为 bar
          type: 'radar'
        }
        series.push(seriesItem)

        radarList = mergeArray(radarList, [{
          indicator: this.rows.map(item => ({
            name: item[indicatorText],
          }))
        }])
      }
      this.option = {
        series: series,
        radar: radarList,
        tooltip: {},
        legend: {
          data: legendData
        },
      }
      this.dispatch('DtCharts', 'handleChild', [this.option, this._uid]);
    },
    // 隐藏子组件
    hiddenChange () {
      this.hidden ?
        this.dispatch('DtCharts', 'hiddenChild', [this._uid]) :
        this.dispatch('DtCharts', 'handleChild', [this.option, this._uid]);
    },
  }
}