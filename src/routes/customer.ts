import { Customer } from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { prismaClient } from '../prisma';
import _ from 'lodash';
import { ObjectId } from 'bson';
import Fuse from 'fuse.js'

 const Customer = Type.Object({
     customer_id: Type.String(),
     customer_name: Type.String(),
     customer_age: Type.Number(),
     customer_credentials: Type.Number(),
     customer_contact: Type.Number()
	
});


const CustomerwithoutId = Type.Object({
    customer_name: Type.String(),
    customer_age: Type.Number(),
    customer_credentials: Type.Number(),
    customer_contact: Type.Number()
   
});
type CustomerwithoutId = Static<typeof CustomerwithoutId>;

const PartialcustomerWithoutId = Type.Partial(CustomerwithoutId);
type PartialcustomerWithoutId = Static<typeof PartialcustomerWithoutId>;

const CustomerParams = Type.Object({
	customer_id: Type.String(),
});
type CustomerParams = Static<typeof CustomerParams>;

const GetCustomerQuery = Type.Object({
	text: Type.Optional(Type.String()),
});
type GetCustomerQuery = Static<typeof GetCustomerQuery>;




export default async function (server: FastifyInstance) {

	// server.route({
	// 	method: 'POST',
	// 	url: '/customer',
	// 	schema: {
	// 		summary: 'Creates new customer',
	// 		tags: ['customer'],
	// 		body: CustomerwithoutId,
	// 	},
	// 	handler: async (request, reply) => {
	// 		const customer = request.body as CustomerwithoutId;
	// 		return await prismaClient.customer.create({
	// 			data: customer,
	// 		});
	// 	},
	// });

	/// Upsert one but all fields are required
	// server.route({
	// 	method: 'PUT',
	// 	url: '/customer',
	// 	schema: {
	// 		summary: 'Creates new customer + all properties are required',
	// 		tags: ['customer'],
	// 		body: Customer,
	// 	},
	// 	handler: async (request, reply) => {
	// 		const customer = request.body as Customer;
	// 		if (!ObjectId.isValid(customer.customer_id)) {
	// 			reply.badRequest('customer_id should be an ObjectId!');
	// 		} else {
	// 			return await prismaClient.customer.upsert({
	// 				where: { customer_id: customer.customer_id },
	// 				create: customer,
	// 				update: _.omit(customer, ['customer_id']),
	// 			});
	// 		}
	// 	},
	// });

	/// Update one by id
	// server.route({
	// 	method: 'PATCH',
	// 	url: '/customer/:customer_id',
	// 	schema: {
	// 		summary: 'Update a customer by id + you dont need to pass all properties',
	// 		tags: ['customer'],
	// 		body: PartialcustomerWithoutId,
	// 		params: CustomerParams,
	// 	},
	// 	handler: async (request, reply) => {
	// 		const { customer_id } = request.params as CustomerParams;
	// 		if (!ObjectId.isValid(customer_id)) {
	// 			reply.badRequest('customer_id should be an ObjectId!');
	// 			return;
	// 		}

	// 		const customer = request.body as PartialcustomerWithoutId;

	// 		return prismaClient.customer.update({
	// 			where: { customer_id },
	// 			data: customer,
	// 		});
	// 	},
	// });

	/// Delete one by id
	// server.route({
	// 	method: 'DELETE',
	// 	url: '/customer/:customer_id',
	// 	schema: {
	// 		summary: 'Deletes a customer',
	// 		tags: ['customer'],
	// 		params: CustomerParams,
	// 	},
	// 	handler: async (request, reply) => {
	// 		const { customer_id } = request.params as CustomerParams;
	// 		if (!ObjectId.isValid(customer_id)) {
	// 			reply.badRequest('contact_id should be an ObjectId!');
	// 			return;
	// 		}

	// 		return prismaClient.customer.delete({
	// 			where: { customer_id },
	// 		});
	// 	},
	// });

	/// Get one by id
	// server.route({
	// 	method: 'GET',
	// 	url: '/customer/:customer_id',
	// 	schema: {
	// 		summary: 'Returns one customer or null',
	// 		tags: ['customer'],
	// 		params: CustomerParams,
	// 		response: {
	// 			'2xx': Type.Union([Customer, Type.Null()]),
	// 		},
	// 	},
	// 	handler: async (request, reply) => {
	// 		const { customer_id } = request.params as CustomerParams;
	// 		if (!ObjectId.isValid(customer_id)) {
	// 			reply.badRequest('customer_id should be an ObjectId!');
	// 			return;
	// 		}

	// 		return prismaClient.customer.findFirst({
	// 			where: { customer_id },
	// 		});
	// 	},
	// });

	/// Get all contacts or search by name
	// server.route({
	// 	method: 'GET',
	// 	url: '/customer',
	// 	schema: {
	// 		summary: 'Gets all customers',
	// 		tags: ['customer'],
	// 		querystring: GetCustomerQuery,
	// 		response: {
	// 			'2xx': Type.Array(Customer),
	// 		},
	// 	},
	// 	handler: async (request, reply) => {
	// 		const query = request.query as GetCustomerQuery;

	// 		const customers = await prismaClient.customer.findMany();
	// 		if (!query.text) return customers;

	// 		const fuse = new Fuse(customers, {
	// 			includeScore: true,
	// 			isCaseSensitive: false,
	// 			keys: ['customer_name'],
	// 		});


	// 		const result: Customer[] = fuse.search(query.text).map((r) => r.item);
	// 		return result;
	// 	},
	// });
}