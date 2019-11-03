import vis from "vis-network";

interface AddNodeEvent {
  type: "AddNode";
  data: vis.Node;
}

interface AddEdgeEvent {
  type: "AddEdge";
  data: vis.Edge;
}

interface UpdateNodeEvent {
  type: "UpdateNode";
  data: vis.Node;
}

interface UpdateEdgeEvent {
  type: "UpdateEdge";
  data: vis.Edge;
}

interface RemoveNodeEvent {
  type: "RemoveNode";
  data: string;
}

interface RemoveEdgeEvent {
  type: "RemoveEdge";
  data: string;
}

type RustEvent =
  | AddNodeEvent
  | AddEdgeEvent
  | UpdateNodeEvent
  | UpdateEdgeEvent
  | RemoveNodeEvent
  | RemoveEdgeEvent;
