import fs from "fs";
import { UrlShortnerRepository } from "../repository/UrlShortnerRepository";

const SERVICE_DOMAIN = 'https://bold-url.com';

export class UrlShortner {
	private urlShortnerRepository: UrlShortnerRepository;

	constructor(){
		this.urlShortnerRepository = new UrlShortnerRepository();
	}

	public generateShortUrl(longUrl: string): string{
		const newUrlMapping = this.urlShortnerRepository.addNewMapping(longUrl);
		
		// Post Entry Creation Trigger
		newUrlMapping.shortUrl = this.encodeLongUrlId(newUrlMapping['id']);
		this.urlShortnerRepository.updateMapping(newUrlMapping);

		return `${SERVICE_DOMAIN}/${newUrlMapping.shortUrl}`;
	}

	public getLongUrl(shortUrl: string): string{
		const id = this.decodeShortUrl(shortUrl);

		const urlMapping = this.urlShortnerRepository.findMappingById(id);

		if (!urlMapping) {
			throw new Error("No Mapping Find!");
			
		}

		return urlMapping.longUrl;
	}

	private encodeLongUrlId(id: number): string{
		const base36Mapping = JSON.parse(fs.readFileSync('./database/base36-encoding-scheme.json', 'utf-8'));
		let encodedString = ''

		while(id > 0){ // Base10 to Base36 conversion
			const remainder = id%36
			encodedString += base36Mapping[remainder.toString()]
			id = Math.floor(id/36)
		}

		return encodedString.split('').reverse().join('');
	}

	private decodeShortUrl(shortUrl: string): number{
		const base36Mapping = JSON.parse(fs.readFileSync('./database/base36-decoding-scheme.json', 'utf-8'));
		let id = 0;

		let shortUrlLen = shortUrl.length-1;

		for(let i=0; i<shortUrl.length; i++){ 
			id += base36Mapping[shortUrl[i]] * Math.pow(36, shortUrlLen); // Base36 to Base10 conversion
			shortUrlLen -= 1;
		}

		return id;
	}
}