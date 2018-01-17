const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const axios = require('axios');

const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { printSchema } = require('graphql/utilities/schemaPrinter');

// The GraphQL schema in string form
const typeDefs = `
  type Query { 
	  mod(name: String): Mod
      mods(q: String, page: Int, page_size: Int, order: String, tags: String): [ModSearchResult]
  }
  
  type Mod { 
      id: Int 
      title: String 
      name: String 
      owner: String
      description: String
      description_html: String
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
	  media_files: [MediaFile]
	  releases: [Release]
  }
  
  type ModSearchResult { 
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
		mod: (z, args) => {
			const url = `https://mods.factorio.com/api/mods/${args.name}`;
			
			return axios.get(url).then(res => _.get(res, 'data'));
		},
		
		mods: (z, args) => {
			const params = Object.assign({
				q: '',
				order: 'updated',
				tags: '',
				page: 1,
				page_size: 25,
			}, args);
			
			const url = `https://mods.factorio.com/api/mods`;			
			return axios.get(url, { params }).then(res => _.castArray(_.get(res, 'data.results')));
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
