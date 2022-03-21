# 介绍

`dt-charts`是基于`echarts`封装的图表组件，使用它绘制图表可以大量减少你的时间和代码量。

使用dt-charts绘制图表时可以将数据从复杂的配置中抽离出来，让你更加专注与对数据的处理

你也可以将配置抽离出来单独管理，并设置在全局或者部分图表上，所以`dt-charts`在应对大量图时可以表现的十分出色

我们使用echarts时总是需要大量时间将接口返回的数据处理成echarts需要的数据，使用`dt-charts`只需要简单的配置即可帮你快速的处理数据。

`dt-charts`的使用方式和暴露的接口遵循大部分`UI`组件的规则，这可以帮助你快速上手。

# 安装

```shell
npm install dt-charts -s
```

# 快速上手

### 全量加载

在`main.js`并注册

```js
import Vue from "vue";
import App from "./App.vue";

import dtCharts from "dt-charts";

Vue.config.productionTip = false;

// globalOpt: 注册时可以传入全局的配置(同echarts的配置项)
Vue.use(dtCharts [,globalOpt])

new Vue({
  render: (h) => h(App),
}).$mount("#app");

```

### 按需加载

```js
import { DtCharts, DtBar } from "d-charts"
export default {
  components: {
      DtCharts,
      DtBar
  },
}
```

# 设计思想

1. 基础组件`dt-charts`，需要包裹在所有组件外层，他负责处理除series以外的数据，并将图像绘制出来
2. 每种类型的图表都封装了一个单独的组件，例如: `dt-bar`、`dt-line`、`dt-pie`
3. 可以将多个及多种类型的组件插入到`dt-charts`组件内，使它们在一张图上显示
4. 每种类型的图表组件专注于对series数据的处理，`dt-charts`组件负责接收处理后的series数据并对多个子组件的数据进行合并然后渲染到页面上
5. `dt-charts`组件专注于对series以外的公共的配置进行处理，例如：`title`、`legend`、`tooltip`，以及设置主题、加载中动画、空状态、

# 绘制一个简单的图表

```html
<template>
  <div class='home'>
    <dt-charts>
      <dt-bar :rows="rows"
              :columns="columns"></dt-bar>
    </dt-charts>
  </div>
</template>
<script>
    export default {
        name: 'Test',
        data(){
            return {
                // 模拟接口数据
                rows: [
                    { 'date': '01-01', 'PV': 1231, 'OP': 2342 },
                    { 'date': '01-02', 'PV': 1223, 'OP': 1342 },
                    { 'date': '01-03', 'PV': 2123, 'OP': 2312 },
                    { 'date': '01-04', 'PV': 4123, 'OP': 2242 },
                    { 'date': '01-05', 'PV': 3123, 'OP': 6342 },
                    { 'date': '01-06', 'PV': 7123, 'OP': 2142 }
                ],
                // columns用来定义将rows中的哪些字段绘制出来，以及设置seriesItem的其他配置
                columns: {
                    // 将rows中的date字段渲染成x轴且x轴为类目轴，如果想让date字段为y轴可以设置为yAxis
                    'date': 'xAxis',
                    // 将rows中的PV字段绘制出来，
                    'PV': {
                        // 这里写seriesItem里的所有一级配置
                        stack: '总数',
                        barWidth: 30
                    },
                    'OP': {
                        stack: '总数',
                        name: 'OPname'
                    }
                },
            }
        }
    }    
</script>
```

查看效果

