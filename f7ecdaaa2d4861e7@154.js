// https://observablehq.com/@jiz587/assignment-3-tree-explorer@154
function _1(md){return(
md`# Assignment 3 Tree Explorer`
)}

function _trees(d3){return(
d3.csv(
  "https://gis-cityofchampaign.opendata.arcgis.com/datasets/979bbeefffea408e8f1cb7a397196c64_22.csv?outSR=%7B%22latestWkid%22%3A3857%2C%22wkid%22%3A102100%7D",
  d3.autoType
)
)}

function _3(htl){return(
htl.html`<style>
  #treecircles circle {
    fill: black;
  }
  #treecircles circle.selected {
    fill: red;
  }
</style>`
)}

function _selectTrees(d3,trees){return(
function (svg, selectedTrees) {
  svg.selectAll("rect").remove();
  const svgWidth = 600;
  const svgHeight = 200;
  const xScale = d3
    .scaleBand()
    .domain(d3.range(d3.max(trees, (d) => d.TRUNKS)))
    .range([0, svgWidth])
    .paddingInner(0.1);
  const yScale = d3
    .scaleLog()
    .domain([1, selectedTrees.length])
    .range([0, svgHeight]);
  const binnedTrunks = d3.bin().value((d) => d.TRUNKS)(selectedTrees);
  svg
    .selectAll("rect")
    .data(binnedTrunks)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.x0))
    .attr("y", yScale(0))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => yScale(d.length))
    .style("fill", "black");
}
)}

function _5(html){return(
html` <strong>Brush Selection</strong>

<p>You may use your mouse to brush select a rectangular region, and be able to view the information regarding that region in the histogram below. This is the code from class demo with slight modification.
`
)}

function* _6(d3,trees,selectTrees)
{
  const div = d3.create("div");
  const svgHeight = 400;
  const svgWidth = 600;
  const svg = div
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
  const histSvg = div.append("svg").attr("width", svgWidth).attr("height", 200);
  const text = div.append("p");
  yield div.node();
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(trees, (d) => d.X))
    .range([0, svgWidth]);
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(trees, (d) => d.Y))
    .range([svgHeight, 0]);
  const treeDataPoints = svg
    .append("g")
    .attr("id", "treecircles")
    .selectAll("circle")
    .data(trees)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.X))
    .attr("cy", (d) => yScale(d.Y))
    .attr("r",1);
  const brush = d3.brush();
  svg
    .append("g")
    .attr("class", "brush")
    .call(
      brush.on("brush", (event) => {
        let count = 0;
        const selection = [
          [
            xScale.invert(event.selection[0][0]),
            yScale.invert(event.selection[0][1])
          ],
          [
            xScale.invert(event.selection[1][0]),
            yScale.invert(event.selection[1][1])
          ]
        ];
        let selectedTrees = [];
        treeDataPoints.classed("selected", (d) => {
          let isSelect =
            selection[0][0] <= d.X &&
            selection[1][0] >= d.X &&
            selection[0][1] >= d.Y &&
            selection[1][1] <= d.Y;
          if (isSelect) {
            count += 1;
            selectedTrees.push(d);
          }
          return isSelect;
        });
        selectTrees(histSvg, selectedTrees);
        text.text(`Selected: ${count}`);
      })
    );
}


function _7(html){return(
html` <strong>Individual Mouseover Selection with Information</strong>

<p>You may use your mouse to hover over any point on the graph, and tree would be highlighed in magenta. In addition the cell below would show the address of the selected tree.
`
)}

function _8(html){return(
html `
<p>
<div id="text"></div>`
)}

