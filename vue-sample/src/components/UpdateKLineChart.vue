<template>
  <Layout v-bind:title="title">
    <div id="update-k-line" class="k-line-chart"/>
  </Layout>
</template>

<script>
import {dispose, init} from 'klinecharts'
// eslint-disable-next-line
import generatedKLineDataList from '../generatedKLineDataList'
import Layout from "@/Layout"

export default {
  name: 'UpdateKLineChart',
  components: {Layout},
  mounted: function () {

    const kLineChart = init('update-k-line')

    // kLineChart.createTechnicalIndicator("MACD", false, {id: 'candle_pane'})
    window["onReceiveData"] = function onReceiveData(dataStr) {
      // console.log("onReceiveData:" + dataStr);
      let data = JSON.parse(dataStr);
      if (data.markText) {
        createMark(data);
      }
      kLineChart.updateData(data);
    }

    window["onReceiveDataInit"] = function onReceiveDataInit(dataStr) {
      // console.log("onReceiveDataInit:" + dataStr);
      let data = JSON.parse(dataStr);

      kLineChart.clearData();
      kLineChart.applyNewData(data);

    };
    let thisData = this;
    window['setTitle'] = function (title) {
      thisData.title = title;
    };

    const annotationDrawExtend = function (ctx, coordinate, text) {
      ctx.font = '12px Roboto'
      ctx.fillStyle = '#2d6187'
      ctx.strokeStyle = '#2d6187'

      const textWidth = ctx.measureText(text).width
      const startX = coordinate.x
      let startY = coordinate.y + 6
      ctx.beginPath()
      ctx.moveTo(startX, startY)
      startY += 5
      ctx.lineTo(startX - 4, startY)
      ctx.lineTo(startX + 4, startY)
      ctx.closePath()
      ctx.fill()

      const rectX = startX - textWidth / 2 - 6
      const rectY = startY
      const rectWidth = textWidth + 12
      const rectHeight = 28
      const r = 2
      ctx.beginPath()
      ctx.moveTo(rectX + r, rectY)
      ctx.arcTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + rectHeight, r)
      ctx.arcTo(rectX + rectWidth, rectY + rectHeight, rectX, rectY + rectHeight, r)
      ctx.arcTo(rectX, rectY + rectHeight, rectX, rectY, r)
      ctx.arcTo(rectX, rectY, rectX + rectWidth, rectY, r)
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = '#fff'
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      ctx.fillText(text, startX, startY + 14)
    }

    function createMark(candleItem) {
      let {timestamp, down, markText} = candleItem;

      let type = down ? "circle" : "rect";
      kLineChart.createAnnotation([
        {
          point: {timestamp: timestamp,price:candleItem.open},
          drawExtend: (params) => {
            const {ctx, coordinate} = params

            annotationDrawExtend(ctx, coordinate, markText)
          },
          styles: {
            symbol: {
              type: type,
              position: "point"
            }
          }
        }, {
          point: {timestamp: timestamp,price:candleItem.open},
          styles: {
            symbol: {
              type: type,
              position: "point"
            }
          }
        }
      ])
    }


  },
  methods: {},
  data: function () {
    return {
      title: "####",
      mainTechnicalIndicatorTypes: ['MA', 'EMA', 'SAR'],
      subTechnicalIndicatorTypes: ['VOL', 'MACD', 'KDJ']
    }
  },
  destroyed: function () {
    dispose('update-k-line')
  }
}
</script>
