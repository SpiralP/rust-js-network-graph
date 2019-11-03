"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_websocket_1 = __importDefault(require("react-websocket"));
const vis_network_1 = __importDefault(require("vis-network"));
const Network_1 = __importDefault(require("./Network"));
class NetworkGraph extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            connected: false,
        };
        this.nodes = new vis_network_1.default.DataSet();
        this.edges = new vis_network_1.default.DataSet();
    }
    updateNode(id, node) {
        // console.log(`Network updateNode ${id}`);
        node.id = id;
        this.nodes.update(node);
    }
    updateEdge(id, edge) {
        // console.log(`Network updateEdge ${id}`);
        edge.id = id;
        this.edges.update(edge);
    }
    handleMessage(msg) {
        //
        console.log(msg);
    }
    render() {
        const { nodes, edges } = this;
        return (react_1.default.createElement("div", null,
            react_1.default.createElement(Network_1.default, { nodes: nodes, edges: edges }),
            react_1.default.createElement(react_websocket_1.default, { url: `ws://${location.host}/ws`, onMessage: (msg) => this.handleMessage(msg), onOpen: () => {
                    // status("websocket opened");
                    this.setState({ connected: true });
                }, onClose: () => {
                    // status("websocket closed");
                    // toaster.show({
                    //   message: "websocket closed",
                    //   intent: "danger",
                    //   timeout: 10000,
                    // });
                    this.setState({ connected: false });
                }, debug: true, reconnect: false })));
    }
}
exports.NetworkGraph = NetworkGraph;
