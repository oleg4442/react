// Your code here
// tutorial1.js
var CommentBox = React.createClass({displayName: "CommentBox",
  render: function() {
	return (
	  React.createElement("div", {className: "commentBox"}, 
		React.createElement("h1", null, "Comments"), 		
		React.createElement(CommentList, {data: this.props.data}), 
		React.createElement("commentForm", null)
	  )
	);
  }
});

var data = [
  {author: "Pete Hunt", text: "This is one comment"},
  {author: "Jordan Walke", text: "This is *another!* comment"}
];

var CommentList = React.createClass({displayName: "CommentList",
  render: function() {
	return (
	  React.createElement("div", {className: "commentList"}
	  )
	);
  }
});

var CommentForm = React.createClass({displayName: "CommentForm",
  render: function() {
	return (
	  React.createElement("div", {className: "commentForm"}, 
		"Hello, world! I am a CommentForm."
	  )
	);
  }
});

var Comment = React.createClass({displayName: "Comment",
  render: function() {
	var rawMarkup = marked(this.props.children.toString(),{sanitize: true});
	return (
	  React.createElement("div", {className: "comment"}, 
		React.createElement("h2", {className: "commentAuthor"}, 
		  this.props.author
		), 
		React.createElement("span", {dangerouslySetInnerHTML: {__html:rawMarkup}})
	  )
	);
  }
});
React.render(
  React.createElement(CommentBox, {data: data}),
  document.getElementById('content')
);