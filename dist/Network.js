"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const vis_network_1 = __importDefault(require("vis-network"));
class Network extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this.containerRef = react_1.default.createRef();
    }
    componentDidMount() {
        const { containerRef } = this;
        const { nodes, edges } = this.props;
        if (!containerRef.current) {
            throw new Error("ref not set?");
        }
        this.network = new vis_network_1.default.Network(containerRef.current, { nodes, edges }, {
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
            },
            layout: { improvedLayout: false },
        });
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
        return (react_1.default.createElement("div", { style: { height: "100vh", width: "100vw" }, ref: this.containerRef }));
    }
}
exports.default = Network;
