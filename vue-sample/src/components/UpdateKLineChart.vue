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
    let that = this;
    window['setTitle'] = function (title) {
      that.title = title;
    };
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

      for (const datum of data) {
        if (datum.markText) {
          createMark(datum);
        }
      }
      kLineChart.clearData();
      kLineChart.applyNewData(data);

    };

    const annotationDrawExtend = function (ctx, coordinate, text, down) {
      ctx.font = '12px Roboto'
      ctx.fillStyle = '#2d6187'
      ctx.strokeStyle = '#2d6187'
      const rectHeight = 28
      let offsetStartY;
      let offsetStartY1;
      let rectOffsetY;
      let rectTextOffsetY;
      if (down) {
        offsetStartY = 6 ;
        offsetStartY1 = 5;
        rectOffsetY = 0;
        rectTextOffsetY = rectHeight / 2;
      }
      else
      {
        offsetStartY = -6 ;
        offsetStartY1 = -5;
        rectOffsetY = -rectHeight;
        rectTextOffsetY = rectHeight / 2;
      }
      const textWidth = ctx.measureText(text).width
      const startX = coordinate.x
      let startY = coordinate.y + offsetStartY
      ctx.beginPath()
      ctx.moveTo(startX, startY)
      startY += offsetStartY1
      ctx.lineTo(startX - 4, startY)
      ctx.lineTo(startX + 4, startY)
      ctx.closePath()
      ctx.stroke()

      const rectX = startX - textWidth / 2 - 6
      const rectY = startY + rectOffsetY;
      const rectWidth = textWidth + 12

      const r = 2
      ctx.beginPath()
      ctx.moveTo(rectX + r, rectY)
      ctx.arcTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + rectHeight, r)
      ctx.arcTo(rectX + rectWidth, rectY + rectHeight, rectX, rectY + rectHeight, r)
      ctx.arcTo(rectX, rectY + rectHeight, rectX, rectY, r)
      ctx.arcTo(rectX, rectY, rectX + rectWidth, rectY, r)
      ctx.closePath()
      ctx.stroke()
      if (down) {
        ctx.fillStyle = '#ece226'
      }
      else
      {
        ctx.fillStyle = '#9749c2'
      }

      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      ctx.fillText(text, startX, rectY + rectTextOffsetY)
    }

    function createMark(candleItem) {
      let {timestamp, down, markText} = candleItem;

      let type = down ? "circle" : "rect";
      let price = parseFloat(markText.substr(1));
      console.log(`price:${price}`)
      kLineChart.createAnnotation([
        {
          point: {timestamp: timestamp,price:price},
          drawExtend: (params) => {
            const {ctx, coordinate} = params

            annotationDrawExtend(ctx, coordinate, markText,down)
          },
          styles: {
            symbol: {
              type: type,
              position: "point"
            }
          }
        }, {
          point: {timestamp: timestamp,price:price},
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
