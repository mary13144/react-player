import {useReducer} from "react";

const useUpdate = ()=>{

	const [,forceUpdate] = useReducer(v=>v+1,0)

	return forceUpdate
}

export default useUpdate