function* _9(d3,trees)
{
  function makeTrees() {
    
  const width = 1000;
  const height = 800;
  const text = d3.select("#text");
  const svg = d3
  .create("svg")
  .attr("width", width)
  .attr("height", height);

  const xScale = d3.scaleLinear().domain(d3.extent(trees, d => d.X)).range([0.0, width]);
  const yScale = d3.scaleLinear().domain(d3.extent(trees, d => d.Y)).range([height, 0.0]);
  
  svg.append("g")
  .attr("id", "trees")
  .selectAll("circle")
  .data(trees)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d.X))
  .attr("cy", d => yScale(d.Y))
  .attr("r", 1)

  .on('mouseover', function(e, d) {
      text.text(`${d.ADDRESS} ${d.STREET}`);
      console.log("mouseover on", this);
      
      d3.select(this)
        .transition()
        .duration(1)
        .attr('r', 7)
        .attr('fill', 'magenta');
    })
    .on('mouseout', function(d, i) {
      console.log("mouseout", this);
      d3.select(this)
        .transition()
        .duration(1)
        .attr('r', 0.5)
        .attr('fill', 'grey');
    });
    
  return {svg: svg, xScale: xScale, yScale: yScale};
  }
  const {svg, xScale, yScale} = makeTrees();
  yield svg.node();
  //const tree = svg.select("g#trees");
  const text = d3.select("#text");
  
}


function _10(html){return(
html` <strong>Individual Mouseover Pan-and-Zoom Selection with Information</strong>

<p>You may Pan-and-Zoom the graph and use your mouse to hover over any point on the graph, and tree would be highlighed in magenta. In addition the cell below would show the address of the selected tree. After when the mouse is no longer hovering over the tree, the point would turn grey which represents that we have already examined that point.
`
)}

function _11(html){return(
html `
<p>
<div id="text2"></div>`
)}

function* _12(d3,trees)
{
  function makeTrees() {
    
  const width = 600;
  const height = 450;
  const text = d3.select("#text2");
  const svg = d3
  .create("svg")
  .attr("width", width)
  .attr("height", height);

  const xScale = d3.scaleLinear().domain(d3.extent(trees, d => d.X)).range([0.0, width]);
  const yScale = d3.scaleLinear().domain(d3.extent(trees, d => d.Y)).range([height, 0.0]);
  
  svg.append("g")
  .attr("id", "trees")
  .selectAll("circle")
  .data(trees)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d.X))
  .attr("cy", d => yScale(d.Y))
  .attr("r", 0.5)

  .on('mouseover', function(e, d) {
      text.text(`${d.ADDRESS} ${d.STREET}`);
      console.log("mouseover on", this);
      
      d3.select(this)
        .transition()
        .duration(1)
        .attr('r', 3)
        .attr('fill', 'magenta');
    })
    .on('mouseout', function(d, i) {
      console.log("mouseout", this);
      d3.select(this)
        .transition()
        .duration(1)
        .attr('r', 0.5)
        .attr('fill', 'grey');
    });
    
   
    
  return {svg: svg, xScale: xScale, yScale: yScale};
  }
  const {svg, xScale, yScale} = makeTrees();
  yield svg.node();
  const zoom = d3.zoom();
  const tree = svg.select("g#trees");
  const text = d3.select("#text2");
  function zoomCalled(event) {
    
    const zx = event.transform.rescaleX(xScale);
    const zy = event.transform.rescaleY(yScale);
    tree.transition().duration(0).attr("transform", event.transform);
  }
  svg.call(zoom.on("zoom", zoomCalled))
}


function _13(trees){return(
trees[0]
)}

function _d3(require){return(
require("d3@6")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("trees")).define("trees", ["d3"], _trees);
  main.variable(observer()).define(["htl"], _3);
  main.variable(observer("selectTrees")).define("selectTrees", ["d3","trees"], _selectTrees);
  main.variable(observer()).define(["html"], _5);
  main.variable(observer()).define(["d3","trees","selectTrees"], _6);
  main.variable(observer()).define(["html"], _7);
  main.variable(observer()).define(["html"], _8);
  main.variable(observer()).define(["d3","trees"], _9);
  main.variable(observer()).define(["html"], _10);
  main.variable(observer()).define(["html"], _11);
  main.variable(observer()).define(["d3","trees"], _12);
  main.variable(observer()).define(["trees"], _13);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
