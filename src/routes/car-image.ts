import { CarImage } from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { prismaClient } from '../prisma';
import _ from 'lodash';
import { ObjectId } from 'bson';
import Fuse from 'fuse.js'
const CarImage = Type.Object({
	image_id: Type.String(),
    imageURL: Type.String(),
    car_id: Type.String(),
});
const carImageWithoutId = Type.Object({
    imageURL: Type.String(),
    car_id: Type.String(),
});
type carImageWithoutId = Static<typeof carImageWithoutId>;

const GetImagesQuery = Type.Object({
	text: Type.Optional(Type.String()),
});
type GetImagesQuery = Static<typeof GetImagesQuery>;

export default async function (server: FastifyInstance) {
	server.route({
		method: 'POST',
		url: '/carImage',
		schema: {
			summary: 'Creates new car image',
			tags: ['image'],
			body: carImageWithoutId,
		},
		handler: async (request, reply) => {
			const image = request.body as carImageWithoutId;
			return await prismaClient.carImage.create({
				data: image,
			});
		},
	});
	server.route({
		method: 'GET',
		url: '/carImage',
		schema: {
			summary: 'Gets all images',
			tags: ['image'],
			querystring: GetImagesQuery,
			response: {
				'2xx': Type.Array(CarImage),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetImagesQuery;

			const images = await prismaClient.carImage.findMany();
			if (!query.text) return images;

			const fuse = new Fuse(images, {
				includeScore: true,
				isCaseSensitive: false,
				includeMatches: true,
				findAllMatches: true,
				threshold: 1,
				keys: ['name', 'phone'],
			});
			console.log(JSON.stringify(fuse.search(query.text)));
			const result: CarImage[] = fuse.search(query.text).map((r) => r.item);
			return result;
		},
	});

}
