/*
 * @Description: 
 * @Author: yanxiao
 * @Github: https://github.com/yanxiaos
 * @Date: 2021-12-30 11:41:30
 * @LastEditors: yanxiao
 */
export default {
  xAxis: [{
    axisTick: { show: false },
    axisLine: {
      show: true,
      lineStyle: {
        type: 'solid',
        color: '#3370C8',//左边线的颜色
        width: '1'//坐标线的宽度
      },
    },
    axisLabel: {
      fontSize: "12px",
      color: "#3370C8",
      letterSpacing: "0.27px",
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#0A3167'],
        width: "1",
        type: "solid"
      }
    }
  }],
  yAxis: [{
    axisTick: { show: false },
    axisLine: {
      lineStyle: {
        type: 'solid',
        color: '#0A3167',//左边线的颜色
        width: '1'//坐标线的宽度
      }
    },
    axisLabel: {
      fontSize: "12px",
      color: "#3370C8",
      letterSpacing: "0.27px",
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#0A3167'],
        width: "1",
        type: "solid"
      }
    }
  }],
  color: ['#FFDC21'],
  grid: {
    height: 150,
    left: '4%',
    right: '4%',
    top: "10px",
    containLabel: true
  },
  series: [
    {
      type: 'pictorialBar',
      barWidth: '60%',
      label: {
        normal: {
          show: false,
        },
      },
      itemStyle: {
        normal: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#E9C503', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(233,197,3,0.00)', // 100% 处的颜色
              },
            ],
            globalCoord: false, // 缺省为 false
          }, //渐变颜色
        },
      },
      symbol:
        'path://M12.000,-0.000 C12.000,-0.000 16.074,60.121 22.731,60.121 C26.173,60.121 -3.234,60.121 0.511,60.121 C7.072,60.121 12.000,-0.000 12.000,-0.000 Z',
    }
  ],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'none'
    },
    formatter: function (params) {
      return params[0].name + ': ' + params[0].value;
    }
  },
}