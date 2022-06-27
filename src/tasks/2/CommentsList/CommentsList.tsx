import React from "react";
import getDataRequest from "../data/getDataRequest"
import s from "./style.module.css"

interface authorsType {
	id: number;
	name: string;
	avatar: string;
}

interface commentsType {
	id: number;
	created: string;
	author: number;
	likes: number;
	parent: number | null;
	text: string;
	children?: Array<commentsType>;
}

interface propsType {
	author: authorsType;
	comment: commentsType;
}

const initialState = {
	authors: [{
		id: 0,
		name: "",
		avatar: ""
	}] as Array<authorsType>,
	comments: [{
		id: 0,
		created: "",
		author: 0,
		likes: 0,
		parent: null,
		text: ""
	}] as Array<commentsType>
};

type stateType = typeof initialState;

const CommentsList = () => {
	const [state, setState] = React.useState(initialState);

	React.useEffect(() => {
		function forNesting(state: stateType) {
			const result = state.comments.map((parent: commentsType) => {
				const children = state.comments.filter((child: commentsType) => {
					if(child.id !== child.parent && child.parent === parent.id) return true;
					return false
				});

				if(children.length) parent.children = [...children];

				return parent;
			}).filter((obj: commentsType) => {
				if(obj.parent === null) return true;

				return false;
			})

			setState({authors: state.authors, comments: [...result]})
		}

		getDataRequest().then(e => forNesting(e));
	}, [getDataRequest])

	const findAuthor = (value:commentsType) => {
		return state.authors.find((a: authorsType) => {
		    if(a.id === value.author) return a
		}) || {id: 0, name: "Anonymous", avatar: ""};
	}

	const findAncestors = (element: commentsType, postsQueue: Array<commentsType>) => {
		postsQueue.push(element);

		if(element.children) {
			findAncestors(element.children[0], postsQueue)
		}
		else return false;
	}

    return (
    	<div>
	    	{state.comments.map((e: commentsType) => {
	    		const postsQueue = [] as Array<commentsType>;

	    		if(!e.children) return <Comment key={e.id} comment={e} author={findAuthor(e)} />
	    		else {
	    			findAncestors(e, postsQueue)
	    			return postsQueue.map((x: commentsType) => <Comment key={x.id} comment={x} author={findAuthor(x)} />)
	    		}
		    })}
	    </div>
    )
};

const Comment:React.FC<propsType> = (props:propsType) => {
	const {comment, author} = props;
	const date = new Date(comment.created);

	return (
		<div className={(comment.parent !== null) ? s.replyContext : s.commentContext}>
			<div className={s.header}>
				<div className={s.authorInfo}>
					<div className={s.avatar}>
						<img src={author.avatar} />
					</div>
	    		</div>
	    		<div className={s.commentInfo}>
	    			<div className={s.name}>{author.name}</div>
	    			<div className={s.created}>{date.toLocaleString()}</div>
	    		</div>
	    		<div>
					<div className={s.likes}>❤️ {comment.likes}</div>
	    		</div>
	    	</div>
	    	<div className={s.comment}>
	    		{comment.text}
	    	</div>
	    </div>
	)
}

export default CommentsList;