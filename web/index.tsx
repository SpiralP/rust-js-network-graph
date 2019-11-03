import React from "react";
import Websocket from "react-websocket";
import vis from "vis-network";
import Network from "./Network";

interface NetworkGraphState {
  connected: boolean;
}

export class NetworkGraph extends React.Component<{}, NetworkGraphState> {
  state: NetworkGraphState = {
    connected: false,
  };

  nodes: vis.DataSet<vis.Node> = new vis.DataSet();
  edges: vis.DataSet<vis.Edge> = new vis.DataSet();

  updateNode(id: string, node: vis.Node) {
    // console.log(`Network updateNode ${id}`);
    node.id = id;
    this.nodes.update(node);
  }

  updateEdge(id: string, edge: vis.Edge) {
    // console.log(`Network updateEdge ${id}`);

    edge.id = id;
    this.edges.update(edge);
  }

  handleMessage(msg: string) {
    //
    console.log(msg);
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
