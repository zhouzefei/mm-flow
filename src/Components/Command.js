import { PureComponent, Fragment } from "react";
import { Icon, Tooltip } from "antd";
import dagre from "dagre";
import { toolBarTypeNameMap } from "../Constants/toolBarTypeNameMap"

export default class Command extends PureComponent {
    state = {};
    componentDidMount() {
		this.props.editor.on("change", () => {
			const {
				editor: {
					schema: { history }
				}
			} = this.props;
			const canRedo = history.index < history.schemaList.length - 1;
			const canUndo = history.index > 0;
			this.setState({
				canRedo,
				canUndo
			});
		});
	}

	redo = () => {
		this.props.editor.schema.redo();
	};

	undo = () => {
		this.props.editor.schema.undo();
	};

	// 格式化
	format = e => {
		e.preventDefault();
		const {
			editor: {
				schema,
				graph: { node, line }
			}
		} = this.props;
		const data = schema.getData();
		const g = new dagre.graphlib.Graph();
		g.setGraph({
			nodesep: 90
		});
		g.setDefaultEdgeLabel(function() {
			return {};
		});
		Object.values(node.nodes).forEach(item => {
			const { w, h } = item.getBBox();
			console.log(w, h);
			g.setNode(item.data.uuid, Object.assign(item.data, { width: w, height: h }));
		});
		data.lines.map(item => {
			g.setEdge(item.from, item.to);
		});
		dagre.layout(g);
		const oldData = JSON.stringify(schema.data);

		g.nodes().forEach(function(key) {
			const nodeData = g.node(key);
			node.updateNode(nodeData);
			schema.data.nodesMap[key] = nodeData;
		});
		Object.keys(line.lines).forEach(key => {
			line.updateLine(key);
			schema.data.linesMap[key] = line.lines[key].data;
		});
		const newData = JSON.stringify(schema.data);
		if (oldData !== newData) {
			schema.history.push(JSON.parse(oldData));
		};
		setTimeout(() => {
			this.props.editor.controller.autoFit();
		}, 300);
	};


    clickEvent = (type) => {
		const { canRedo, canUndo } = this.state;
		const { controller, paper } = this.props.editor || {};
		switch(type){
			case "redo": return canRedo && this.redo;
			case "undo": return canUndo && this.undo;
			case "zoom-in": return ()=>{controller.zoom(1.05);};
			case "zoom-out": return ()=>{controller.zoom(0.95);};
			case "fullscreen": return ()=>{controller.autoFit();};
			case "fullscreen-exit": return ()=>{
				const transform = paper.transform();
				const { scalex } = transform.localMatrix.split();
				controller.zoom(1 / scalex);
			};
		}
    }

    getClassName = (type) => {
		const { canRedo, canUndo } = this.state;
		let disableClass = "";
		switch(type){
			case "redo": if(!canRedo){ disableClass= "disable"}; break;
			case "undo": if(!canUndo){ disableClass= "disable"}; break;
		}
		return disableClass;
    }

    getCommandChild = () => {
        let child = [];
        const { types = [] } = this.props;
        types && 
        types.length>0 && 
        types.forEach(type=>{
			if(type){
				child.push(
					<Tooltip title={toolBarTypeNameMap[type]} key={type}>
						<Icon
							type={type}
							onClick={this.clickEvent(type)}
							className={this.getClassName(type)}
						/>
					</Tooltip>
				)
			}
		})
        return child;
    }
	render() {
		return (
			<div>
                {this.getCommandChild()}
			</div>
		);
	}
}
