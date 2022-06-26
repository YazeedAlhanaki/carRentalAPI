import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { paymentController } from '../controllers/payment';

const Payment = Type.Object({
	id: Type.String({ format: 'uuid', $id: 'car' }),
	paymentId: Type.String(),
	paymentDate: Type.String(Date),
	rentalId: Type.String(),
	paymentAmount: Type.Number()
});
type Payment = Static<typeof Payment>;



export let payments: Payment[] = [];

export default async function (server: FastifyInstance) {
	server.route({
		method: 'PUT',
		url: '/payment',
		schema: {
			summary: 'Creates new payment + all properties are required',
			tags: ['payment'],
			body: Payment,
		},
		handler: async (request, reply) => {
			const newPayment: any = request.body;
			return paymentController(payments, newPayment);
		},
	});

	server.route({
		method: 'PATCH',
		url: '/payment/:id',
		schema: {
			summary: 'Update a payment by id + you dont need to pass all properties',
			tags: ['cars'],
			body: Type.Partial(Payment),
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const newPayment: any = request.body;
			return paymentController(payments, newPayment);
		},
	});

	server.route({
		method: 'DELETE',
		url: '/payment/:id',
		schema: {
			summary: 'Deletes a payment',
			tags: ['payments'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			payments = payments.filter((c) => c.id !== id);

			return payments;
		},
	});

	server.route({
		method: 'GET',
		url: '/payment/:id',
		schema: {
			summary: 'Returns one payment or null',
			tags: ['payment'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
			response: {
				'2xx': Type.Union([Payment, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			return payments.find((c) => c.id === id) ?? null;
		},
	});

	
}
