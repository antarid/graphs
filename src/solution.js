function DistanceAndStatus(distance) {
  this.distance = distance;
  this.isInTree = false;
  this.prevVertex = '';
}

class MinDistanceGraph {
  addToTree(vertexName) {
    this.minDistances[vertexName].isInTree = true;
    this.nVertexesInTree++;
  }

  getDistance(vertexName) {
    return this.minDistances[vertexName].distance;
  }

  changeDistance(vertexName, distance) {
    this.minDistances[vertexName].distance = distance;
  }

  setPrevVertex(vertexName, prevVertexName) {
    this.minDistances[vertexName].prevVertex = prevVertexName;
  }

  findClosestVertex() {
    let min = Infinity;
    let closestVertex = '';
    _.forEach(this.minDistances, (vertex, vertexName) => {
      if (!vertex.isInTree && vertex.distance <= min) {
        closestVertex = vertexName;
        min = vertex.distance;
      }
    });

    return closestVertex;
  }

  constructor(graph, start, finish) {
    this.graph = graph;
    this.start = start;
    this.finish = finish;
    this.minDistances = {};
    this.nVertexes = Object.keys(graph).length;
    this.nVertexesInTree = 0;
    this.init();
    this.calculate();
    this.paveWay();
  }

  init() {
    _.forEach(this.graph, (vertex, vertexName) => {
      this.minDistances[vertexName] = new DistanceAndStatus(Infinity);
    });

    this.changeDistance(this.start, 0);
  }

  calculate() {
    while (
      !this.minDistances[finish].isInTree &&
      this.nVertexesInTree < this.nVertexes
    ) {
      const closestVertex = this.findClosestVertex();
      const minDistance = this.getDistance(closestVertex);
      if (minDistance === Infinity) break;
      this.addToTree(closestVertex);
      _.forEach(this.graph[closestVertex], (distance, vertex) => {
        if (this.getDistance(vertex) > distance + minDistance)
          this.setPrevVertex(vertex, closestVertex);
        this.changeDistance(
          vertex,
          Math.min(this.getDistance(vertex), distance + minDistance)
        );
      });
    }
  }

  paveWay() {
    _.forEach(this.minDistances, (vertex, vertexName) => {
      const path = [vertexName];
      let prevVertex = vertex.prevVertex;
      while (prevVertex !== '') {
        path.push(prevVertex);
        prevVertex = this.minDistances[prevVertex].prevVertex;
      }
      vertex.path = path.reverse();
    });
  }
}

const solution = function(graph, start, finish) {
  const minDistances = new MinDistanceGraph(graph, start, finish);
  const finishObj = minDistances.minDistances[finish];
  return {distance: finishObj.distance, path: finishObj.path};
};
