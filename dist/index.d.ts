import React from "react";
import vis from "vis-network";
interface NetworkGraphState {
    connected: boolean;
}
export declare class NetworkGraph extends React.Component<{}, NetworkGraphState> {
    state: NetworkGraphState;
    nodes: vis.DataSet<vis.Node>;
    edges: vis.DataSet<vis.Edge>;
    updateNode(id: string, node: vis.Node): void;
    updateEdge(id: string, edge: vis.Edge): void;
    handleMessage(msg: string): void;
    render(): JSX.Element;
}
export {};
