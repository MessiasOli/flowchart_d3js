import { DecorationModel } from "../_model/DecorationModel";
import { SingletonFlowchart } from "../_service/singletonFlowchart";
import { COLORS } from "../../utils/colors"
import * as d3 from "d3"

export class DecorationPercentageEntry extends DecorationModel {
  constructor() {
    super("DecorationPercentageEntry")
    this.node = null;
  
    this.init = async function (newNode, openDialog) {
      let svg = SingletonFlowchart.svg
      this.node = newNode
  
       await svg
          .data([newNode])
          .append("g")
          .classed("PercentageEntry", true)
          .attr("id", `PercentageEntry-${newNode.id}`)

          let g = d3.select(`#PercentageEntry-${newNode.id}`)

          g.append("rect")
          .classed("PercentageEntry", true)
          .attr("x", (d) => d.x)
          .attr("y", (d) => d.y)
          .attr("cursor", "grab")
          .attr("stroke", COLORS.Blue)
          .style("fill", '#0000')
          .style("width", newNode.width)
          .style("height", newNode.height)
          .call(this.setDrag())
          .node();

          g.append('text')
          .attr("y", (d) => d.y + newNode.heightText)
          .attr("x", (d) => d.xText())
          .attr("cursor", "pointer")
          .attr("text-anchor", "middle")
          .style('stoke', COLORS.Black90)
          .text(newNode.value)
          .on('dblclick', () => openDialog(newNode))
          .node();

      return svg
    }
  
    this.setDrag = function() {
      let that = this

      let drag = d3
        .drag()
        .on("start", that.dragstarted)
        .on("drag", (event, d) => that.dragged(event, d, that))
        .on("end", that.dragended);

      return drag;
    }

    this.dragstarted = function(event, d) {
      SingletonFlowchart.clicked = true
      SingletonFlowchart.selectNode(d.idName);
      console.log('d :>> ', d);
  
      d3.select(this)
        .attr("stroke", "black")
        .attr("cursor", "grabbing")

    }

    this.dragged = async function (event, d, that) {
      SingletonFlowchart.clicked = false;
      d.x = event.x;
      d.y = event.y -5;
      that.move()
    }

    this.move = async () => {
      let d = this.node;
      await d3.select(`#${d.idName} > rect`).raise().attr("x", d.x).attr("y", d.y);
      await d3.select(`#${d.idName} > text`).raise().attr("x", (d.xText())).attr("y", (d.y + d.heightText));
    }

    this.dragended = function() {
      this.cursor = "grab"
      d3.select(this)
        .attr("stroke", COLORS.Blue)
        .attr("cursor", "grab") 
        
      SingletonFlowchart.SaveStatus();
    }

    this.setTextAndAdjustWidth = () => {
      d3.select(`#PercentageEntry-${this.node.id} > text`)
        .attr("x", this.node.xText())
        .text(this.node.value)
        .node()

      d3.select(`#PercentageEntry-${this.node.id} > rect`)
        .style("width", this.node.width)
    }
  }
}