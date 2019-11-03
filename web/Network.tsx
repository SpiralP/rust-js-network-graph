import React from "react";
import vis from "vis-network";

interface NetworkProps {
  nodes: vis.DataSet<vis.Node>;
  edges: vis.DataSet<vis.Edge>;
}

interface NetworkState {}

export default class Network extends React.PureComponent<
  NetworkProps,
  NetworkState
> {
  network?: vis.Network;

  containerRef: React.RefObject<HTMLDivElement> = React.createRef();

  componentDidMount() {
    const { containerRef } = this;
    const { nodes, edges } = this.props;

    if (!containerRef.current) {
      throw new Error("ref not set?");
    }

    this.network = new vis.Network(
      containerRef.current,
      { nodes, edges },
      {
        interaction: {
          hover: true,
        },
        nodes: {
          // shape: "icon",
          // icon: {
          //   face: '"Font Awesome 5 Free", "Font Awesome 5 Brands"',
          //   code: iconNameToCode.circle,
          // },
          // shadow: true,
          // shapeProperties: {
          //   interpolation: false, // 'true' for intensive zooming
          // },
        },
        edges: {
          width: 4,
          // color: {color: "#1E7AE5", }
          // shadow: true,
        },
        layout: { improvedLayout: false },
      }
    );

    this.network.moveTo({ scale: 0.75 });
  } // componentDidMount

  componentWillUnmount() {
    if (this.network) {
      this.network.destroy();
    }
  }

  // shouldComponentUpdate() {
  //   return false;
  // }

  render() {
    // console.log("Network render");
    return (
      <div
        style={{ height: "100vh", width: "100vw" }}
        ref={this.containerRef}
      />
    );
  }
}
