/**
 * todo controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::todo.todo', ({ strapi }) => ({
	async create(ctx) {
		const { user } = ctx.state;
		if (!user) {
			return ctx.unauthorized('You must be logged in');
		}

		const data = ctx.request.body?.data ?? {};
		data.user = user.id;
		ctx.request.body.data = data;

		const response = await strapi.service('api::todo.todo').create({ data });
		return ctx.send(response);
	},

	async update(ctx) {
		const { user } = ctx.state;
		if (!user) {
			return ctx.unauthorized('You must be logged in');
		}

		const todoId = ctx.params.id;
		const todo = await strapi.service('api::todo.todo').findOne(todoId, { populate: ['user'] });

		if (!todo) {
			return ctx.notFound('Todo not found');
		}
		if (todo.user?.id !== user.id) {
			return ctx.forbidden('You can only update your own todos');
		}

		const data = ctx.request.body?.data ?? {};
		if (data.user) {
			delete data.user;
		}

		const response = await strapi.service('api::todo.todo').update(todoId, { data });
		return ctx.send(response);
	},

	async delete(ctx) {
		const { user } = ctx.state;
		if (!user) {
			return ctx.unauthorized('You must be logged in');
		}

		const todoId = ctx.params.id;
		const todo = await strapi.service('api::todo.todo').findOne(todoId, { populate: ['user'] });

		if (!todo) {
			return ctx.notFound('Todo not found');
		}
		if (todo.user?.id !== user.id) {
			return ctx.forbidden('You can only delete your own todos');
		}

		const response = await strapi.service('api::todo.todo').delete(todoId);
		return ctx.send(response);
	},
}));
