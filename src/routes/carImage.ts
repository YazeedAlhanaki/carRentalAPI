import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { imageController } from '../controllers/carImage';
import car from './cars';

const carImage = Type.Object({
	id: Type.String({ format: 'uuid',  $id: 'user'  }),
	imageDescription: Type.String(),
	carId: Type.String(car),
});
type carImage = Static<typeof carImage>;

export let carImages: carImage[] = [];

export default async function (server: FastifyInstance) {
	server.route({
		method: 'PUT',
		url: '/image',
		schema: {
			summary: 'Creates new image + all properties are required',
			tags: ['images'],
			body: carImage,
		},
		handler: async (request, reply) => {
			const newCar: any = request.body;
			return imageController(carImages, newCar);
		},
	}); 
    server.route({
		method: 'PATCH',
		url: '/image/:id',
		schema: {
			summary: 'Update an image by id + you dont need to pass all properties',
			tags: ['images'],
			body: Type.Partial(carImage),
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const newImage: any = request.body;
			return imageController(carImages, newImage);
		},
	});

	server.route({
		method: 'DELETE',
		url: '/image/:id',
		schema: {
			summary: 'Deletes a image',
			tags: ['images'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			carImages = carImages.filter((c) => c.id !== id);

			return carImages;
		},
	});

}