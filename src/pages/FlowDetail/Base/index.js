import { PureComponent } from "react";
import { isEqual } from "lodash";
import { Card, Input, Row, Col, Radio } from "antd";
import "./index.less";

const nodeTypeNameMap = {
	"flow-start": "开始节点",
	"flow-end": "结束节点",
	"flow-exclusivity": "排他节点",
	"flow-parallel": "并行节点"
};

const initData = () => ({
	changeLabelText: "",
	nodeType: "",
	auditConfig: {}
});
class BaseNode extends PureComponent {
    state = {
    	...initData()
    };

    componentWillMount() {
    	this.initBaseNode(this.props);
    }

    componentWillReceiveProps(nextProps) {
    	if (!isEqual(nextProps.data, this.props.data)) {
    		console.log("just once");
    		this.initBaseNode(nextProps);
    	}
    }

    initBaseNode = (props) => {
    	const { data } = props;
    	let { config, name, nodeType } = data || {};
    	if (data.type === "flow-parallel" && !nodeType) {
    		nodeType = "parallelStart";
    	}
    	this.setState({
    		auditConfig: {...config},
    		changeLabelText: name,
    		nodeType
    	});
    }

    // 更改基础节点信息
    changeNodeBase = (field, type, e, syncName) => {
    	let value = e;
    	if (type === "input") {
    		value = e.target.value;
    	}
    	const { data, onChange } = this.props;
    	// 修改
    	if (syncName) {
    		data.name = syncName;
    		this.setState({
    			changeLabelText: syncName
    		});
    	}
    	data[field] = value;
    	onChange(data);
    	if (field === "name") {
    		this.setState({
    			changeLabelText: value
    		});
    	}
    	if (field === "nodeType") {
    		this.setState({
    			nodeType: value
    		});
    	}
    }

    // 更改nodeConfig信息
    changeNodeConfigField = (field, type, e) => {
    	let value = e;
    	if (type === "input") {
    		value = e.target.value;
    	}
    	// 回填
    	const { data, onChange } = this.props;
    	const { config } = data || {};
    	config[field] = value;
    	data.config = config;
    	onChange(data);
    	this.setState({
    		auditConfig: {...config}
    	});
    }

    render() {
    	let { disabled, data, isApprovalPage } = this.props;
    	let { changeLabelText, auditConfig = {}, nodeType } = this.state;
    	if (!data) {
    		return null;
    	}
    	return (
    		<Card
    			type="inner"
    			title={nodeTypeNameMap[data.type]}
    			bordered="false"
    		>
    			<div className="param-list">
    				<Row className="param-item">
    					<Col span={24} className="param-title">
                            节点名称
    					</Col>
    					<Col span={24} className="param-content">
    						<Input
    							placeholder="请输入节点名称"
    							value={changeLabelText || undefined}
    							onChange={this.changeNodeBase.bind(this, "name", "input")}
    							disabled={disabled || isApprovalPage}
    						/>
    					</Col>
    				</Row>
    				{
    					data.type === "flow-end" &&
                        <Row className="param-item">
                        	<Col span={24} className="param-title">
                                业务回调
                        	</Col>
                        	<Col span={24} className="param-content">
                        		<Input
                        			value={auditConfig.callbackUrl || undefined}
                        			placeholder="请输入业务回调"
                        			onChange={(e) => {
                        				this.changeNodeConfigField("callbackUrl", "input", e);
                        			}}
                        			disabled={disabled}
                        		/>
                        	</Col>
                        </Row>
    				}
    				{
    					data.type === "flow-parallel" &&
                        <Radio.Group
                        	className="flow-parallel-type"
                        	value={nodeType || "parallelStart"}
                        	buttonStyle="solid"
                        	onChange={(e) => {
                        		let name = "";
                        		if (e.target.value === "parallelEnd") {
                        			name = "并行结束";
                        		} else {
                        			name = "并行开始";
                        		}
                        		this.changeNodeBase("nodeType", "input", e, name);
                        	}}
                        >
                        	<Radio.Button value="parallelStart">并行开始</Radio.Button>
                        	<Radio.Button value="parallelEnd">并行结束</Radio.Button>
                        </Radio.Group>
    				}
    			</div>
    		</Card>
    	);
    }
}

export default BaseNode;
