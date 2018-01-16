const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');
const {makeExecutableSchema} = require('graphql-tools');
const {printSchema} = require('graphql/utilities/schemaPrinter');

const Fuse = require('fuse.js');
const fuseOptions = {
	shouldSort: true,
	threshold: 0.5,
	location: 0,
	distance: 100,
	maxPatternLength: 32,
	minMatchCharLength: 1,
	includeScore: false,
	// keys: [
	//     {name: 'title', weight: 0.5},
	//     {name: 'summary', weight: 0.3},
	//     {name: 'owner', weight: 0.2},
	// ],
	keys: ['title', 'summary', 'owner'],
};

const data = require('./data/mods.json');
const db = data.results;
const fuzzy = new Fuse(db, fuseOptions);

// The GraphQL schema in string form
const typeDefs = `
  type Query { 
      mods(q: String, page: Int, page_size: Int): [Mod]
  }
  
  type Mod { 
      id: Int 
      title: String 
      name: String 
      owner: String
      summary: String
      
      game_versions: [String] 
      downloads_count: Int 
      current_user_rating: Int 
      ratings_count: Int 
      github_path: String
      updated_at: String
      license_flags: Int 
      license_name: String 
      license_url: String 
      homepage: String 
      created_at: String 
	  
	  tags: [Tag],
	  first_media_file: MediaFile
	  latest_release: Release
  }
  
  type Tag {
	  id: Int
	  name: String
	  title: String
	  description: String
	  type: String 	  
  }
  
  type MediaFile {
	  id: Int
	  height: Int
	  width: Int
	  size: Int
	  urls: MediaFileUrls
  }
  
  type MediaFileUrls {
	  original: String
	  thumb: String
  }
  
  type Release {
	  id: Int
	  download_url: String
	  downloads_count: Int
	  factorio_version: String
	  file_name: String
	  file_size: Int
	  game_version: String
	  released_at: String
	  version: String
  }
  
  
  type ReleaseInfo {
  	author: String
  	contact: String
  	description: String
  	dependencies: [String]
  	factorio_version: String
  	homepage: String
  	name: String
  	title: String
  	version: String
  }
`;

// The resolvers
const resolvers = {
	Query: {
		mods: (z, args) => {
			const props = Object.assign({
				q: '',
				page: 1,
				page_size: 25,
			}, args);

			const {q, page, page_size} = props;

			const startRow = (page - 1) * page_size;
			const endRow = startRow + page_size;

			console.log({
				len: db.length,
				q,
				page,
				page_size,
				startRow,
				endRow,
				z,
			});

			// return db.filter(mod => {
			//     return mod.corpus.includes('start');
			// }).slice(startRow, endRow);

			const resultSet = (q ? fuzzy.search(q) : db);

			return _.chain(resultSet)
			// .sortBy('downloads_count')
			// .reverse()
				.slice(startRow, endRow).value();
		},
	},
};

// Put together a schema
const schema = makeExecutableSchema({typeDefs, resolvers});

// Initialize the app
const app = express();

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));
app.use('/schema', (req, res) => res.type('text/plain').send(printSchema(schema)));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));

// all the things
app.use('/mods.json', (req, res) => res.json(db));

// Start the server
app.listen(3000, () => {
	console.log('Go to http://localhost:3000/graphiql to run queries!');
});
