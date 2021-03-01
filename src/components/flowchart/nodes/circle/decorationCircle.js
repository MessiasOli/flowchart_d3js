import { DecorationModel } from "../_model/DecorationModel"
import { SingletonFlowchart } from "../_service/singletonFlowchart"
import * as d3 from "d3"

class DecorationCircle extends DecorationModel {
  constructor() {
    super("DecorationCircle")
    console.log("DecorationCircle Criado!");

    this.init = async function(node) {
      let svg = SingletonFlowchart.svg
  
       await svg
         .data([{ x: 500, y: 300, index: Math.trunc((Math.random()*100))}, { x: 400, y: 200, index: Math.random(0,10) }])
         .append("circle")
          .attr("id" ,"circle-"+node.id)
          .attr("cx",  d => d.x)
          .attr("cy", d => d.y)
          .attr("r", node.radius)
          .attr("cursor", "grab")
          .classed("circle", true)
          .style("fill", d3.schemeCategory10[100 % 10])
          .call(this.setDrag(node))
      
      return svg
    }

    this.setDrag = function() {
      let that = this
      let drag = d3
        .drag()
        .on("start", that.dragstarted)
        .on("drag", that.dragged)
        .on("end", that.dragended);
      return drag;
    }
  
    this.dragstarted = function() {
      SingletonFlowchart.clicked = true
      SingletonFlowchart.selected = this.id
  
      d3.select(this)
        .style("stroke", "black")
        .attr("cursor", "grabbing")
    }
  
    this.dragged = function(event, d) {
      SingletonFlowchart.clicked = false
      d3.select(this).raise().attr("cx", d.x = event.x).attr("cy", d.y = event.y);
    }
  
    this.dragended = function() {
      this.cursor = "grab"
      d3.select(this)
        .style("stroke", "none")
        .attr("cursor", "grab")
    }
  }
}

export { DecorationCircle }