import React from "react";
import Websocket from "react-websocket";
import vis from "vis-network";
import Network from "./Network";
import { RustEvent } from "./types";

interface NetworkGraphState {
  connected: boolean;
}

export class NetworkGraph extends React.Component<{}, NetworkGraphState> {
  state: NetworkGraphState = {
    connected: false,
  };

  nodes: vis.DataSet<vis.Node> = new vis.DataSet();
  edges: vis.DataSet<vis.Edge> = new vis.DataSet();

  updateNode(node: vis.Node) {
    // console.log(`Network updateNode ${id}`);
    this.nodes.update(node);
  }

  updateEdge(edge: vis.Edge) {
    // console.log(`Network updateEdge ${id}`);
    this.edges.update(edge);
  }

  handleMessage(msg: string) {
    const event: RustEvent = JSON.parse(msg);

    if (event.type === "AddNode") {
      this.nodes.add(event.data);
    } else if (event.type === "AddEdge") {
      this.edges.add(event.data);
    } else if (event.type === "UpdateNode") {
      this.nodes.update(event.data);
    } else if (event.type === "UpdateEdge") {
      this.edges.update(event.data);
    } else if (event.type === "RemoveNode") {
      this.nodes.remove(event.data);
    } else if (event.type === "RemoveEdge") {
      this.edges.remove(event.data);
    }
  }

  render() {
    const { nodes, edges } = this;

    return (
      <div>
        <Network nodes={nodes} edges={edges} />

        <Websocket
          url={`ws://${location.host}/ws`}
          onMessage={(msg: string) => this.handleMessage(msg)}
          onOpen={() => {
            // status("websocket opened");
            this.setState({ connected: true });
          }}
          onClose={() => {
            // status("websocket closed");
            // toaster.show({
            //   message: "websocket closed",
            //   intent: "danger",
            //   timeout: 10000,
            // });

            this.setState({ connected: false });
          }}
          debug={true}
          reconnect={false}
        />
      </div>
    );
  }
}
