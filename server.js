var express 		= require('express');
var graphqlHTTP 	= require('express-graphql');
var { buildSchema } = require('graphql');

// note 1: input IDL code into schema
// note 2: schema describe complete apis type system: a. data set, b. how access
// note 3: each call validated with schema
// note 4: data has structure, and strong type
// note 5: putting exclam in the param type mean that it is required
var schema = buildSchema(`
	type Query {
		course(id: Int!): Course
		courses(topic: String!): [Course]
	},
	type Mutation {
		updateCourseTopic(id: Int!, topic: String!): Course
	},
	type Course {
		id: Int
		title: String
		author: String
		description: String
		topic: String
		url: String
	}
`);

// define data
const coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
];

// implement query function
const getCourse = (args) => {
	let id = args.id;
	return coursesData.filter(course => {
		return course.id === id;
	})[0];
}

const getCourses = (args) => {
	if (args.topic) {
		let topic = args.topic;
		return coursesData.filter(course => course.topic === topic);
	} else {
		// return all if no topic input ?
		return coursesData;
	}
}

var updateCourseTopic = function({id, topic}) {
    coursesData.map(course => {
        if (course.id === id) {
            course.topic = topic;
            return course;
        }
    });
    return coursesData.filter(course => course.id === id) [0];
}

// root resolver
// note 1: mapping actions to functions. in here, action is message
var root = { 
	course: getCourse,
	courses: getCourses,
	updateCourseTopic: updateCourseTopic
};

var app = express();
app.use('/graphql', graphqlHTTP({
	schema: schema,
	rootValue: root,
	graphiql: true,
}));

// Sample 1, get single course
// {
//   course(id: 1) {
//     title
//     author
//   }
// }
// Sample 2, get course list
// {
//   courses(topic: "Node.js") {
//     title,
//     author,
//     description,
//     topic,
//     url,
//   }
// }
// Sample 3, can write query function
// query getMultiCourse($courseTopic: String!) {
//   courses(topic: $courseTopic) {
//     title
//     author
//     description
//     topic
//     url
//   }
// }
// with query variable as input
// {
//   "courseTopic": "Node.js"
// }

// Fragement
// When combine different queries into a single resource
// Using fragment to avoid duplicate query in same set of fields
// query getCouseWithFragments($courseID1: Int!, $courseID2: Int!) {
//   course1: course(id: $courseID1) {
//     ...courseFields
//   },
//   course2: course(id: $courseID2) {
//     ...courseFields
//   }
// }

// fragment courseFields on Course {
//   title
//   author
//   description
// }
// Query variable
// { 
//     "courseID1":1,
//     "courseID2":2
// }

// Mutation function to call on client side
// mutation updateCourseTopic($id: Int!, $topic: String!) {
//   updateCourseTopic(id: $id, topic: $topic) {
//     ... courseFields
//   }
// }

// fragment courseFields on Course {
//   title
//   author
//   description
//   topic
//   url
// }
// Query variable
// {
//   "id": 1,
//   "topic": "JavaScript"
// }

app.listen(4000, () => console.log('Up in port 4000/graphql'));

