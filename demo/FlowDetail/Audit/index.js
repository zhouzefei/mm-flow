import { PureComponent, Fragment } from "react";
import { Card, Input, Row, Col, Select, Tooltip, Icon, Radio } from "antd";
import { isEqual } from "lodash";

const { Option } = Select;
const initData = ()=>({
	changeLabelText: "审批节点",
	auditConfig: {},
	selectInfo: {
		selectVisible: false,
		selectType: null,
		selectBy: null
	}
});
class AuditNode extends PureComponent {
    state = {
    	...initData()
    };

    componentWillMount() {
    	this.initAuditNode(this.props);
    }

    componentWillReceiveProps(nextProps) {
    	if (!isEqual(nextProps.data, this.props.data)) {
    		console.log("just once");
    		this.initAuditNode(nextProps);
    	}
    }

    initAuditNode = (props) => {
    	const { data } = props;
    	let { config, name } = data || {};
    	this.setState({
    		auditConfig: {...config},
    		changeLabelText: name
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
    	if (field === "name") {
    		this.setState({
    			changeLabelText: value
    		});
    	}
    }

    // 更改nodeConfig信息
    changeNodeConfigField = (field, type, e, needChangeIcon) => {
    	let value = e;
    	if (type === "input") {
    		value = e.target.value;
    	}
    	// 回填
    	const { data, onChange } = this.props;
    	console.log(data);

    	const { config } = data || {};
    	config[field] = value;
    	data.config = config;

    	onChange(data);
    	this.setState({
    		auditConfig: {...config}
    	});
    }

    render() {
    	let { disabled, auditFlowStore, auditDetailStore = {}, data, isApprovalPage } = this.props;
    	let { formList, flowInfo = {} } = auditFlowStore || {};
    	let { auditConfig = {}, changeLabelText, selectInfo } = this.state;
    	let { overtimeConfig = {}, transferRoles = [], auditUser, auditPattern } = auditConfig;
    	if (!data) {
    		return null;
    	}
    	if (auditPattern !== "normal" && auditUser) {
    		auditUser = auditUser.split(";");
    	}
    	// 拼接展示信息
    	flowInfo = flowInfo || {};
    	if (isApprovalPage) {
    		flowInfo = auditDetailStore;
    	}
    	return (
    		<Card
    			type="inner"
    			title="审批节点"
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
    				<Row className="param-item">
    					<Col span={24} className="param-title">
                            节点类型
    					</Col>
    					<Col span={24} className="param-content">
    						<Select
    							placeholder="请选择"
    							value={auditConfig.type || undefined}
    							onChange={(value) => {
    								this.changeNodeConfigField("type", "select", value);
    							}}
    							disabled={disabled}
    						>
    							<Option value="auto" disabled>自动节点</Option>
    							<Option value="byHand">人工节点</Option>
    						</Select>
    					</Col>
    				</Row>
    				<Row className="param-item">
    					<Col span={24} className="param-title">
                            审核模式<Icon type="question-circle" className="ml10" />
    					</Col>
    					<Col span={24} className="param-content">
    						<Radio.Group
    							disabled={disabled}
    							value={auditConfig.auditPattern || "normal"}
    							onChange={(value) => {
    								this.changeNodeConfigField("auditUser", "select", "");
    								this.changeNodeConfigField("auditPattern", "input", value, true);
    							}}
    						>
    							<Radio value="normal">普通</Radio>
    							<Radio value="countersign">会签</Radio>
    						</Radio.Group>
    					</Col>
    				</Row>
    				{/* 普通模式 */}
    				{
    					auditConfig.auditPattern !== "countersign" &&
                        <Fragment>
                        	<Row className="param-item">
                        		<Col span={24} className="param-title">
                                    操作人
                        		</Col>
                        		<Col span={24} className="param-content">
                        			<Select
                        				value={auditConfig.auditBy || undefined}
                        				onChange={(value) => {
                        					this.changeNodeConfigField("auditBy", "select", value);
                        					// 变更操作人的时候重置具体人员
                        					this.changeNodeConfigField("auditRoleName", "select", "");
                        					this.changeNodeConfigField("auditUserName", "select", "");
                        					this.changeNodeConfigField("auditVariable", "select", "");
                        				}}
                        				disabled={disabled}
                        			>
                        				<Option value="role">指定角色</Option>
                        				<Option value="user">指定操作员</Option>
                        				<Option value="variable">自定义变量</Option>
                        			</Select>
                        		</Col>
                        	</Row>
                        	<Row className="param-item">
                        		<Col span={24} className="param-title">
                                    超时配置
                        		</Col>
                        		<Col span={24} style={{ lineHeight: "32px" }}>
                                    超时时间
                        		</Col>
                        		<Col span={24} className="param-content">
                        			<Input
                        				value={overtimeConfig.time || undefined}
                        				addonAfter="小时"
                        				placeholder="请输入超时时间"
                        				onChange={(e) => {
                        					let value = e.target.value;
                        					if (value) {
                        						value = parseInt(value, 10);
                        					}
                        					let newOverTimeConfig = {...overtimeConfig};
                        					newOverTimeConfig["time"] = value;
                        					this.changeNodeConfigField("overtimeConfig", "select", newOverTimeConfig);
                        				}}
                        				disabled={disabled}
                        			/>
                        		</Col>
                        		<Col span={24} style={{ lineHeight: "32px" }}>
                                    超时动作
                        		</Col>
                        		<Col span={24} className="param-content">
                        			<Select
                        				style={{ width: "100%" }}
                        				placeholder="请选择超时动作"
                        				value={overtimeConfig.action || undefined}
                        				onChange={(value) => {
                        					let newOverTimeConfig = {...overtimeConfig};
                        					newOverTimeConfig["action"] = value;
                        					this.changeNodeConfigField("overtimeConfig", "select", newOverTimeConfig);
                        				}}
                        				disabled={disabled}
                        			>
                        				<Option value="pass">通过</Option>
                        				<Option value="refuse">拒绝</Option>
                        				<Option value="transfer">转办</Option>
                        				<Option value="overrule">驳回上一步</Option>
                        			</Select>
                        		</Col>
                        		{
                        			overtimeConfig.action &&
                                    overtimeConfig.action === "transfer" &&
                                    <Fragment>
                                    	<Col span={24} style={{ lineHeight: "32px" }}>
                                            转办角色
                                    	</Col>
                                    	<Col span={24} className="param-content">
                                    		<Input
                                    			value={overtimeConfig.transferRoleName || undefined}
                                    			placeholder="点击选择角色"
                                    			suffix={
                                    				<Tooltip title="点击选择角色" placement="left">
                                    					<Icon
                                    						type="select"
                                    						style={{
                                    							color: "rgba(0,0,0,.45)",
                                    							cursor: "pointer"
                                    						}}
                                    						onClick={() => {
                                    							this.setState({
                                    								selectInfo: {
                                    									selectVisible: true,
                                    									selectType: "role",
                                    									selectBy: "transferRole"
                                    								}
                                    							});
                                    						}}
                                    					/>
                                    				</Tooltip>
                                    			}
                                    			onClick={() => {
                                    				this.setState({
                                    					selectInfo: {
                                    						selectVisible: true,
                                    						selectType: "role",
                                    						selectBy: "transferRole"
                                    					}
                                    				});
                                    			}}
                                    			readOnly
                                    			disabled={disabled}
                                    		/>
                                    	</Col>
                                    </Fragment>
                        		}
                        		<Col span={24} style={{ lineHeight: "32px" }}>
                                    超时回调
                        		</Col>
                        		<Col span={24} className="param-content">
                        			<Input
                        				value={overtimeConfig.callbackUrl || undefined}
                        				placeholder="请输入超时回调"
                        				onChange={(e) => {
                        					let value = e.target.value;
                        					let newOverTimeConfig = {...overtimeConfig};
                        					newOverTimeConfig["callbackUrl"] = value;
                        					this.changeNodeConfigField("overtimeConfig", "select", newOverTimeConfig);
                        				}}
                        				disabled={disabled}
                        			/>
                        		</Col>
                        	</Row>
                        </Fragment>
    				}

    				{/* 会签模式 */}
    				{
    					auditConfig.auditPattern === "countersign" &&
                        <Row className="param-item">
                        	<Col span={24} style={{ lineHeight: "32px" }}>
                                通过率
                        	</Col>
                        	<Col span={24} className="param-content">
                        		<Input
                        			value={auditConfig.countersignPassRate || undefined}
                        			addonAfter="%"
                        			placeholder="输入会签通过率"
                        			onChange={(e) => {
                        				this.changeNodeConfigField("countersignPassRate", "input", e);
                        			}}
                        			disabled={disabled}
                        		/>
                        	</Col>
                        </Row>
    				}
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
    			</div>
    		</Card>
    	);
    }
}

export default AuditNode;
