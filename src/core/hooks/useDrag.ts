import {useState, useEffect, useRef, useCallback} from 'react';
import {throttle} from "lodash";
import useIsMobile from "@/core/hooks/useIsMobile.ts";

interface DragState {
	isDragging: boolean;
	dragData: {
		startX: number;
		startY: number;
		endX: number;
		endY: number;
	};
}

interface DragCallBack {
	onDrag: (dragData: DragState['dragData']) => void;
	onMouseDown: (dragData?: DragState['dragData']) => void;
	onMouseUp: (DragState?: DragState['dragData']) => void;
}

const useDrag = (
	DragCallBack: Partial<DragCallBack>,
	mouseDownEle: HTMLElement | Window = window,
	mouseMoveEle: HTMLElement | Window = window,
	mouseUpEle: HTMLElement | Window = window,
): DragState => {
	const [isDragging, setIsDragging] = useState(false);
	const dragData = useRef<DragState['dragData']>({startX: 0, startY: 0, endX: 0, endY: 0});
	const isMobile = useIsMobile()
	const handleMouseDown = (e: Event) => {
		if (isMobile) {
			const event = e as TouchEvent
			dragData.current.startX = event.touches[0].clientX;
			dragData.current.startY = event.touches[0].clientY;
		} else {
			const event = e as MouseEvent
			dragData.current.startX = event.clientX
			dragData.current.startY = event.clientY
		}
		setIsDragging(true);
		DragCallBack.onMouseDown?.(dragData.current)

	};

	const handleMouseUp = () => {
		setIsDragging(false);
		DragCallBack.onMouseUp?.(dragData.current)
	};

	const handleMouseMove = useCallback(throttle((e: Event) => {
		if (!isDragging) return;
		if (!isMobile) {
			const mouseEvent = e as MouseEvent;
			dragData.current.endX = mouseEvent.clientX
			dragData.current.endY = mouseEvent.clientY
		} else {
			const touchEvent = e as TouchEvent
			dragData.current.endX = touchEvent.touches[0].clientX
			dragData.current.endY = touchEvent.touches[0].clientY
		}
		DragCallBack.onDrag?.(dragData.current)
	}, 10), [isDragging, isMobile])


	useEffect(() => {
		if (!mouseDownEle || !mouseMoveEle || !mouseUpEle)
			return
		if (!isMobile) {
			mouseDownEle.addEventListener('mousedown', handleMouseDown);
			mouseUpEle.addEventListener('mouseup', handleMouseUp);
			mouseMoveEle.addEventListener('mousemove', handleMouseMove);
		} else {
			mouseDownEle.addEventListener('touchstart', handleMouseDown, {passive: true});
			mouseUpEle.addEventListener('touchend', handleMouseUp, {passive: true});
			mouseMoveEle.addEventListener('touchmove', handleMouseMove, {passive: true});
		}

		return () => {
			if (!isMobile) {
				mouseDownEle.removeEventListener('mousedown', handleMouseDown);
				mouseUpEle.removeEventListener('mouseup', handleMouseUp);
				mouseMoveEle.removeEventListener('mousemove', handleMouseMove);
			} else {
				mouseDownEle.removeEventListener('touchstart', handleMouseDown);
				mouseUpEle.removeEventListener('touchend', handleMouseUp);
				mouseMoveEle.removeEventListener('touchmove', handleMouseMove);
			}
		};
	}, [isDragging, mouseDownEle, mouseMoveEle, mouseUpEle]);

	return {isDragging, dragData: dragData.current};
};

export default useDrag;