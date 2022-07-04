import { FastifyInstance } from "fastify";
import bcrypt from 'bcrypt'
import { prismaClient } from "../prisma";
import { Static, Type } from "@sinclair/typebox";
import jwt = require("jsonwebtoken");
const saltround = 10
const mySecret = "secret";
import "@fastify/jwt"
const UserWithoutId = Type.Object({
	email: Type.String(),
	username: Type.String(),
	password: Type.String(),});
type UserWithoutId = Static<typeof UserWithoutId>;
export default async function (server: FastifyInstance) {
    server.route({
		method: 'POST',
		url: '/user/create',
		schema: {
			summary: 'Creates new user',
			tags: ['user'],
			body: UserWithoutId,
		},
		handler: async (request, reply) => {
			const user = request.body as any
			const encryptedPassword = bcrypt.hashSync(user.password, saltround)
			return await prismaClient.user.create({
				data: {
					...user,
					password:encryptedPassword
				}})	},}); 
    server.route({
		method: 'POST',
		url: '/user/login',
		schema: {
			summary: 'login a user',
			tags: ['user'],
			body: Type.Object({
				username: Type.String(),
				password: Type.String(),}),},
		handler: async (request, reply) => {
			const body = request.body as any;
			const user = await prismaClient.user.findFirst({
				where: {
					username: body.username,
				},});
			if (!user) {
				return { msg: 'user not found' };}
			const isValid = await bcrypt.compare(body.password, user.password);
			if (!isValid) {
				return { msg: 'password is incorrect' };
			}
            let token = jwt.sign({ _id: user.user_id, username: user.username }, mySecret);
          reply.send({ msg: "User logged in", token: token });
			return user;
		},});}


