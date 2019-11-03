import React from "react";
import vis from "vis-network";
interface NetworkProps {
    nodes: vis.DataSet<vis.Node>;
    edges: vis.DataSet<vis.Edge>;
}
interface NetworkState {
}
export default class Network extends React.PureComponent<NetworkProps, NetworkState> {
    network?: vis.Network;
    containerRef: React.RefObject<HTMLDivElement>;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export {};
