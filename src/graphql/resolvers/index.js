
import _ from 'lodash';
import axios from 'axios';


export default {
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