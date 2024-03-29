import "vis-network/dist/vis-network.css";
import React from "react";
import vis from "vis-network";
interface NetworkGraphState {
    connected: boolean;
}
export declare class NetworkGraph extends React.Component<{}, NetworkGraphState> {
    state: NetworkGraphState;
    nodes: vis.DataSet<vis.Node>;
    edges: vis.DataSet<vis.Edge>;
    updateNode(node: vis.Node): void;
    updateEdge(edge: vis.Edge): void;
    handleMessage(msg: string): void;
    render(): JSX.Element;
}
export {};