![](https://i.bmp.ovh/imgs/2022/02/9ca78434e0e6ea62.png)

下面我们再渲染一个折线图，并给图表加上主题

```html
<template>
    <div class='home'>
      <dt-charts :theme="vintage">
        <dt-bar :rows="rows"
                :columns="columns"></dt-bar>
        <dt-line :rows="rows"
                 :columns="columnsLine"></dt-line>
      </dt-charts>
    </div>
<template>
<script>
    // 从echarts官网下载下来的主题文件
    import vintage from "@/theme/vintage.json";
    export default {
        name: 'Test',
        data(){
            return {
      					vintage: vintage,
                // 模拟接口数据
                rows: [
                    { 'date': '01-01', 'PV': 1231, 'OP': 2342, 'PV2': 1231, 'OP2': 2342 },
                    { 'date': '01-02', 'PV': 1223, 'OP': 1342, 'PV2': 1223, 'OP2': 1342 },
                    { 'date': '01-03', 'PV': 2123, 'OP': 2312, 'PV2': 2123, 'OP2': 2312 },
                    { 'date': '01-04', 'PV': 4123, 'OP': 2242, 'PV2': 4123, 'OP2': 2242 },
                    { 'date': '01-05', 'PV': 3123, 'OP': 6342, 'PV2': 3123, 'OP2': 6342 },
                    { 'date': '01-06', 'PV': 7123, 'OP': 2142, 'PV2': 7123, 'OP2': 2142 }
                ],
                columns: {
                    'date': 'xAxis',
                    'PV': {
                        stack: '总数',
                        barWidth: 30
                    },
                    'OP': {
                        stack: '总数',
                        name: 'OPname'
                    }
                },
                columnsLine: {
                    'PV2': {
                        stack: '总数',
                    },
                    'OP2': {
                        name: 'OPname2'
                    }
                },
            }
        }
    }    
</script>
```

查看效果

![](https://i.bmp.ovh/imgs/2022/02/65744a17f9a5a2ff.png)

# dt-charts

dt-charts是最重要的组件，所有图表都需要包裹在它里面

### props

| 参数               | 说明                                                         | 类型               | 默认值  |
| ------------------ | ------------------------------------------------------------ | ------------------ | ------- |
| `initOptions`      | 初始化图表`echarts.init`时的配置项                           | Object             | {}      |
| `setOptionOpts`    | `echarts.setOption`时的配置项                                | Object             | {}      |
| `width`            | 图表宽度                                                     | String             | auto    |
| `height`           | 图表高度                                                     | String             | `400px` |
| `dataEmpty`        | 空数据状态                                                   | Boolean            | false   |
| `loading`          | 加载中状态                                                   | Boolean            | false   |
| `theme`            | 主题: json配置文件或注册过的主题名                           | Object \|\| String | -       |
| `defOpt`           | 默认配置（优先级大于全局配置globalOpt，小于`ECHARTS_SETTINGS`和子组件的itemOpt） | Object             | {...}   |
| `resizeable`       | 是否开启`resize`                                             | Boolean            | true    |
| `resizeDelay`      | `resize`处理间隔，单位 `ms`                                  | Number             | 0       |
| `changeDelay`      | 子组件发生改变后处理option的间隔，单位 `ms`                  | Number             | 0       |
| `ECHARTS_SETTINGS` | `echarts`的其他配置（优先级大于默认配置defOpt），如果一些配置defOpt不能生效，建议使用`ECHARTS_SETTINGS`来覆盖，因为它的优先级最高 |                    |         |

配置项优先级：

`globalOpt`  全局配置

< `defOpt` dt-charts的默认配置

< （ 子组件option.series中的配置: `itemOpt` <  `columns` 

​		子组件option其他配置：子组件中的一些默认配置）

 < `ECHARTS_SETTINGS ` dt-charts的默认配置

`ECHARTS_SETTINGS` 其他配置列表如下（可选值与官网一致） 

```js
ECHARTS_SETTINGS = [
  'title', 'legend', 'grid', 'xAxis',
  'yAxis', 'polar', 'radiusAxis', 'angleAxis',
  'radar', 'dataZoom', 'visualMap', 'tooltip',
  'axisPointer', 'toolbox', 'brush', 'geo',
  'parallel', 'parallelAxis', 'singleAxis', 'timeline',
  'graphic', 'calendar', 'dataset', 'aria',
  'series', 'darkMode', 'color', 'backgroundColor',
  'textStyle', 'animation', 'animationThreshold', 'animationDuration',
  'animationEasing', 'animationDelay', 'animationDurationUpdate', 'animationEasingUpdate',
  'animationDelayUpdate', 'stateAnimation', 'blendMode', 'hoverLayerThreshold',
  'useUTC', 'options', 'media'
]
```



例：

```html
<dt-charts :title="title"
           :legend="legend">
    <dt-bar :rows="rows"
            :columns="columns"></dt-bar>
</dt-charts>
```

```js
export default {
    data(){
        return {
            title:{
                text: "销量统计",
                textStyle:{
                    color: '#c9c9c9'
                }
            },
            legend:{
                show: false
            }
        }
    }
}
```

如果你的配置项太多，推荐使用 v-bind="option" 的方式来绑定

```html
<dt-charts v-bind="option">
    <dt-bar :rows="rows"
            :columns="columns"></dt-bar>
</dt-charts>
```

```js
export default {
    data(){
        return {
            option:{
              title:{...},
              legend:{...},
              grid:{...},
              tooltip:{...}
            }
        }
    }
}
```

### dt-echarts实例、方法

```html
<dt-charts ref="myEcharts">
</dt-charts>
```

```js
// 组件实例
// 获取echarts实例
this.$refs.myEcharts.echarts

// 组件方法
// 初始化echarts
this.$refs.myEcharts.init()
// 销毁echarts
this.$refs.myEcharts.clean()
// 获取设置的option
this.$refs.myEcharts.getOption
// 重新设置echarts尺寸
this.$refs.myEcharts.resize()
```

### dt-echarts事件

```html
<dt-charts @themeChange="themeChange"
           @setOption="setOption"
           @resize="resize">
</dt-charts>
```

```js
themeChange(){
	console.log('主题发生改变')
},
setOption(option){
	console.log('设置setOption时触发，设置的option为：', option)
}
resize(){
	console.log('resizeable=true时resize被触发')
}
```

### 空数据、加载中

```html
<!-- 空数据 -->
<dt-charts :dataEmpty="true"></dt-charts>
<!-- 加载中 -->
<dt-charts :loading="true"></dt-charts>
```

![](https://i.bmp.ovh/imgs/2022/03/7637e9e544cbfeab.png)

![](https://i.bmp.ovh/imgs/2022/03/e8e7d41141374f14.png)

# dt-bar、dt-line、dt-pictorialBar

- dt-bar 柱状图
- dt-line 折线图
- dt-pictorialBar 象形柱状图

### props

| 参数      | 说明               | 类型    | 默认值 |
| --------- | ------------------ | ------- | ------ |
| `rows`    | 数据集合           | Array   | []     |
| `columns` | 配合rows展示数据   | Object  | {}     |
| `itemOpt` | 默认的配置项       | Object  | {}     |
| `hidden`  | 是否将组件数据隐藏 | Boolean | false  |

`rows`为数据集合

`columns`用来定义将rows中的哪些字段绘制出来，以及设置`seriesItem`的其他配置

`itemOpt`series[item]的默认配置，优先级最低，会被columns里的配置覆盖

`hidden`是否将组件数据隐藏，在子组件上使用 v-if或v-show，数据都不能正确的显示隐藏，如果你有这个需求请使用hidden

例：

```html
<dt-charts :title="title"
           :legend="legend">
    <dt-bar :rows="rows"
            :columns="columns"></dt-bar>
</dt-charts>
```

```js
export default {
    data(){
        return{
          title:{
                text: "销量统计",
                textStyle:{
                    color: '#c9c9c9'
                }
            },
            legend:{
                show: false
            },
            rows: [
                { 'date': '01-01', 'PV': 1231, 'OP': 2342, 'PV2': 1231, 'OP2': 2342 },
                { 'date': '01-02', 'PV': 1223, 'OP': 1342, 'PV2': 1223, 'OP2': 1342 },
                { 'date': '01-03', 'PV': 2123, 'OP': 2312, 'PV2': 2123, 'OP2': 2312 },
                { 'date': '01-04', 'PV': 4123, 'OP': 2242, 'PV2': 4123, 'OP2': 2242 },
                { 'date': '01-05', 'PV': 3123, 'OP': 6342, 'PV2': 3123, 'OP2': 6342 },
                { 'date': '01-06', 'PV': 7123, 'OP': 2142, 'PV2': 7123, 'OP2': 2142 }
            ],
            columns: {
                'date': 'xAxis',
                'PV': {
                    stack: '总数',
                    barWidth: 30
                },
                'OP': {
                    stack: '总数',
                    name: 'OPname'
                }
            },
        }
    }
}
```

columns中定义的字段都会渲染到页面上

示例中`columns.date`的值为`xAxis`，代表该图x轴为类目轴且rows中的date字段为类目轴数据，可选值：`xAxis`、`yAxis`

`'PV': {
	stack: '总数',
	barWidth: 30
}`

代表渲染rows中的`PV`字段，并将`PV`的值合并到`echarts`的`option.series[item]`中，可选值与`echarts`官网一致

其中option.series[item].name是必须存在的，如PV字段没有name选项，我们会直接将PV作为name的值生成配置

如果某个字段不需要其他配置，也可以直接简写，如 `OP:'OPname'`，OP是要渲染的字段，OPname是option.series[n].name

例如`dt-bar`组件`columns`中的配置，对应`echarts`配置项的`series`类型为`bar`的配置

上方代码生成后的完整option如下

```json
// 你会发现生成后的配置多出了很多配置项，这是为了更好的体验，我们使不同的图携带了一些配置
{
    "title": {
        "show": true,
        "text": ""
    },
    "legend": {
        "show": false,
        "left": "10%",
        "right": "10%",
        "type": "scroll",
        "icon": "circle"
    },
    "tooltip": {
        "show": true,
        "trigger": "axis"
    },
    "grid": {
        "top": "15%",
        "left": "3%",
        "right": "5%",
        "bottom": "5%",
        "containLabel": true
    },
    "xAxis": [
        {
            "type": "category",
            "data": [
                "01-01",
                "01-02",
                "01-03",
                "01-04",
                "01-05",
                "01-06"
            ]
        }
    ],
    "yAxis": [
        {
            "type": "value"
        }
    ],
    "series": [
        {
            "data": [
                1231,
                1223,
                2123,
                4123,
                3123,
                7123
            ],
            "stack": "总数",
            "barWidth": 30,
            "name": "PV",
            "type": "bar"
        },
        {
            "data": [
                2342,
                1342,
                2312,
                2242,
                6342,
                2142
            ],
            "stack": "总数",
            "name": "OPname",
            "type": "bar"
        }
    ]
}
```

# dt-pie饼图

### props

| 参数      | 说明               | 类型    | 默认值 |
| --------- | ------------------ | ------- | ------ |
| `rows`    | 数据集合           | Array   | []     |
| `columns` | 配合rows展示数据   | Object  | {}     |
| `itemOpt` | 默认的配置项       | Object  | {}     |
| `hidden`  | 是否将组件数据隐藏 | Boolean | false  |

`rows`为数据集合

`columns`用来定义将rows中的哪些字段绘制出来，以及设置`seriesItem`的其他配置

`itemOpt`series[item]的默认配置，优先级最低，会被columns里的配置覆盖

`hidden`是否将组件数据隐藏，在子组件上使用 v-if或v-show，数据都不能正确的显示隐藏，如果你有这个需求请使用hidden

和柱状图不同的是饼图有两个name，一个是系列的name（series[item].name），一个是数据的name（series[item].data[item].name）

所以要指定数据name的话需要在columns里定义dataName字段

例：

![](https://s3.bmp.ovh/imgs/2022/03/a2b351bf4a34b6aa.png)

```html
<dt-charts :theme="walden"
           :legend="legend">
  <dt-pie :rows="rows"
          :columns="columns"></dt-pie>
</dt-charts>
```

```js
import walden from "@/theme/walden.json";
export default {
  data () {
    //这里存放数据
    return {
      walden: walden,
      columns: {
        // 内圈饼图
        count: {
          // 这个name代表series系列的name
          name: '销量',
          // dataName指定系列中数据的name，值对应rows中的字段
          dataName: 'display_str',
          // radius：饼图的半径
          radius: ['0%', '20%'],
          // 内圈隐藏label
          label: {
            show: false
          }
        },
        // 外圈饼图
        amount: {
          name: '金额',
          dataName: 'display_str',
          radius: ['40%', '60%'],
          // 外圈显示label
          label: {
            show: true
          }
        }
      },
      legend: {
        show: true,
        // legend.data可以是系列的name，也可以是数据的name
        data: ["上衣", "裤子", "裙子", "帽子", "鞋子", "短袖", "棉服"]
        // data: ["count", "金额"]
      },
      rows: [
        { "display_str": "上衣", "count": 19.0, "amount": 2953.07 },
        { "display_str": "裤子", "count": 60.0, "amount": 2836.69 },
        { "display_str": "裙子", "count": 67.0, "amount": 1524.0 },
        { "display_str": "帽子", "count": 385.0, "amount": 3874.53 },
        { "display_str": "鞋子", "count": 285.0, "amount": 1710.73 },
        { "display_str": "短袖", "count": 173.0, "amount": 961.05 },
        { "display_str": "棉服", "count": 96.0, "amount": 1342.1 }
      ],
    };
  },
}
```

上方代码生成的配置如下

```json
{
    "series": [
        {
            "data": [
                {
                    "value": 19,
                    "name": "上衣"
                },
                {
                    "value": 60,
                    "name": "裤子"
                },
                {
                    "value": 67,
                    "name": "裙子"
                },
                {
                    "value": 385,
                    "name": "帽子"
                },
                {
                    "value": 285,
                    "name": "鞋子"
                },
                {
                    "value": 173,
                    "name": "短袖"
                },
                {
                    "value": 96,
                    "name": "棉服"
                }
            ],
            "name": "销量",
            "dataName": "display_str",
            "radius": [
                "0%",
                "20%"
            ],
            "label": {
                "show": false
            },
            "type": "pie"
        },
        {
            "data": [
                {
                    "value": 2953.07,
                    "name": "上衣"
                },
                {
                    "value": 2836.69,
                    "name": "裤子"
                },
                {
                    "value": 1524,
                    "name": "裙子"
                },
                {
                    "value": 3874.53,
                    "name": "帽子"
                },
                {
                    "value": 1710.73,
                    "name": "鞋子"
                },
                {
                    "value": 961.05,
                    "name": "短袖"
                },
                {
                    "value": 1342.1,
                    "name": "棉服"
                }
            ],
            "name": "金额",
            "radius": [
                "40%",
                "60%"
            ],
            "dataName": "display_str",
            "label": {
                "show": true
            },
            "type": "pie"
        }
    ],
    "tooltip": {
        "show": true,
        "trigger": "item"
    },
    "legend": {
        "show": true,
        "data": [
            "上衣",
            "裤子",
            "裙子",
            "帽子",
            "鞋子",
            "短袖",
            "棉服"
        ]
    }
}
```

# dt-radar雷达图

### props

| 参数      | 说明               | 类型    | 默认值 |
| --------- | ------------------ | ------- | ------ |
| `rows`    | 数据集合           | Array   | []     |
| `columns` | 配合rows展示数据   | Object  | {}     |
| `itemOpt` | 默认的配置项       | Object  | {}     |
| `hidden`  | 是否将组件数据隐藏 | Boolean | false  |

`rows`为数据集合

`columns`用来定义将rows中的哪些字段绘制出来，以及设置`seriesItem`的其他配置

`itemOpt`series[item]的默认配置，优先级最低，会被columns里的配置覆盖

`hidden`是否将组件数据隐藏，在子组件上使用 v-if或v-show，数据都不能正确的显示隐藏，如果你有这个需求请使用hidden

雷达图需要指定两个name，一个是系列的name（series[item].name），一个是数据的name（series[item].data[item].name

和饼图不同的是数据的name不需要dataName指定，因为雷达图的series[item].data[item]中也需要配置

雷达图指示器的数据需要indicatorText字段来声明

![](https://s3.bmp.ovh/imgs/2022/03/bbbae191e0763a0c.png)

```html
<dt-charts>
  <dt-radar :rows="rows"
            :columns="columns"></dt-radar>
</dt-charts>
```

```js
export default {
  data () {
    //这里存放数据
    return {
      rows: [
        { "display_str": "上衣", "count": 29.0, "amount": 53.07 },
        { "display_str": "裤子", "count": 30.0, "amount": 66.69 },
        { "display_str": "裙子", "count": 37.0, "amount": 54.0 },
        { "display_str": "帽子", "count": 35.0, "amount": 74.53 },
        { "display_str": "鞋子", "count": 25.0, "amount": 98.73 },
        { "display_str": "短袖", "count": 43.0, "amount": 61.05 },
        { "display_str": "棉服", "count": 46.0, "amount": 82.1 }
      ],
      columns: {
        count: {
          // series系列名称
          name: '数量',
          data: {
            // 数据名称
            name: 'data数量',
            // 其他配置
          },
          // 指示器文字
          indicatorText: 'display_str'
        },
        amount: {
          name: '单价',
          // data的值如果是String类型，则表示data.name
          data: 'data单价',
          indicatorText: 'display_str'
        }
      },
    };
  },
}
```

上方代码生成的配置如下

```json
{
    "series": [
        {
            "name": "数量",
            "data": [
                {
                    "value": [
                        29,
                        30,
                        37,
                        35,
                        25,
                        43,
                        46
                    ],
                    "name": "data数量"
                }
            ],
            "indicatorText": "display_str",
            "type": "radar"
        },
        {
            "name": "单价",
            "data": [
                {
                    "value": [
                        53.07,
                        66.69,
                        54,
                        74.53,
                        98.73,
                        61.05,
                        82.1
                    ],
                    "name": "data单价"
                }
            ],
            "indicatorText": "display_str",
            "type": "radar"
        }
    ],
    "radar": [
        {
            "indicator": [
                {
                    "name": "上衣"
                },
                {
                    "name": "裤子"
                },
                {
                    "name": "裙子"
                },
                {
                    "name": "帽子"
                },
                {
                    "name": "鞋子"
                },
                {
                    "name": "短袖"
                },
                {
                    "name": "棉服"
                }
            ]
        }
    ],
    "tooltip": {
        "show": true
    },
    "legend": {
        "data": [
            "data数量",
            "data单价"
        ]
    }
}
```

下面我想绘制两个雷达，左边雷达设置成圆形，右边雷达的样式填充颜色,圆点设为方形

![](https://s3.bmp.ovh/imgs/2022/03/eba5a9b13a9d57c9.png)

```html
<dt-charts :radar="radar">
  <dt-radar :rows="rows"
            :columns="columns"></dt-radar>
  <dt-radar :itemOpt="itemOpt"
            :rows="rows2"
            :columns="columns"></dt-radar>
</dt-charts>
```

```js
export default {
  data () {
    //这里存放数据
    return {
      rows: [
        { "display_str": "上衣", "count": 29.0, "amount": 53.07 },
        { "display_str": "裤子", "count": 30.0, "amount": 66.69 },
        { "display_str": "裙子", "count": 37.0, "amount": 54.0 },
        { "display_str": "帽子", "count": 35.0, "amount": 74.53 },
        { "display_str": "鞋子", "count": 25.0, "amount": 98.73 },
        { "display_str": "短袖", "count": 43.0, "amount": 61.05 },
        { "display_str": "棉服", "count": 46.0, "amount": 82.1 }
      ],
      rows2: [
        { "display_str": "上衣2", "count": 29.0, "amount": 53.07 },
        { "display_str": "裤子2", "count": 30.0, "amount": 66.69 },
        { "display_str": "裙子2", "count": 37.0, "amount": 54.0 },
        { "display_str": "帽子2", "count": 35.0, "amount": 74.53 },
        { "display_str": "鞋子2", "count": 25.0, "amount": 98.73 },
        { "display_str": "短袖2", "count": 43.0, "amount": 61.05 },
        { "display_str": "棉服2", "count": 46.0, "amount": 82.1 }
      ],
      // 设置系列中的默认配置项
      // 如果itemOpt和columns中设置了相同的配置，则columns优先级更高
      itemOpt: {
        // 此处配置级别与columns中的（其他配置2）位置一致
        areaStyle: {},
        // 改系列使用下标为1的雷达指示器
        radarIndex: 1,
        data: {
        	// series[item].data的配置项 与columns中的（其他配置1）位置一致
          symbol: 'rect',
        }
      },
      columns: {
        count: {
          name: '数量',
          data: {
            name: 'data数量',
            // 其他配置1
          },
          // 指示器文字
          indicatorText: 'display_str',
          // 其他配置2
        },
        amount: {
          name: '单价',
          data: 'data单价',
          indicatorText: 'display_str'
        }
      },
      // 设置雷达的属性
      radar: [{
        // 第一个雷达指示器为圆形
        shape: 'circle',
        // 中心点
        center: ['25%', '50%'],
      }, {
        // 第二个雷达的中心点
        center: ['75%', '50%']
      }]
    };
  },
}
```

上方代码生成的配置如下

```json
{
    "series": [
        {
            "name": "数量",
            "data": [
                {
                    "value": [
                        29,
                        30,
                        37,
                        35,
                        25,
                        43,
                        46
                    ],
                    "name": "data数量"
                }
            ],
            "indicatorText": "display_str",
            "type": "radar"
        },
        {
            "name": "单价",
            "data": [
                {
                    "value": [
                        53.07,
                        66.69,
                        54,
                        74.53,
                        98.73,
                        61.05,
                        82.1
                    ],
                    "name": "data单价"
                }
            ],
            "indicatorText": "display_str",
            "type": "radar"
        },
        {
            "areaStyle": {},
            "radarIndex": 1,
            "data": [
                {
                    "symbol": "rect",
                    "value": [
                        29,
                        30,
                        37,
                        35,
                        25,
                        43,
                        46
                    ],
                    "name": "data数量"
                }
            ],
            "name": "数量",
            "indicatorText": "display_str",
            "type": "radar"
        },
        {
            "areaStyle": {},
            "radarIndex": 1,
            "data": [
                {
                    "symbol": "rect",
                    "value": [
                        53.07,
                        66.69,
                        54,
                        74.53,
                        98.73,
                        61.05,
                        82.1
                    ],
                    "name": "data单价"
                }
            ],
            "name": "单价",
            "indicatorText": "display_str",
            "type": "radar"
        }
    ],
    "radar": [
        {
            "indicator": [
                {
                    "name": "上衣"
                },
                {
                    "name": "裤子"
                },
                {
                    "name": "裙子"
                },
                {
                    "name": "帽子"
                },
                {
                    "name": "鞋子"
                },
                {
                    "name": "短袖"
                },
                {
                    "name": "棉服"
                }
            ],
            "shape": "circle",
            "center": [
                "25%",
                "50%"
            ]
        },
        {
            "indicator": [
                {
                    "name": "上衣2"
                },
                {
                    "name": "裤子2"
                },
                {
                    "name": "裙子2"
                },
                {
                    "name": "帽子2"
                },
                {
                    "name": "鞋子2"
                },
                {
                    "name": "短袖2"
                },
                {
                    "name": "棉服2"
                }
            ],
            "center": [
                "75%",
                "50%"
            ]
        }
    ],
    "tooltip": {
        "show": true
    },
    "legend": {
        "data": [
            "data数量",
            "data单价"
        ]
    }
}
```



# 其他图表

更多图表暂不支持，如果想绘制其他图表，你可以先把数据处理好然后绑定到dt-charts组件上

```html
<dt-charts v-bind="option"
           ref="chart">
</dt-charts>
```

```js
export default {
  data () {
    //这里存放数据
    return {
      option: {},
    };
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    // 使用setTimeout模拟请求接口的延时
    setTimeout(() => {
      // 直接把官网雷达图示例的配置放上去
      this.option = {
        title: {
          text: 'Basic Radar Chart'
        },
        legend: {
          data: ['Allocated Budget', 'Actual Spending']
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: 'Sales', max: 6500 },
            { name: 'Administration', max: 16000 },
            { name: 'Information Technology', max: 30000 },
            { name: 'Customer Support', max: 38000 },
            { name: 'Development', max: 52000 },
            { name: 'Marketing', max: 25000 }
          ]
        },
        series: [{
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [4200, 3000, 20000, 35000, 50000, 18000],
              name: 'Allocated Budget'
            },
            {
              value: [5000, 14000, 28000, 26000, 42000, 21000],
              name: 'Actual Spending'
            }
          ]
        }]
      }
    }, 2000)
  }
}
```

![](https://s3.bmp.ovh/imgs/2022/03/1f1ee3d2688572df.png)



# Todo:

- 子组件使用v-if显示隐藏，使对应的数据能够正常显示隐藏
- 更多图表持续更新中

