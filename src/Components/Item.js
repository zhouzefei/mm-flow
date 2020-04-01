import { PureComponent } from "react";
import { Tooltip } from "antd";
export default class Item extends PureComponent {
    componentDidMount(){
        
    }
    render() {
        const { type, size, shape, model, help, name } = this.props || {};
    	return (
    		<Tooltip title={help||""}>
                <div
                    className={`${type || ""} flow-item`}
                >
                    {name}
                </div>
            </Tooltip>
    	);
    }
}
