import React from "react";
interface NetworkGraphState {
    connected: boolean;
}
export declare class NetworkGraph extends React.Component<{}, NetworkGraphState> {
    state: NetworkGraphState;
    handleMessage(msg: string): void;
    render(): JSX.Element;
}
export {};
