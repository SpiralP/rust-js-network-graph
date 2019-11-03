interface Node {}

interface NewNodeEvent {
  node: Node;
}

type RustEvent = NewNodeEvent;
