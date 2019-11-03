"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_websocket_1 = __importDefault(require("react-websocket"));
class NetworkGraph extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            connected: false,
        };
    }
    handleMessage(msg) { }
    render() {
        return (react_1.default.createElement(react_websocket_1.default, { url: `ws://${location.host}/ws`, onMessage: (msg) => this.handleMessage(msg), onOpen: () => {
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
            }, debug: true, reconnect: false }));
    }
}
exports.NetworkGraph = NetworkGraph;
