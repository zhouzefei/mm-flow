import { PureComponent, Fragment } from "react";

export default class ItemPanel extends PureComponent {
    state = {
    	dragItem: undefined,
    	moving: false,
    	pageX: "",
    	pageY: ""
    }

	// 生成新节点
	onDrop = (item, e) => {
		const {size = []} = item || {};
		const { editor } = this.props;
		const dom = editor.dom.node;
		const name = item.name;
		const transform = editor.paper.transform();
		const info = transform.globalMatrix.split();
		if (e.clientX - dom.offsetLeft < 0 || e.clientY - dom.offsetTop < 0) return;
		const x = (e.clientX - dom.offsetLeft - info.dx) / info.scalex - (size[0] / 2) * info.scalex;
		const y = (e.clientY - dom.offsetTop - info.dy) / info.scalex - (size[1] / 2) * info.scalex;
		editor.graph.node.addNode(
			Object.assign({}, JSON.parse(JSON.stringify(item)), {
				name,
				x,
				y
			})
		);
	};

    onDrag(item) {
    	this.setState({
    		dragItem: item,
    		moving: false
    	});
    	this.addEvents();
    }

    addEvents() {
    	const mousemove = e => {
    		this.setState({
    			pageX: e.pageX,
    			pageY: e.pageY,
    			moving: true
    		});
    	};
    	const mouseup = e => {
    		this.onDrop(this.state.dragItem, e);
    		this.setState({
    			dragItem: undefined
    		});
    		window.document.removeEventListener("mousemove", mousemove);
    		window.document.removeEventListener("mouseup", mouseup);
    	};

    	window.document.addEventListener("mousemove", mousemove);
    	window.document.addEventListener("mouseup", mouseup);
    }

    render() {
    	const { dragItem = {}, moving, pageX = 0, pageY = 0 } = this.state || {};
		const {size = []} = dragItem || {};
		const { disabled, children } = this.props
    	return (
    		<div className="flow-editor-sidebar">
				{
    				disabled &&
                    <div className="flow-item-mask"></div>
    			}
    			<div
    				style={{
    					left: dragItem.name ? pageX - size[0] / 2 : -9999,
    					top: dragItem.name ? pageY - size[1] / 2 : -9999,
    					display: moving && dragItem.name ? "block" : "none"
    				}}
    				className={`${dragItem.type || ""} flow-item drag-item`}
    			>
    				{
    					dragItem.image ? 
                            <img src={dragItem.image}/>
    						: dragItem.name
    				}
    			</div>
				<div className="flow-item-panel">
					{
						React.Children.map(children, (child) => {
							return (
								<div 
									draggable={false} 
									onMouseDown={() => {
										this.onDrag(child.props);
									}}
								>{child}</div>
							)
						})
					}
				</div>
    		</div>
    	);
    }
}