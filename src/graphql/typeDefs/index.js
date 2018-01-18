
// The GraphQL schema in string form
export default `
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
