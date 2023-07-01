import fs from "fs";
import { UrlMapping } from "../interfaces/UrlMapping";

const urlMappingsFilePath = './database/urls-mappings.json';

export class UrlShortnerRepository {
	private urlsData: UrlMapping[];
	private latestId: number = 0;


	constructor(){
		this.urlsData = JSON.parse(fs.readFileSync(urlMappingsFilePath, 'utf-8'));
		this.latestId = this.urlsData.sort((a: any,b: any) => {
			if(a['id'] < b['id']) return 1
			if(a['id'] > b['id']) return -1
			return 0
		})[0]['id']
	}

	public addNewMapping(longUrl: string): UrlMapping{
		this.latestId += 1
		const newMapping: UrlMapping = {
			id: this.latestId,
			longUrl,
		}

		this.urlsData.push(newMapping);
		this.save();

		return newMapping;
	}

	public findMappingById(id: number): UrlMapping{
		return this.urlsData[this.findUrlMappingIndexById(id)];
		
	}

	public updateMapping(data: UrlMapping): UrlMapping{
		const itemIndex = this.findUrlMappingIndexById(data['id'])

		if(data.shortUrl){
			this.urlsData[itemIndex]['shortUrl'] = data.shortUrl;
		}
		this.save();

		return this.urlsData[itemIndex];
	}

	private findUrlMappingIndexById(id: number) {
		return this.urlsData.findIndex(i => {
			if(i['id'] === id) return true;
			return false;
		})
	}

	private save(): void {
		fs.writeFileSync(urlMappingsFilePath, JSON.stringify(this.urlsData))
	}
}