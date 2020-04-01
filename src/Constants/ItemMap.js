export const FLOW_ITEM = [
	{
		type: "flow-start",
		name: "开始",
		size: [50, 50],
		component: "base",
		isRoot: true,
		nodeType: "start",
		config: {}
	},
	{
		type: "flow-end",
		name: "结束",
		size: [50, 50],
		component: "base",
		isRoot: false,
		nodeType: "end",
		config: {
			callbackUrl: null
		}
	},
	{
		type: "flow-audit",
		name: "审批节点",
		size: [100, 40],
		iconPath: "",
		component: "audit",
		isRoot: false,
		nodeType: "audit",
		config: {
			type: "byHand",
			formId: null,
			auditBy: "role",
			auditRole: null,
			auditRoleName: null,
			transferRoles: [],
			auditUser: null,
			auditUserName: null,
			auditVariable: "",
			auditPattern: "normal",
			overtimeConfig: {
				time: null,
				timeUnit: "hour",
				action: "pass",
				transferRole: null,
				transferRoleName: null,
				callbackUrl: null
			},
			callbackUrl: null,
			countersignPassRate: null // 会签通过率
		}
	},
	{
		type: "flow-exclusivity",
		name: "排他",
		size: [78, 72],
		component: "base",
		isRoot: false,
		nodeType: "decide",
		config: {}
	},
	{
		type: "flow-parallel",
		name: "并行开始",
		size: [78, 72],
		component: "base",
		nodeType: "parallelStart",
		config: {}
	}
];
