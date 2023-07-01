import { Get, HeaderParam, HttpCode, JsonController, Param, Post, Res } from "routing-controllers";
import { UrlShortner } from "../service/UrlShortner";
import express from "express";

@JsonController('/url-shortner')
export class UrlShortnerController {
	private urlShortner: UrlShortner;

	constructor(){
		this.urlShortner = new UrlShortner();
	}

	@Post()
	public generateShortUrl(
		@HeaderParam('longurl') url: string
	){
		return this.urlShortner.generateShortUrl(url);
	}

	/**
	 * This will be a separate microservice.
	 */
	@Get('/redirect/:shorturl')
	@HttpCode(301)
	public redirect(
		@Param('shorturl') url: string,
		@Res() res: express.Response
	){
		const longUrl = this.urlShortner.getLongUrl(url);

		res.redirect(longUrl);
	}
}