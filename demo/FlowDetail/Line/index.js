import { PureComponent, Fragment } from "react";
import { Card, Switch, Input, Select, Row, Col, Icon, Popover } from "antd";
import { isEqual } from "lodash";

const { Option } = Select;
const initData = () =>({
	label: null,
	defaultCondition: null,
	priority: null,
	condition: null
});
const { TextArea } = Input;
class Line extends PureComponent {

    state = {
    	...initData(),
    	showFormulaEditor: false
    };

    componentDidMount() {
    	this.initLine(this.props);
    }

    componentWillReceiveProps(nextProps) {
    	if (!isEqual(nextProps.data, this.props.data)) {
    		console.log("just once");
    		this.setState({
    			...initData()
    		}, ()=>{
    			this.initLine(nextProps);
    		});
    	}
    }

    initLine = (props) => {
    	const { data } = props;
    	let { label, defaultCondition, priority, condition } = data || {};
    	this.setState({
    		showFormulaEditor: false
    	}, ()=>{
    		this.setState({
    			label: label || null,
    			defaultCondition: defaultCondition || null,
    			priority: priority || null,
    			condition: condition || null,
    			showFormulaEditor: true
    		});
    	});
    }

    // 更改基础节点信息
    changeNodeBase = (field, type, e) => {
    	let value = e;
    	if (type === "input") {
    		value = e.target.value;
    	}
    	const { data, onChange } = this.props;
    	data[field] = value;
    	onChange(data);

    	this.setState({
    		[field]: value
    	});
    }

    // 获取并行 排他的来源节点
    getFromNodes = () => {
    	let fromNodes = [];
    	const { data, editor } = this.props;
    	const { line, node } = editor.graph;
    	const { nodes = {} } = node || {};
    	const { lines = [] } = line || {};
    	const { from } = data || {};
    	const fromNode = nodes[from];
    	// 排他开始 或 排他结束 或 并行结束 线条飘红
    	const { data: startData } = fromNode;
    	if (startData.type === "flow-parallel" && startData.nodeType === "parallelEnd") {
    		const { fromLines } = fromNode;
    		if (fromLines.size > 0) {
    			fromLines.forEach(fromLine=>{
    				const line = lines[fromLine];
    				const { data } = line;
    				const preNode = nodes[(data || {})["from"]].data;
    				fromNodes.push({
    					name: preNode.name,
    					value: preNode.uuid
    				});
    			});
    		}
    	}
    	return fromNodes;
    }
    render() {
    	let { disabled, data, needConfig, editor } = this.props;
    	const conditionFromNodes = this.getFromNodes();
    	const { node } = editor.graph;
    	const { nodes = {} } = node || {};
    	const { from } = data || {};
    	const fromNode = nodes[from];
    	if (!data) {
    		return null;
    	}
    	const { label, defaultCondition, priority, condition, showFormulaEditor} = this.state || {};
    	const fromNodeType = fromNode.data.type;
    	return (
    		<Card
    			type="inner"
    			title="条件属性"
    			bordered="false"
    		>
    			{
    				needConfig
    			    ? <div className="param-list">
    						<Row className="param-item">
    							<Col span={24} className="param-title">
                                    条件名称
    							</Col>
    							<Col span={24} className="param-content">
    								<Input
    									placeholder="请输入条件显示名称"
    									defaultValue={label}
    									value={label || undefined}
    									onChange={(e) => {
    										this.changeNodeBase("label", "input", e);
    									}}
    									disabled={disabled}
    								/>
    							</Col>
    						</Row>
    						{
    							fromNodeType === "flow-exclusivity" &&
                                <Fragment>
                                	<Row className="param-item">
                                		<Col span={24} className="param-title">
                                            是否默认条件
                                		</Col>
                                		<Col span={24} className="param-content">
                                			<Switch
                                				disabled={disabled}
                                				checkedChildren="是"
                                				unCheckedChildren="否"
                                				checked={defaultCondition}
                                				onChange={(value) => {
                                					this.changeNodeBase("defaultCondition", "select", value);
                                				}}
                                			/>
                                		</Col>
                                	</Row>
                                	<Row className="param-item">
                                		<Col span={24} className="param-title">
                                            优先级
                                		</Col>
                                		<Col span={24} className="param-content">
                                			<Select
												placeholder="请选择优先级"
                                				disabled={disabled}
                                				value={priority || undefined}
                                				onChange={(value) => {
                                					this.changeNodeBase("priority", "select", value);
                                				}}
                                			>
                                				<Option value="1">高</Option>
                                				<Option value="2">中</Option>
                                				<Option value="3">低</Option>
                                			</Select>
                                		</Col>
                                	</Row>
                                	<Row className="param-item">
                                		<Col span={24} className="param-title">
                                            表达式
                                			<Popover
                                				content={
                                					<div style={{ width: "300px" }}>
                                						<p>常用操作符：+、-、*、/、%、==、!=、||、&&、and、or等ognl表达式操作符，变量名使用占位符</p>
                    						            <p>例如：(${"{age}"}>=20 && ${"{amount}"}>=1000) or ${"{amount}"}&lt;100</p>
                                					</div>
                                				}
                                				title="表达式示例"
                                			>
                                				<Icon type="exclamation-circle" className="ml10"/>
                                			</Popover>
                                		</Col>
                                		<Col span={24} className="param-content">
                                			<TextArea
                                				placeholder="请输入表达式"
                                				value={condition || undefined}
                                				onChange={(e) => {
                                					this.changeNodeBase("condition", "input", e);
                                				}}
                                				rows={4}
                                				disabled={disabled}
                                			/>
                                		</Col>
                                	</Row>
                                </Fragment>
    						}
    					</div>
    					: <div className="condition-list mt20">
    						<div className="none-data">
    							<Icon type="smile" />
    							<p>
                                    无需配置
    							</p>
    						</div>
    					</div>
    			}
    		</Card>
    	);
    }
}

export default Line;
