/**
 * todo controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::todo.todo', ({ strapi }) => ({
	async find(ctx) {
		const { user } = ctx.state;
		if (!user) {
			return ctx.unauthorized('You must be logged in');
		}

		const existingFilters = (ctx.query?.filters ?? {}) as Record<string, unknown>;
		const filters = {
			...existingFilters,
			user: { id: user.id },
		};
		const response = await strapi.service('api::todo.todo').find({
			...ctx.query,
			filters,
			publicationState: 'preview',
		});
		const { results, pagination } = response as { results: unknown; pagination: unknown };
		// Ensure the API response follows Strapi REST format: { data, meta }
		return this.transformResponse(results, { pagination });
	},

	async create(ctx) {
		const { user } = ctx.state;
		if (!user) {
			return ctx.unauthorized('You must be logged in');
		}

		const incoming = (ctx.request.body?.data ?? {}) as Record<string, unknown>;
		const data: Record<string, unknown> = {
			title: typeof incoming.title === 'string' ? incoming.title : undefined,
			isCompleted: typeof incoming.isCompleted === 'boolean' ? incoming.isCompleted : undefined,
			user: user.id,
		};
		// Clean undefined keys
		Object.keys(data).forEach((key) => {
			if (data[key] === undefined) {
				delete data[key];
			}
		});

		if (!data.title) {
			return ctx.badRequest('Title is required');
		}
		const todoContentType = strapi.contentType('api::todo.todo');
		if (todoContentType?.options?.draftAndPublish) {
			data.publishedAt = new Date().toISOString();
		}
		ctx.request.body = { data };
		const response = await strapi.service('api::todo.todo').create({ data });
		return this.transformResponse(response);
	},

	async update(ctx) {
		const { user } = ctx.state;
		if (!user) {
			return ctx.unauthorized('You must be logged in');
		}

		const idParam = String(ctx.params.id ?? '');
		if (!idParam) {
			return ctx.badRequest('Invalid todo id');
		}
		const isNumericId = /^\d+$/.test(idParam);
		const where = isNumericId ? { id: Number(idParam) } : { documentId: idParam };
		const todo = (await strapi.db.query('api::todo.todo').findOne({
			where,
			populate: { user: true },
		})) as { user?: { id?: number } } | null;

		if (!todo) {
			return ctx.notFound('Todo not found');
		}
		if (todo?.user?.id !== user.id) {
			return ctx.forbidden('You can only update your own todos');
		}

		const incoming = (ctx.request.body?.data ?? {}) as Record<string, unknown>;
		const data: Record<string, unknown> = {};
		if (typeof incoming.title === 'string') {
			data.title = incoming.title;
		}
		if (typeof incoming.isCompleted === 'boolean') {
			data.isCompleted = incoming.isCompleted;
		}
		if (Object.keys(data).length === 0) {
			return ctx.badRequest('No valid fields to update');
		}

		const response = await strapi.db.query('api::todo.todo').update({
			where,
			data,
		});
		return this.transformResponse(response);
	},

	async delete(ctx) {
		const { user } = ctx.state;
		if (!user) {
			return ctx.unauthorized('You must be logged in');
		}

		const idParam = String(ctx.params.id ?? '');
		if (!idParam) {
			return ctx.badRequest('Invalid todo id');
		}
		const isNumericId = /^\d+$/.test(idParam);
		const where = isNumericId ? { id: Number(idParam) } : { documentId: idParam };
		const todo = (await strapi.db.query('api::todo.todo').findOne({
			where,
			populate: { user: true },
		})) as { user?: { id?: number } } | null;

		if (!todo) {
			return ctx.notFound('Todo not found');
		}
		if (todo?.user?.id !== user.id) {
			return ctx.forbidden('You can only delete your own todos');
		}
		const response = await strapi.db.query('api::todo.todo').delete({ where });
		return this.transformResponse(response);
	},
}));
